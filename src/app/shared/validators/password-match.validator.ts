import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn =
(control: AbstractControl): ValidationErrors | null => {

  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  const passwordValue = password.value;
  const confirmPasswordValue = confirmPassword.value;

  if (!confirmPasswordValue) return null;

  return passwordValue === confirmPasswordValue
    ? null
    : { passwordMismatch: true };
};
