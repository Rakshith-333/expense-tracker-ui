import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn =
(control: AbstractControl): ValidationErrors | null => {

  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (!confirmPassword.value) {
    confirmPassword.setErrors(null);
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({
      ...(confirmPassword.errors || {}),
      passwordMismatch: true
    });

    return { passwordMismatch: true };
  }

  // Remove only passwordMismatch error
  if (confirmPassword.hasError('passwordMismatch')) {

    const errors = { ...(confirmPassword.errors || {}) };

    delete errors['passwordMismatch'];

    confirmPassword.setErrors(
      Object.keys(errors).length ? errors : null
    );
  }

  return null;
};