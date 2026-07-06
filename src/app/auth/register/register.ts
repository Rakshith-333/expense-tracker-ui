import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { materialImports } from '../../material';
import { AuthService } from '../../core/services/auth.service';
import { RegisterRequest } from '../../core/models/register-request.model';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { strongPasswordValidator } from '../../shared/validators/password.validator';


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [...materialImports, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);

private authService = inject(AuthService);

private router = inject(Router);

private snackBar = inject(MatSnackBar);
  registerForm!: FormGroup;

loading = false;

hidePassword = true;

hideConfirmPassword = true;

ngOnInit(): void {
  this.initializeForm();
}

initializeForm(): void {

  this.registerForm = this.fb.group(
    {

      name: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          strongPasswordValidator
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]

    },
    {
      validators: passwordMatchValidator
    }
  );
  // this.registerForm.valueChanges.subscribe(() => {
  // this.registerForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
  // });

}

get name() {
  return this.registerForm.get('name');
}

get email() {
  return this.registerForm.get('email');
}

get password() {
  return this.registerForm.get('password');
}

get confirmPassword() {
  return this.registerForm.get('confirmPassword');
}
get passwordsMatch(): boolean {
  const password = this.password?.value;
  const confirmPassword = this.confirmPassword?.value;

  return !!password &&
         !!confirmPassword &&
         password === confirmPassword;
}
get passwordErrors() {
  return this.password?.errors?.['passwordStrength'];
}
get passwordStrengthScore(): number {
  const err = this.password?.errors?.['passwordStrength'];
  if (!err) return 100;

  let score = 0;
  if (err.hasUpper) score += 20;
  if (err.hasLower) score += 20;
  if (err.hasNumber) score += 20;
  if (err.hasSpecial) score += 20;
  if (err.hasMinLength) score += 20;

  return score;
}
get passwordStrengthLabel(): string {
  const score = this.passwordStrengthScore;

  if (!this.password?.value) return '';

  if (score < 40) return 'Weak';
  if (score < 80) return 'Medium';
  return 'Strong';
}
get passwordStrengthColor(): string {
  const score = this.passwordStrengthScore;

  if (!this.password?.value) return '';

  if (score < 40) return '#ef4444'; // red
  if (score < 80) return '#f59e0b'; // orange
  return '#22c55e'; // green
}

togglePassword(): void {
  this.hidePassword = !this.hidePassword;
}

toggleConfirmPassword(): void {
  this.hideConfirmPassword = !this.hideConfirmPassword;
}


onSubmit(): void {

  if (this.registerForm.invalid) {

    this.registerForm.markAllAsTouched();

    return;

  }

  this.loading = true;

  const request: RegisterRequest = this.registerForm.value;

  this.authService.register(request).subscribe({

    next: (response) => {

      this.loading = false;

      this.snackBar.open(
        response.message,
        'Close',
        {
          duration: 3000
        }
      );

      this.router.navigate(['/login']);

    },

    error: (error: HttpErrorResponse) => {

      this.loading = false;

      this.snackBar.open(
        error.error?.message ?? 'Registration failed',
        'Close',
        {
          duration: 3000
        }
      );

    }

  });

}

registerWithGoogle(){
  this.snackBar.open(
    'Google Registration Comming Soon',
    'Close',
    {
      duration: 3000
    }
  )
}

}
