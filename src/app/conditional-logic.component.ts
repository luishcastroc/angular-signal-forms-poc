import { JsonPipe } from '@angular/common';
import {
  Component,
  signal,
} from '@angular/core';
import {
  Control,
  email,
  form,
  required,
} from '@angular/forms/signals';

import { getDefaultErrorMessage } from './validators';

@Component({
  selector: 'app-conditional-logic',
  imports: [Control, JsonPipe],
  template: `
    <div class="container">
      <h1>Conditional Logic Example</h1>
      <p class="description">
        Job application form demonstrating conditional validation, hidden
        fields, and disabled states.
      </p>

      <form class="form">
        <div class="form-group">
          <label for="fullName">Full Name *</label>
          <input
            id="fullName"
            [control]="applicationForm.fullName"
            class="form-control"
            placeholder="Enter your full name"
          />
          @for (error of applicationForm.fullName().errors(); track error.kind)
          {
          <div class="error-message">
            {{
              error.message || getDefaultErrorMessage(error.kind, 'Full Name')
            }}
          </div>
          }
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            type="email"
            [control]="applicationForm.email"
            class="form-control"
            placeholder="your.email@example.com"
          />
          @for (error of applicationForm.email().errors(); track error.kind) {
          <div class="error-message">
            {{ error.message || getDefaultErrorMessage(error.kind, 'Email') }}
          </div>
          }
        </div>

        <div class="form-group">
          <label for="position">Position *</label>
          <select
            id="position"
            [control]="applicationForm.position"
            class="form-control"
          >
            <option value="">Select position</option>
            <option value="developer">Software Developer</option>
            <option value="designer">UI/UX Designer</option>
            <option value="manager">Project Manager</option>
            <option value="intern">Intern</option>
          </select>
          @for (error of applicationForm.position().errors(); track error.kind)
          {
          <div class="error-message">
            {{
              error.message || getDefaultErrorMessage(error.kind, 'Position')
            }}
          </div>
          }
        </div>

        <!-- Portfolio URL - Only required for designers -->
        @if (applicationForm.position().value() === 'designer') {
        <div class="form-group conditional-field">
          <label for="portfolioUrl"
            >Portfolio URL * (Required for Designer position)</label
          >
          <input
            id="portfolioUrl"
            type="url"
            [control]="applicationForm.portfolioUrl"
            class="form-control"
            placeholder="https://your-portfolio.com"
          />
          @for (error of applicationForm.portfolioUrl().errors(); track
          error.kind) {
          <div class="error-message">
            {{
              error.message ||
                getDefaultErrorMessage(error.kind, 'Portfolio URL')
            }}
          </div>
          }
        </div>
        }

        <!-- Salary Expectations - Hidden for internship positions -->
        @if (applicationForm.position().value() !== 'intern') {
        <div class="form-group">
          <label for="salaryExpectations">Salary Expectations</label>
          <input
            id="salaryExpectations"
            type="number"
            [control]="applicationForm.salaryExpectations"
            class="form-control"
            placeholder="Expected annual salary"
          />
        </div>
        }

        <div class="form-group">
          <label>
            <input
              type="checkbox"
              [control]="applicationForm.isInternalTransfer"
              class="checkbox"
            />
            Internal Transfer (from another department)
          </label>
        </div>

        <!-- References - Readonly for internal transfers -->
        <div class="form-group">
          <label for="references">References</label>
          <textarea
            id="references"
            [control]="applicationForm.references"
            class="form-control textarea"
            [class.readonly]="applicationForm.isInternalTransfer().value()"
            placeholder="List your references..."
            rows="3"
          ></textarea>
          @if (applicationForm.isInternalTransfer().value()) {
          <div class="info-message">
            References are not required for internal transfers.
          </div>
          }
        </div>

        <div class="form-group">
          <label for="coverLetter">Cover Letter</label>
          <textarea
            id="coverLetter"
            [control]="applicationForm.coverLetter"
            class="form-control textarea"
            placeholder="Tell us why you're interested in this position..."
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="applicationForm().invalid()"
            [class.disabled]="applicationForm().invalid()"
          >
            Submit Application
          </button>

          <button type="button" class="reset-button" (click)="resetForm()">
            Reset
          </button>
        </div>

        <div class="debug-info">
          <h3>Form State & Conditional Logic</h3>
          <div class="debug-content">
            <p>
              <strong>Position:</strong>
              {{ applicationForm.position().value() || 'None selected' }}
            </p>
            <p>
              <strong>Portfolio Required:</strong>
              {{
                applicationForm.position().value() === 'designer' ? 'Yes' : 'No'
              }}
            </p>
            <p>
              <strong>Salary Field Visible:</strong>
              {{
                applicationForm.position().value() !== 'intern' ? 'Yes' : 'No'
              }}
            </p>
            <p>
              <strong>Internal Transfer:</strong>
              {{ applicationForm.isInternalTransfer().value() ? 'Yes' : 'No' }}
            </p>
            <p><strong>Form Valid:</strong> {{ applicationForm().valid() }}</p>
            <hr />
            <p><strong>Current Data:</strong></p>
            <pre>{{ applicationData() | json }}</pre>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      /* Component-specific styles only - shared styles are in global styles */
      .conditional-field {
        background: linear-gradient(135deg, #e8f5e8, #f0f8ff);
        border: 1px solid #b8e6b8;
        border-radius: 8px;
        padding: 1rem;
        transition: all 0.3s ease;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .checkbox {
        margin-right: 0.5rem;
        transform: scale(1.2);
      }

      .textarea {
        resize: vertical;
        min-height: 80px;
      }

      .info-message {
        color: #17a2b8;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        padding: 0.5rem;
        background: #e7f4f7;
        border-left: 3px solid #17a2b8;
        border-radius: 4px;
      }
    `,
  ],
})
export class ConditionalLogicComponent {
  // Make the helper function available in the template
  getDefaultErrorMessage = getDefaultErrorMessage;

  applicationData = signal({
    fullName: '',
    email: '',
    position: '',
    portfolioUrl: '',
    salaryExpectations: 0,
    isInternalTransfer: false,
    references: '',
    coverLetter: '',
  });

  applicationForm = form(this.applicationData, (application) => {
    required(application.fullName);
    required(application.email);
    email(application.email);
    required(application.position);

    // Conditionally require portfolio based on role type
    required(application.portfolioUrl, {
      when: ({ fieldOf }) =>
        fieldOf(application.position)().value() === 'designer',
    });

    // Hide salary expectations for internship positions (handled in template)

    // Make references readonly for internal transfers (handled in template)
  });

  resetForm() {
    this.applicationData.set({
      fullName: '',
      email: '',
      position: '',
      portfolioUrl: '',
      salaryExpectations: 0,
      isInternalTransfer: false,
      references: '',
      coverLetter: '',
    });
  }
}
