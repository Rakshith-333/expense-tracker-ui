import { Component, inject, OnInit } from '@angular/core';
import { materialImports } from '../../material';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { ProfileResponse, ProfileUser } from '../../core/models/profile-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  imports: [materialImports, FormsModule, CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly snackBar = inject(MatSnackBar);

  user: ProfileUser = {
    name: '',
    email: '',
    mobileNumber: '+91 XXXXX XXXXX',
    monthlyBudget: 0,
  };

  monthlyBudget = 0;
  reminderEnabled = true;
  reminderTime = '08:00 PM';
  currency = 'INR';
  dateFormat = 'DD MMM YYYY';
  theme = 'light';
  language = 'English';

  currencies = ['INR', 'USD', 'EUR'];
  dateFormats = ['DD MMM YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY'];
  themes = ['light', 'dark', 'system'];
  languages = ['English', 'Kannada', 'Hindi'];

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (response: ProfileResponse) => {
        this.user = response.user;
        this.monthlyBudget = Number(response.user.monthlyBudget ?? 0);
        this.tokenService.saveUser(response.user);
      },
      error: () => {
        this.snackBar.open('Unable to load profile settings', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  saveBudget(): void {
    this.authService.updateMonthlyBudget({ monthlyBudget: this.monthlyBudget }).subscribe({
      next: () => {
        this.user.monthlyBudget = this.monthlyBudget;
        this.tokenService.saveUser(this.user);
        this.snackBar.open('Monthly budget saved successfully', 'Close', {
          duration: 2500,
        });
      },
      error: () => {
        this.snackBar.open('Unable to save monthly budget', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  changePassword(): void {
    console.log('Change Password');
  }

  logoutAllDevices(): void {
    console.log('Logout All Devices');
  }

  logout(): void {
    console.log('Logout');
  }

  deleteAccount(): void {
    const confirmation = confirm('Are you sure you want to delete your account?');

    if (confirmation) {
      console.log('Delete Account');
    }
  }
}
