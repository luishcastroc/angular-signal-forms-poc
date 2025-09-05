import { JsonPipe } from '@angular/common';
import {
  Component,
  signal,
} from '@angular/core';
import {
  Control,
  customError,
  form,
  required,
  validate,
} from '@angular/forms/signals';

import { getDefaultErrorMessage } from './validators';

@Component({
  selector: 'app-nested-forms',
  imports: [Control, JsonPipe],
  template: `
    <div class="container">
      <h1>Nested Forms Example</h1>
      <p class="description">
        Restaurant registration form with nested location data and coordinate
        validation.
      </p>

      <form class="form">
        <div class="section">
          <h2>Restaurant Information</h2>

          <div class="form-group">
            <label for="name">Restaurant Name *</label>
            <input
              id="name"
              [control]="restaurantForm.name"
              class="form-control"
              placeholder="Enter restaurant name"
            />
            @for (error of restaurantForm.name().errors(); track error.kind) {
            <div class="error-message">
              {{
                error.message ||
                  getDefaultErrorMessage(error.kind, 'Restaurant Name')
              }}
            </div>
            }
          </div>

          <div class="form-group">
            <label for="cuisine">Cuisine Type *</label>
            <select
              id="cuisine"
              [control]="restaurantForm.cuisine"
              class="form-control"
            >
              <option value="">Select cuisine type</option>
              <option value="italian">Italian</option>
              <option value="mexican">Mexican</option>
              <option value="chinese">Chinese</option>
              <option value="indian">Indian</option>
              <option value="american">American</option>
              <option value="french">French</option>
              <option value="japanese">Japanese</option>
              <option value="mediterranean">Mediterranean</option>
            </select>
            @for (error of restaurantForm.cuisine().errors(); track error.kind)
            {
            <div class="error-message">
              {{
                error.message ||
                  getDefaultErrorMessage(error.kind, 'Cuisine Type')
              }}
            </div>
            }
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              [control]="restaurantForm.phone"
              class="form-control"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div class="section">
          <h2>Location Details</h2>

          <div class="form-group">
            <label for="address">Street Address *</label>
            <input
              id="address"
              [control]="restaurantForm.location.address"
              class="form-control"
              placeholder="123 Main Street"
            />
            @for (error of restaurantForm.location.address().errors(); track
            error.kind) {
            <div class="error-message">
              {{
                error.message || getDefaultErrorMessage(error.kind, 'Address')
              }}
            </div>
            }
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">City *</label>
              <input
                id="city"
                [control]="restaurantForm.location.city"
                class="form-control"
                placeholder="City name"
              />
              @for (error of restaurantForm.location.city().errors(); track
              error.kind) {
              <div class="error-message">
                {{
                  error.message || getDefaultErrorMessage(error.kind, 'City')
                }}
              </div>
              }
            </div>

            <div class="form-group">
              <label for="state">State</label>
              <input
                id="state"
                [control]="restaurantForm.location.state"
                class="form-control"
                placeholder="State"
              />
            </div>

            <div class="form-group">
              <label for="zipCode">ZIP Code</label>
              <input
                id="zipCode"
                [control]="restaurantForm.location.zipCode"
                class="form-control"
                placeholder="12345"
              />
            </div>
          </div>
        </div>

        <div class="section">
          <h2>GPS Coordinates</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="lat">Latitude</label>
              <input
                id="lat"
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                [control]="restaurantForm.location.coordinates.lat"
                class="form-control"
                placeholder="40.7128"
              />
              @for (error of restaurantForm.location.coordinates.lat().errors();
              track error.kind) {
              <div class="error-message">
                {{
                  error.message ||
                    getDefaultErrorMessage(error.kind, 'Latitude')
                }}
              </div>
              }
            </div>

            <div class="form-group">
              <label for="lng">Longitude</label>
              <input
                id="lng"
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                [control]="restaurantForm.location.coordinates.lng"
                class="form-control"
                placeholder="-74.0060"
              />
              @for (error of restaurantForm.location.coordinates.lng().errors();
              track error.kind) {
              <div class="error-message">
                {{
                  error.message ||
                    getDefaultErrorMessage(error.kind, 'Longitude')
                }}
              </div>
              }
            </div>
          </div>

          <div class="coordinate-info">
            <p><strong>Current Coordinates:</strong></p>
            <p>
              {{ restaurantForm.location.coordinates.lat().value() }},
              {{ restaurantForm.location.coordinates.lng().value() }}
            </p>
            @if (restaurantForm.location.coordinates.lat().value() !== 0 ||
            restaurantForm.location.coordinates.lng().value() !== 0) {
            <a
              [href]="
                'https://www.google.com/maps?q=' +
                restaurantForm.location.coordinates.lat().value() +
                ',' +
                restaurantForm.location.coordinates.lng().value()
              "
              target="_blank"
              class="map-link"
            >
              View on Google Maps
            </a>
            }
          </div>
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="restaurantForm().invalid()"
            [class.disabled]="restaurantForm().invalid()"
          >
            Register Restaurant
          </button>

          <button type="button" class="reset-button" (click)="resetForm()">
            Reset
          </button>
        </div>

        <div class="debug-info">
          <h3>Nested Form Structure</h3>
          <div class="debug-content">
            <p><strong>Form Valid:</strong> {{ restaurantForm().valid() }}</p>
            <p>
              <strong>Location Valid:</strong>
              {{ restaurantForm.location().valid() }}
            </p>
            <p>
              <strong>Coordinates Valid:</strong>
              {{ restaurantForm.location.coordinates().valid() }}
            </p>
            <hr />
            <p><strong>Restaurant Data:</strong></p>
            <pre>{{ restaurantData() | json }}</pre>
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
export class NestedFormsComponent {
  // Make the helper function available in the template
  getDefaultErrorMessage = getDefaultErrorMessage;

  // Nested object form
  restaurantData = signal({
    name: '',
    cuisine: '',
    phone: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
  });

  restaurantForm = form(this.restaurantData, (restaurant) => {
    required(restaurant.name);
    required(restaurant.cuisine);
    required(restaurant.location.address);
    required(restaurant.location.city);

    // Validate nested coordinates
    validate(restaurant.location.coordinates.lat, ({ value }) => {
      const lat = value();
      return lat >= -90 && lat <= 90 && lat !== 0
        ? null
        : customError({
            message: 'Invalid latitude (must be between -90 and 90, not 0)',
          });
    });

    validate(restaurant.location.coordinates.lng, ({ value }) => {
      const lng = value();
      return lng >= -180 && lng <= 180 && lng !== 0
        ? null
        : customError({
            message: 'Invalid longitude (must be between -180 and 180, not 0)',
          });
    });
  });

  resetForm() {
    this.restaurantData.set({
      name: '',
      cuisine: '',
      phone: '',
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
    });
  }
}
