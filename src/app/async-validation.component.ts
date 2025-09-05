import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import type { Signal } from '@angular/core';
import {
  Component,
  signal,
} from '@angular/core';
import {
  Control,
  customError,
  form,
  required,
  schema,
  validateAsync,
} from '@angular/forms/signals';

import { getDefaultErrorMessage } from './validators';

// Mock API service for async validation
class UserService {
  async checkUsernameAvailability(
    username: string
  ): Promise<{ available: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const takenUsernames = ['admin', 'user', 'test'];
    return { available: !takenUsernames.includes(username.toLowerCase()) };
  }
}

@Component({
  selector: 'app-async-validation',
  imports: [Control, JsonPipe],
  template: `
    <div class="container">
      <h1>Async Validation Example</h1>
      <p class="description">
        Username availability check with real-time async validation using
        httpResource and a simulated API endpoint. Try typing 'admin', 'user',
        'test', 'root', or 'system' to see validation errors.
      </p>

      <form class="form">
        <div class="form-group">
          <label for="username">Username *</label>
          <input
            id="username"
            [control]="form.username"
            class="form-control"
            placeholder="Enter a unique username"
            autocomplete="username"
          />

          @if (form.username().pending()) {
          <div class="pending-message">
            <span class="spinner"></span>
            Checking availability...
          </div>
          } @for (error of form.username().errors(); track error.kind) {
          <div class="error-message">
            {{
              error.message || getDefaultErrorMessage(error.kind, 'Username')
            }}
          </div>
          } @if (form.username().valid() && form.username().value() &&
          !form.username().pending()) {
          <div class="success-message">✓ Username is available!</div>
          }
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="form().invalid() || form.username().pending()"
            [class.disabled]="form().invalid() || form.username().pending()"
          >
            @if (form.username().pending()) {
            <span class="spinner-small"></span>
            } Register Username
          </button>

          <button type="button" class="reset-button" (click)="resetForm()">
            Reset
          </button>
        </div>

        <div class="debug-info">
          <h3>Form State</h3>
          <div class="debug-content">
            <p><strong>Valid:</strong> {{ form().valid() }}</p>
            <p><strong>Invalid:</strong> {{ form().invalid() }}</p>
            <p><strong>Dirty:</strong> {{ form().dirty() }}</p>
            <p><strong>Touched:</strong> {{ form().touched() }}</p>
            <p><strong>Pending:</strong> {{ form.username().pending() }}</p>
            <p><strong>Value:</strong></p>
            <pre>{{ model() | json }}</pre>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class AsyncValidationComponent {
  // Make the helper function available in the template
  getDefaultErrorMessage = getDefaultErrorMessage;

  private userService = new UserService();

  /**
   * This example demonstrates async validation using httpResource with a simulated API endpoint.
   *
   * Key features:
   * - Uses Angular's httpResource for reactive HTTP calls
   * - Mock API interceptor simulates real backend responses
   * - Real HTTP request/response cycle with network delays
   * - Automatic request cancellation when parameters change
   *
   * The mock interceptor catches POST requests to '/api/check-username' and returns:
   * - { available: false } for usernames: admin, user, test, root, system
   * - { available: true } for all other usernames
   * - Simulated network delays between 500-1500ms
   */

  model = signal({ username: '' });

  form = form(
    this.model,
    schema((user) => {
      required(user.username);
      validateAsync(user.username, {
        params: ({ value }) => ({ username: value() }),

        // Option 1: Using httpResource with simulated endpoint
        factory: (paramsSignal: Signal<{ username: string } | undefined>) =>
          httpResource(() => {
            const params = paramsSignal();
            if (!params?.username || params.username.trim() === '') {
              return undefined; // Skip request for empty usernames
            }
            return {
              url: '/api/check-username',
              method: 'POST' as const,
              body: { username: params.username },
            };
          }),

        // Option 2: Using resource with custom loader (previous mock implementation)
        // factory: (paramsSignal: Signal<{ username: string } | undefined>) =>
        //   resource({
        //     params: () => paramsSignal(),
        //     loader: ({ params }) => {
        //       if (!params?.username || params.username.trim() === '') {
        //         return Promise.resolve(null);
        //       }
        //       return this.userService.checkUsernameAvailability(
        //         params.username
        //       );
        //     },
        //   }),

        errors: (result: { available?: boolean } | null, ctx) => {
          if (result && result.available === false) {
            return customError({
              kind: 'usernameTaken',
              message: 'This username is already taken',
            });
          }
          return null;
        },
      });
    })
  );

  resetForm() {
    this.model.set({ username: '' });
  }
}
