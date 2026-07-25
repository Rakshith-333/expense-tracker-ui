import { Component } from '@angular/core';
import { materialImports } from '../../material';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [materialImports,FormsModule,CommonModule ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  //=========================
  // User Details
  //=========================

  user = {
    name: 'Manohara H C',
    email: 'manohara@example.com',
    mobileNumber: '+91 9876543210'
  };

  //=========================
  // Reminder
  //=========================

  reminderEnabled = true;

  reminderTime = '08:00 PM';

  //=========================
  // Preferences
  //=========================

  currency = 'INR';

  dateFormat = 'DD MMM YYYY';

  theme = 'light';

  language = 'English';

  //=========================
  // Dropdown Data
  //=========================

  currencies = [
    'INR',
    'USD',
    'EUR'
  ];

  dateFormats = [
    'DD MMM YYYY',
    'DD/MM/YYYY',
    'MM/DD/YYYY'
  ];

  themes = [
    'light',
    'dark',
    'system'
  ];

  languages = [
    'English',
    'Kannada',
    'Hindi'
  ];

  //=========================
  // Button Actions
  //=========================

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

    const confirmation = confirm(
      'Are you sure you want to delete your account?'
    );

    if (confirmation) {
      console.log('Delete Account');
    }

  }

}
