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
          Validators.minLength(8)
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
