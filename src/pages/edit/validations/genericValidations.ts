// src/validations/genericValidations.ts

// Validate a name field
export function isValidName(name: string): true | string {
  const nameRegex = /^[a-zA-Z0-9\s'()-]+$/;
  return nameRegex.test(name)
    ? true
    : "The name must only contain letters, numbers, spaces, hyphens, apostrophes, and parentheses.";
}

// Validate a number field (integer or decimal)
export function isValidNumber(value: string | number): true | string {
  const numberRegex = /^-?\d+(\.\d+)?$/;
  return numberRegex.test(String(value))
    ? true
    : "The value must be a valid number.";
}

// Validate a positive integer
export function isPositiveInteger(value: string | number): true | string {
  const positiveIntegerRegex = /^\d+$/;
  return positiveIntegerRegex.test(String(value))
    ? true
    : "The value must be a positive integer.";
}

// Validate a field with a maximum length
export function maxLength(value: string, max: number): true | string {
  return value.length <= max
    ? true
    : `The value must not exceed ${max} characters.`;
}

// Validate a field with a minimum length
export function minLength(value: string, min: number): true | string {
  return value.length >= min
    ? true
    : `The value must be at least ${min} characters.`;
}

// Validate a range of numeric values
export function isInRange(
  value: string | number,
  min: number,
  max: number
): true | string {
  const num = Number(value);
  return num >= min && num <= max
    ? true
    : `The value must be between ${min} and ${max}.`;
}

// Validate a required field
export function isRequired(value: string | number): true | string {
  return value ? true : "This field is required.";
}

export function isTime(value: string): true | string {
  const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  return timeRegex.test(value)
    ? true
    : "The time must be in the format hh:mm AM/PM.";
}

export function isDate(value: string): true | string {
  const dateRegex =
    /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s(0[1-9]|[12][0-9]|3[01])\s(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$/;
  return dateRegex.test(value)
    ? true
    : "The date must be in the format Day, DD Month YYYY (e.g., Friday, 01 November 2024).";
}
