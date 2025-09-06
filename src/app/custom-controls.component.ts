import { JsonPipe } from '@angular/common';
import {
  Component,
  input,
  model,
  signal,
} from '@angular/core';
import {
  Control,
  form,
  FormValueControl,
} from '@angular/forms/signals';

// Custom Slider Component
@Component({
  selector: 'custom-slider',
  template: `
    <div class="slider-container">
      <input
        type="range"
        [value]="value()"
        (input)="onValueChange($event)"
        [disabled]="disabled()"
        [min]="min()"
        [max]="max()"
        class="slider-input"
      />
      <span class="slider-value">{{ value() }}</span>
    </div>
  `,
  styles: [
    `
      .slider-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
      }

      .slider-input {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: #e1e8ed;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
      }

      .slider-input::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3498db;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .slider-input::-webkit-slider-thumb:hover {
        background: #2980b9;
        transform: scale(1.1);
      }

      .slider-input::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3498db;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }

      .slider-input::-moz-range-thumb:hover {
        background: #2980b9;
        transform: scale(1.1);
      }

      .slider-input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .slider-input:disabled::-webkit-slider-thumb {
        background: #bdc3c7;
        cursor: not-allowed;
        transform: none;
      }

      .slider-input:disabled::-moz-range-thumb {
        background: #bdc3c7;
        cursor: not-allowed;
        transform: none;
      }

      .slider-value {
        font-weight: 600;
        color: #2c3e50;
        min-width: 3rem;
        text-align: center;
        padding: 0.5rem;
        background: #f8f9fa;
        border-radius: 4px;
        border: 1px solid #e1e8ed;
      }
    `,
  ],
})
export class CustomSliderComponent implements FormValueControl<number> {
  readonly value = model<number>(0);
  disabled = input<boolean>(false);
  min = input<number | undefined>(0);
  max = input<number | undefined>(100);

  onValueChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = Number(target.value);
    this.value.set(newValue);
  }
}

