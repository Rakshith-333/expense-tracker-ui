import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { materialImports } from '../../material';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-login',
  imports: [...materialImports, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private tokenService = inject(TokenService)
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

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.tokenService.saveToken(response.data.token)
        this.tokenService.saveUser(response.data.user)
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      },
      error: () => {
        this.loading = false;
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  loginWithGoogle(): void {
    console.log('Google login clicked');
  }
}
