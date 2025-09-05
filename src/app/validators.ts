import {
  customError,
  FieldPath,
  validate,
} from '@angular/forms/signals';

/**
 * Helper function to provide fallback error messages for built-in validators
 * that don't include custom messages
 */
export function getDefaultErrorMessage(
  kind: string,
  fieldName: string
): string {
  switch (kind) {
    case 'required':
      return `${fieldName} is required`;
    case 'email':
      return 'Please enter a valid email address';
    case 'minLength':
      return `${fieldName} is too short`;
    case 'maxLength':
      return `${fieldName} is too long`;
    case 'min':
      return 'Value is too small';
    case 'max':
      return 'Value is too large';
    default:
      return `${fieldName} is invalid`;
  }
}

export interface ShippingAddress {
  zipCode: string;
  state: string;
  country: string;
}

/**
 * Custom validator function for shipping addresses
 * Validates shipping restrictions and postal code formats
 */
export function validateShippingAddress(path: FieldPath<ShippingAddress>) {
  validate(path, (ctx) => {
    const address = ctx.value();

    // Check if we ship to this location
    const restrictedStates = ['AK', 'HI']; // Alaska, Hawaii
    if (address.country === 'US' && restrictedStates.includes(address.state)) {
      return customError({
        kind: 'shippingRestricted',
        message: "Sorry, we don't ship to this state yet",
      });
    }

    // Validate ZIP code format for US addresses
    if (
      address.country === 'US' &&
      address.zipCode &&
      !/^\d{5}(-\d{4})?$/.test(address.zipCode)
    ) {
      return customError({
        kind: 'invalidZip',
        message: 'Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)',
      });
    }

    // Validate postal code format for Canadian addresses
    if (
      address.country === 'CA' &&
      address.zipCode &&
      !/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(address.zipCode)
    ) {
      return customError({
        kind: 'invalidPostalCode',
        message: 'Please enter a valid Canadian postal code (e.g., A1A 1A1)',
      });
    }

    return null; // Valid
  });
}

/**
 * US States data for dropdowns
 */
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

/**
 * Canadian Provinces data for dropdowns
 */
export const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' },
];