// Custom Rating Component
@Component({
  selector: 'custom-rating',
  template: `
    <div class="rating-container">
      @for (star of stars; track $index) {
      <button
        type="button"
        class="star"
        [class.filled]="$index < value()"
        [class.hovered]="$index < hoveredRating"
        [disabled]="disabled()"
        (click)="onStarClick($index + 1)"
        (mouseenter)="onStarHover($index + 1)"
        (mouseleave)="onStarLeave()"
        [attr.aria-label]="'Rate ' + ($index + 1) + ' stars'"
      >
        ★
      </button>
      } @if (showValue()) {
      <span class="rating-value">{{ value() }}/{{ maxRating() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .rating-container {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .star {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #e1e8ed;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0.25rem;
        border-radius: 4px;
      }

      .star:hover:not(:disabled) {
        transform: scale(1.1);
      }

      .star.filled {
        color: #f39c12;
      }

      .star.hovered {
        color: #f1c40f;
      }

      .star:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .rating-value {
        margin-left: 0.5rem;
        font-weight: 600;
        color: #2c3e50;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class CustomRatingComponent implements FormValueControl<number> {
  readonly value = model<number>(0);
  disabled = input<boolean>(false);
  maxRating = input<number>(5);
  showValue = input<boolean>(true);

  hoveredRating = 0;

  get stars() {
    return Array(this.maxRating()).fill(0);
  }

  onStarClick(rating: number) {
    if (!this.disabled()) {
      this.value.set(rating);
    }
  }

  onStarHover(rating: number) {
    if (!this.disabled()) {
      this.hoveredRating = rating;
    }
  }

  onStarLeave() {
    this.hoveredRating = 0;
  }
}

@Component({
  selector: 'app-custom-controls',
  imports: [Control, JsonPipe, CustomSliderComponent, CustomRatingComponent],
  template: `
    <div class="container">
      <h1>Custom Form Controls</h1>
      <p class="description">
        This example demonstrates how to create custom form controls that
        integrate seamlessly with Angular Signal Forms using the
        FormValueControl interface. These components use model signals and work
        directly with the Control directive.
      </p>

      <div class="info-box">
        <h3>Key Concepts:</h3>
        <ul>
          <li>
            <strong>FormValueControl Interface:</strong> Custom components
            implement this interface to work directly with the Control directive
          </li>
          <li>
            <strong>model.required():</strong> Creates a required model signal
            that the Control directive can bind to automatically
          </li>
          <li>
            <strong>Seamless Integration:</strong> Custom controls work exactly
            like native form controls with validation and form state management
          </li>
          <li>
            <strong>Rich Interactions:</strong> Components can provide enhanced
            UX while maintaining form integration
          </li>
        </ul>
      </div>

      <form class="form">
        <div class="section">
          <h2>Product Review Form</h2>

          <div class="form-group">
            <label for="productName">Product Name</label>
            <input
              id="productName"
              [control]="reviewForm.productName"
              class="form-control"
              placeholder="Enter product name"
            />
          </div>

          <div class="form-group">
            <label>Overall Rating</label>
            <custom-rating [control]="reviewForm.overallRating" />
          </div>

          <div class="form-group">
            <label>Value for Money (1-10)</label>
            <custom-slider
              [control]="reviewForm.valueRating"
              [min]="1"
              [max]="10"
            />
          </div>

          <div class="form-group">
            <label>Quality Rating</label>
            <custom-rating
              [control]="reviewForm.qualityRating"
              [maxRating]="10"
              [showValue]="true"
            />
          </div>

          <div class="form-group">
            <label>Price Range ($)</label>
            <custom-slider
              [control]="reviewForm.priceRange"
              [min]="0"
              [max]="1000"
            />
          </div>

          <div class="form-group">
            <label for="comments">Additional Comments</label>
            <textarea
              id="comments"
              [control]="reviewForm.comments"
              class="form-control textarea"
              placeholder="Share your thoughts about this product..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="reviewForm().invalid()"
            [class.disabled]="reviewForm().invalid()"
          >
            Submit Review
          </button>

          <button type="button" class="reset-button" (click)="resetForm()">
            Reset Form
          </button>

          <button
            type="button"
            class="secondary-button"
            (click)="toggleDisabled()"
          >
            {{ allDisabled() ? 'Enable' : 'Disable' }} All Controls
          </button>
        </div>

        <div class="debug-info">
          <h3>Form State</h3>
          <div class="debug-content">
            <p><strong>Valid:</strong> {{ reviewForm().valid() }}</p>
            <p><strong>Invalid:</strong> {{ reviewForm().invalid() }}</p>
            <p><strong>Dirty:</strong> {{ reviewForm().dirty() }}</p>
            <p><strong>Touched:</strong> {{ reviewForm().touched() }}</p>
            <p><strong>Value:</strong></p>
            <pre>{{ formValue() | json }}</pre>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      /* Component-specific styles only - shared styles are in global styles */
      .textarea {
        resize: vertical;
        min-height: 100px;
      }

      .secondary-button {
        background: #95a5a6;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-block;
      }

      .secondary-button:hover:not(:disabled) {
        background: #7f8c8d;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(149, 165, 166, 0.3);
      }

      .secondary-button:active {
        transform: translateY(0);
      }

      .secondary-button:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      /* Custom control styling within form groups */
      .form-group custom-slider,
      .form-group custom-rating {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class CustomControlsComponent {
  // Form data model
  reviewData = signal({
    productName: '',
    overallRating: 0,
    valueRating: 5,
    qualityRating: 0,
    priceRange: 100,
    comments: '',
  });

  // Track if controls are disabled
  allDisabled = signal(false);

  // Create the form
  reviewForm = form(this.reviewData);

  // Computed for template
  formValue = this.reviewForm().value;

  resetForm() {
    this.reviewData.set({
      productName: '',
      overallRating: 0,
      valueRating: 5,
      qualityRating: 0,
      priceRange: 100,
      comments: '',
    });
  }

  toggleDisabled() {
    const newDisabledState = !this.allDisabled();
    this.allDisabled.set(newDisabledState);

    // Note: Signal forms don't have enable/disable methods like reactive forms
    // This is a placeholder for demonstration. In a real implementation,
    // you would pass the disabled state to each custom control component.
  }
}
