import { JsonPipe } from '@angular/common';
import {
  Component,
  signal,
} from '@angular/core';
import {
  Control,
  form,
} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-form',
  imports: [Control, JsonPipe],
  template: `
    <div class="container">
      <h1>Basic Form Example</h1>
      <p class="description">
        A simple book review form demonstrating the basics of Signal Forms.
      </p>

      <form class="form">
        <div class="form-group">
          <label for="title">Book Title</label>
          <input
            id="title"
            [control]="titleField"
            class="form-control"
            placeholder="Enter book title"
          />
        </div>

        <div class="form-group">
          <label for="author">Author</label>
          <input
            id="author"
            [control]="authorField"
            class="form-control"
            placeholder="Enter author name"
          />
        </div>

        <div class="form-group">
          <label for="rating">Rating (1-5)</label>
          <input
            id="rating"
            type="number"
            min="1"
            max="5"
            [control]="ratingField"
            class="form-control"
            placeholder="Rate the book"
          />
        </div>

        <div class="form-group">
          <label for="review">Review</label>
          <textarea
            id="review"
            [control]="reviewField"
            class="form-control textarea"
            placeholder="Write your review..."
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="!reviewForm().valid()"
            [class.disabled]="!reviewForm().valid()"
          >
            Submit Review
          </button>

          <button type="button" class="reset-button" (click)="resetForm()">
            Reset
          </button>
        </div>

        <div class="debug-info">
          <h3>Form State (Debug Info)</h3>
          <div class="debug-content">
            <p><strong>Valid:</strong> {{ reviewForm().valid() }}</p>
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
    `,
  ],
})
export class BasicFormComponent {
  // Create the data model
  reviewData = signal({
    title: '',
    author: '',
    rating: 0,
    review: '',
  });

  // Create the form
  reviewForm = form(this.reviewData);

  // Access individual fields
  titleField = this.reviewForm.title;
  authorField = this.reviewForm.author;
  ratingField = this.reviewForm.rating;
  reviewField = this.reviewForm.review;

  // Computed for template
  formValue = this.reviewForm().value;

  resetForm() {
    this.reviewData.set({
      title: '',
      author: '',
      rating: 0,
      review: '',
    });
  }
}
