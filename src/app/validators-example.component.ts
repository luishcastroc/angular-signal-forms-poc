import { JsonPipe } from '@angular/common';
import {
  Component,
  signal,
} from '@angular/core';
import {
  Control,
  form,
} from '@angular/forms/signals';

import {
  CANADIAN_PROVINCES,
  ShippingAddress,
  US_STATES,
  validateShippingAddress,
} from './validators';

@Component({
  selector: 'app-validators-example',
  imports: [Control, JsonPipe],
  template: `
    <div class="container">
      <h1>{{ title }}</h1>
      <p class="description">
        This example demonstrates custom validators for shipping addresses with
        real-time validation and error messages.
      </p>

      <div class="info-box">
        <h3>Try these scenarios to test validation:</h3>
        <ul>
          <li>
            <strong>Shipping Restrictions:</strong> Select "United States" and
            try Alaska (AK) or Hawaii (HI)
          </li>
          <li>
            <strong>US ZIP Code:</strong> Enter invalid formats like "123" or
            "ABCDE" for US addresses
          </li>
          <li>
            <strong>Canadian Postal Code:</strong> Enter invalid formats like
            "123456" for Canadian addresses
          </li>
          <li>
            <strong>Valid Examples:</strong> US: "12345" or "12345-6789",
            Canada: "A1A 1A1"
          </li>
        </ul>
      </div>

      <form class="form">
        <div class="form-group">
          <label for="country">Country</label>
          <select id="country" [control]="form.country" class="form-control">
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
        </div>

        <div class="form-group">
          <label for="state">State/Province</label>
          <select id="state" [control]="form.state" class="form-control">
            <option value="">Select a state</option>
            @if (form.country().value() === 'US') { @for (state of usStates;
            track state.code) {
            <option [value]="state.code">{{ state.name }}</option>
            } } @if (form.country().value() === 'CA') { @for (province of
            canadianProvinces; track province.code) {
            <option [value]="province.code">{{ province.name }}</option>
            } }
          </select>
        </div>

        <div class="form-group">
          <label for="zipCode">{{
            form.country().value() === 'CA' ? 'Postal Code' : 'ZIP Code'
          }}</label>
          <input
            id="zipCode"
            [control]="form.zipCode"
            class="form-control"
            [placeholder]="
              form.country().value() === 'CA'
                ? 'A1A 1A1'
                : '12345 or 12345-6789'
            "
          />
        </div>

        @if (form().errors().length > 0) {
        <div class="error-container">
          @for (error of form().errors(); track error.kind) {
          <div class="error-message">
            <i class="error-icon">⚠️</i>
            {{ error.message }}
          </div>
          }
        </div>
        }

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="form().invalid()"
            [class.disabled]="form().invalid()"
          >
            Calculate Shipping
          </button>

          <button type="button" class="reset-button" (click)="resetForm()">
            Reset
          </button>
        </div>
      </form>

      <div class="debug-info">
        <h3>Form State</h3>
        <div class="debug-content">
          <p><strong>Valid:</strong> {{ form().valid() }}</p>
          <p><strong>Invalid:</strong> {{ form().invalid() }}</p>
          <p><strong>Dirty:</strong> {{ form().dirty() }}</p>
          <p><strong>Touched:</strong> {{ form().touched() }}</p>
          <p><strong>Value:</strong></p>
          <pre>{{ shippingData() | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Component-specific styles only - shared styles are in global styles */
      .error-container {
        margin: 0.5rem 0 0.75rem 0;
      }

      .error-container .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .error-container .error-message:last-child {
        margin-bottom: 0;
      }

      .error-icon {
        font-size: 1rem;
        flex-shrink: 0;
      }
    `,
  ],
})
export class ValidatorsExampleComponent {
  title = 'Validators Example - Shipping Address Form';

  protected shippingData = signal<ShippingAddress>({
    country: '',
    state: '',
    zipCode: '',
  });

  protected readonly form = form(this.shippingData, (address) => {
    validateShippingAddress(address);
  });

  protected readonly usStates = US_STATES;
  protected readonly canadianProvinces = CANADIAN_PROVINCES;

  resetForm() {
    this.shippingData.set({
      country: '',
      state: '',
      zipCode: '',
    });
  }
}
