import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { materialImports } from '../../material';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { ProfileResponse, ProfileUser } from '../../core/models/profile-response.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslationService } from '../../core/services/translation.service';

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
  private readonly translationService = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);

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
  theme = this.tokenService.getTheme();
  language = this.tokenService.getLanguage();

  get t() {
    return this.translationService;
  }

  currencies = ['INR', 'USD', 'EUR'];
  dateFormats = ['DD MMM YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY'];
  themes = ['light', 'dark', 'system'];
  languages = ['English', 'Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'];

  ngOnInit(): void {
    this.translationService.language$.subscribe(() => {
      this.cdr.detectChanges();
    });

    this.loadProfile();
    this.applyTheme(this.theme);
    this.applyLanguage(this.language);
    this.language = this.translationService.getCurrentLanguage();
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

  saveProfile(): void {
    const payload: Partial<ProfileUser> = {
      name: this.user.name,
      mobileNumber: this.user.mobileNumber,
    };

    this.authService.updateProfile(payload).subscribe({
      next: (response) => {
        this.user = response.user;
        this.tokenService.saveUser(response.user);
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 2500,
        });
      },
      error: () => {
        this.snackBar.open('Unable to update profile', 'Close', {
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

  savePreferences(): void {
    this.tokenService.saveTheme(this.theme);
    this.tokenService.saveLanguage(this.language);
    this.translationService.setLanguage(this.language);
    this.applyTheme(this.theme);
    this.applyLanguage(this.language);
    this.snackBar.open('Preferences saved successfully', 'Close', {
      duration: 2500,
    });
  }

  private applyTheme(theme: string): void {
    const root = document.body;
    root.classList.remove('theme-light', 'theme-dark', 'theme-system');
    root.classList.add(`theme-${theme}`);
  }

  private applyLanguage(language: string): void {
    const labels: Record<string, string> = {
      English: 'English',
      Kannada: 'ಕನ್ನಡ',
      Hindi: 'हिन्दी',
      Telugu: 'తెలుగు',
      Tamil: 'தமிழ்',
      Malayalam: 'മലയാളം',
    };

    document.documentElement.lang = language.toLowerCase();
    document.documentElement.setAttribute('data-language', labels[language] ?? language);
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
