import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { materialImports } from '../../material';

@Component({
  selector: 'app-login',
  imports: [...materialImports, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;

  ngOnInit(): void {
    this.initializeFormGroup();
  }

  initializeFormGroup(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    console.log('Login submitted', this.loginForm.value);
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  loginWithGoogle(): void {
    console.log('Google login clicked');
  }
}
