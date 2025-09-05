import { JsonPipe } from '@angular/common';
import {
  Component,
  signal,
} from '@angular/core';
import {
  Control,
  email,
  form,
  max,
  minLength,
  required,
} from '@angular/forms/signals';

import { getDefaultErrorMessage } from './validators';

@Component({
  selector: 'app-schema-validation',
  imports: [Control, JsonPipe],
  template: `
    <div class="container">
      <h1>Schema Validation Example</h1>
      <p class="description">
        Event registration form with comprehensive validation rules using
        built-in validators.
      </p>

      <form class="form">
        <div class="form-group">
          <label for="eventName">Event Name *</label>
          <input
            id="eventName"
            [control]="eventForm.eventName"
            class="form-control"
            placeholder="Enter event name (min 5 chars)"
          />
          @for (error of eventForm.eventName().errors(); track error.kind) {
          <div class="error-message">
            {{
              error.message || getDefaultErrorMessage(error.kind, 'Event Name')
            }}
          </div>
          }
        </div>

        <div class="form-group">
          <label for="organizerEmail">Organizer Email *</label>
          <input
            id="organizerEmail"
            type="email"
            [control]="eventForm.organizerEmail"
            class="form-control"
            placeholder="organizer@example.com"
          />
          @for (error of eventForm.organizerEmail().errors(); track error.kind)
          {
          <div class="error-message">
            {{ error.message || getDefaultErrorMessage(error.kind, 'Email') }}
          </div>
          }
        </div>

        <div class="form-group">
          <label for="description">Event Description *</label>
          <textarea
            id="description"
            [control]="eventForm.description"
            class="form-control textarea"
            placeholder="Describe your event (min 20 chars)"
            rows="4"
          ></textarea>
          @for (error of eventForm.description().errors(); track error.kind) {
          <div class="error-message">
            {{
              error.message || getDefaultErrorMessage(error.kind, 'Description')
            }}
          </div>
          }
        </div>

        <div class="form-group">
          <label for="maxAttendees">Maximum Attendees</label>
          <input
            id="maxAttendees"
            type="number"
            min="1"
            max="1000"
            [control]="eventForm.maxAttendees"
            class="form-control"
            placeholder="Maximum number of attendees"
          />
          @for (error of eventForm.maxAttendees().errors(); track error.kind) {
          <div class="error-message">
            {{
              error.message ||
                getDefaultErrorMessage(error.kind, 'Maximum Attendees')
            }}
          </div>
          }
        </div>

        <div class="form-group">
          <label for="eventDate">Event Date</label>
          <input
            id="eventDate"
            type="date"
            [control]="eventForm.eventDate"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="category">Event Category</label>
          <select
            id="category"
            [control]="eventForm.category"
            class="form-control"
          >
            <option value="">Select category</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="meetup">Meetup</option>
            <option value="webinar">Webinar</option>
            <option value="networking">Networking</option>
          </select>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="eventForm().invalid()"
            [class.disabled]="eventForm().invalid()"
          >
            Register Event
          </button>

          <button type="button" class="reset-button" (click)="resetForm()">
            Reset
          </button>
        </div>

        @if (eventForm().errors().length > 0) {
        <div class="form-errors">
          <h3>Form Errors:</h3>
          @for (error of eventForm().errors(); track error.kind) {
          <div class="error-message">{{ error.message }}</div>
          }
        </div>
        }

        <div class="debug-info">
          <h3>Form State</h3>
          <div class="debug-content">
            <p><strong>Valid:</strong> {{ eventForm().valid() }}</p>
            <p><strong>Invalid:</strong> {{ eventForm().invalid() }}</p>
            <p><strong>Dirty:</strong> {{ eventForm().dirty() }}</p>
            <p><strong>Touched:</strong> {{ eventForm().touched() }}</p>
            <p><strong>Value:</strong></p>
            <pre>{{ eventData() | json }}</pre>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      /* Component-specific styles only - shared styles are in global styles */
      /* Add any component-specific styles here */
    `,
  ],

})
export class SchemaValidationComponent {
  // Make the helper function available in the template
  getDefaultErrorMessage = getDefaultErrorMessage;

  eventData = signal({
    eventName: '',
    organizerEmail: '',
    description: '',
    maxAttendees: 0,
    eventDate: '',
    category: '',
  });

  eventForm = form(this.eventData, (event) => {
    required(event.eventName);
    minLength(event.eventName, 5, {
      message: 'Event name must be at least 5 characters',
    });

    required(event.organizerEmail);
    email(event.organizerEmail);

    required(event.description);
    minLength(event.description, 20, {
      message: 'Description must be at least 20 characters',
    });

    max(event.maxAttendees, 1000, {
      message: 'Maximum 1000 attendees allowed',
    });
  });

  resetForm() {
    this.eventData.set({
      eventName: '',
      organizerEmail: '',
      description: '',
      maxAttendees: 0,
      eventDate: '',
      category: '',
    });
  }
}
