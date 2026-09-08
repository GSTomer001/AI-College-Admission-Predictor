/**
 * Form validation helpers for the admission form and auth forms.
 * Each validator returns an error string, or null when valid.
 */

export const isRequired = (value, label = "This field") =>
  value === undefined || value === null || value === "" ? `${label} is required` : null;

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "") ? null : "Please enter a valid email";

export const minLength = (value, len, label = "This field") =>
  (value || "").length < len ? `${label} must be at least ${len} characters` : null;

export const isNumberInRange = (value, min, max, label) => {
  const num = Number(value);
  if (value === "" || Number.isNaN(num)) return `${label} must be a number`;
  if (num < min || num > max) return `${label} must be between ${min} and ${max}`;
  return null;
};

/** Field ranges used by AdmissionForm. */
export const ADMISSION_RANGES = {
  gre: { min: 260, max: 340 },
  toefl: { min: 60, max: 120 },
  rating: { min: 1, max: 5 },
  sop: { min: 1, max: 5 },
  lor: { min: 1, max: 5 },
  cgpa: { min: 0, max: 10 },
};

/** Validate the whole admission profile. Returns { field: message } map. */
export function validateAdmissionProfile(profile) {
  const errors = {};
  for (const [field, { min, max }] of Object.entries(ADMISSION_RANGES)) {
    const err = isNumberInRange(profile[field], min, max, field.toUpperCase());
    if (err) errors[field] = err;
  }
  if (![0, 1].includes(Number(profile.research))) {
    errors.research = "Research must be yes (1) or no (0)";
  }
  return errors;
}
