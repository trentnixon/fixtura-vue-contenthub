/**
 * Composable for fixture form validation rules
 *
 * Provides validation rules for fixture form fields that can be used with Vuetify's v-form
 */

export type ValidationRule = (value: any) => boolean | string;

/**
 * Required field validation rule
 */
export const requiredRule: ValidationRule = (value: any): boolean | string => {
  if (value === null || value === undefined || value === "") {
    return "This field is required";
  }
  return true;
};

/**
 * Score format validation rule
 * Validates format like "10/291" or "291" (wickets/runs or just runs)
 */
export const scoreFormatRule: ValidationRule = (
  value: string
): boolean | string => {
  if (!value) return true; // Optional field
  const scoreRegex = /^(\d+\/)?\d+$/;
  if (!scoreRegex.test(value)) {
    return "Score format should be like '10/291' or '291'";
  }
  return true;
};

/**
 * Positive number validation rule
 */
export const positiveNumberRule: ValidationRule = (
  value: number | null | undefined
): boolean | string => {
  if (value === null || value === undefined) return true; // Optional field
  if (typeof value !== "number" || value < 0) {
    return "Must be a positive number";
  }
  return true;
};

/**
 * Date format validation rule
 * Handles both date (YYYY-MM-DD) and datetime-local (YYYY-MM-DDTHH:mm) formats
 */
export const dateRule: ValidationRule = (value: string): boolean | string => {
  if (!value) return true; // Optional field
  if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/.test(value)) {
    return "Please enter a valid date";
  }
  return true;
};

/**
 * Composable function that returns all validation rules
 */
export function useFixtureValidation() {
  return {
    requiredRule,
    scoreFormatRule,
    positiveNumberRule,
    dateRule,
  };
}
