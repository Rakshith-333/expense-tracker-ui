import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { materialImports } from '../../material';
import { AuthService } from '../../core/services/auth.service';
import { AddExpenseRequest } from '../../core/models/add-expense-request';
import { AddExpenseResponse } from '../../core/models/add-expense-response';
import { AddExpenseSuccessDialog } from '../../shared/components/add-expense-success-dialog/add-expense-success-dialog';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    materialImports,
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.scss',
})
export class AddExpense implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  ngOnInit(): void {}

  expense = {
    amount: null as number | null,
    category: '',
    description: '',
    date: new Date() as Date,
    hour: '',
    minute: '',
    meridian: '',
    paymentMode: '',
    notes: ''
  };

  hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  );

  meridians = ['AM', 'PM'];

  categories = [
    'Food & Dining',
    'Beauty',
    'Transportation',
    'Housing',
    'Shopping',
    'Education',
    'Entertainment',
    'Travel',
    'Family',
    'Financial',
    'Work',
    'Personal',
    'Charity',
    'Health'
  ];

  paymentModes = [
    'UPI',
    'Cash',
    'Credit Card',
    'Debit Card',
    'Net Banking',
    'Mobile Wallet',
    'Bank Transfer (NEFT/RTGS/IMPS)',
    'Cheque'
  ];

  saveExpense(): void {

    if (this.expense.amount === null || this.expense.amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (!this.expense.category) {
      alert('Please select a category.');
      return;
    }

    if (!this.expense.date) {
      alert('Please select a date.');
      return;
    }

    if (
      !this.expense.hour ||
      !this.expense.minute ||
      !this.expense.meridian
    ) {
      alert('Please select the expense time.');
      return;
    }

    const expenseDate = new Date(this.expense.date);

    let hour = Number(this.expense.hour);

    if (this.expense.meridian === 'PM' && hour < 12) {
      hour += 12;
    }

    if (this.expense.meridian === 'AM' && hour === 12) {
      hour = 0;
    }

    expenseDate.setHours(
      hour,
      Number(this.expense.minute),
      0,
      0
    );

    const payload: AddExpenseRequest = {
      amount: Number(this.expense.amount),
      category: this.expense.category,
      expenseDate: expenseDate.toISOString(),
      paymentMode: this.expense.paymentMode,
      description: this.expense.description
    };

    this.authService.addExpense(payload).subscribe({

      next: (response: AddExpenseResponse) => {

        console.log('Expense added successfully');
        console.log(response);

        this.cdr.detectChanges();

        const dialogRef = this.dialog.open(AddExpenseSuccessDialog, {
          width: '420px',
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {

          if (result) {

            this.cancel();

          } else {

            this.router.navigate(['/expenses']);

          }

        });

      },

      error: (error) => {

        console.error('Failed to add expense', error);

        this.cdr.detectChanges();

        alert('Unable to add expense. Please try again.');

      }

    });

  }
cancel(): void {

  this.expense.amount = null;
  this.expense.category = '';
  this.expense.description = '';
  this.expense.date = new Date();
  this.expense.hour = '';
  this.expense.minute = '';
  this.expense.meridian = '';
  this.expense.paymentMode = '';
  this.expense.notes = '';

  this.cdr.detectChanges();

}

}