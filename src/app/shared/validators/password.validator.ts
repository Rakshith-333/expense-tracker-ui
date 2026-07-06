import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const strongPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const value = control.value || '';

  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecial = /[@$!%*?&]/.test(value);
  const hasMinLength = value.length >= 8;

  const valid =
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    hasMinLength;

  return valid
    ? null
    : {
        weakPassword: true,
        passwordStrength: {
          hasUpper,
          hasLower,
          hasNumber,
          hasSpecial,
          hasMinLength
        }
      };
};