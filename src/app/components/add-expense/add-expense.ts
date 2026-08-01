import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { materialImports } from '../../material';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
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
  private readonly translationService = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  isEditMode = false;
  editingExpenseId: string | null = null;

  get t() {
    return this.translationService;
  }

  ngOnInit(): void {
    this.refreshLocalizedOptions();
    this.translationService.language$.subscribe(() => {
      this.refreshLocalizedOptions();
      this.cdr.detectChanges();
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.editingExpenseId = id;
        this.loadExpenseForEdit(id);
      }
    });
  }

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

  categories: string[] = [];
  paymentModes: string[] = [];

  private refreshLocalizedOptions(): void {
    this.categories = [
      this.t.translate('foodDining'),
      this.t.translate('beauty'),
      this.t.translate('transportation'),
      this.t.translate('housing'),
      this.t.translate('shopping'),
      this.t.translate('education'),
      this.t.translate('entertainment'),
      this.t.translate('travel'),
      this.t.translate('family'),
      this.t.translate('financial'),
      this.t.translate('work'),
      this.t.translate('personal'),
      this.t.translate('charity'),
      this.t.translate('health'),
    ];

    this.paymentModes = [
      'UPI',
      this.t.translate('cash'),
      this.t.translate('creditCard'),
      this.t.translate('debitCard'),
      this.t.translate('netBanking'),
      this.t.translate('mobileWallet'),
      this.t.translate('bankTransfer'),
      this.t.translate('cheque'),
    ];
  }

  private loadExpenseForEdit(expenseId: string): void {
    this.authService.getExpenseById(expenseId).subscribe({
      next: (response) => {
        const expenseData = response.data;
        const expenseDate = new Date(expenseData.expenseDate);
        const selectedHour = String(expenseDate.getHours() % 12 || 12).padStart(2, '0');
        const selectedMinute = String(expenseDate.getMinutes()).padStart(2, '0');
        const meridian = expenseDate.getHours() >= 12 ? 'PM' : 'AM';

        this.expense = {
          amount: expenseData.amount,
          category: expenseData.category,
          description: expenseData.description ?? '',
          date: expenseDate,
          hour: selectedHour,
          minute: selectedMinute,
          meridian,
          paymentMode: expenseData.paymentMode,
          notes: expenseData.notes ?? '',
        };
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Unable to load expense for editing.');
      },
    });
  }

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

    if (!this.expense.hour || !this.expense.minute || !this.expense.meridian) {
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

    expenseDate.setHours(hour, Number(this.expense.minute), 0, 0);

    const payload: AddExpenseRequest = {
      amount: Number(this.expense.amount),
      category: this.expense.category,
      expenseDate: expenseDate.toISOString(),
      paymentMode: this.expense.paymentMode,
      description: this.expense.description,
    };

    const request$ = this.isEditMode && this.editingExpenseId
      ? this.authService.updateExpense(this.editingExpenseId, payload)
      : this.authService.addExpense(payload);

    request$.subscribe({
      next: (response: AddExpenseResponse) => {
        console.log(this.isEditMode ? 'Expense updated successfully' : 'Expense added successfully');
        console.log(response);
        this.cdr.detectChanges();

        const dialogRef = this.dialog.open(AddExpenseSuccessDialog, {
          width: '420px',
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.cancel();
          } else {
            this.router.navigate(['/expenses']);
          }
        });
      },
      error: (error) => {
        console.error(this.isEditMode ? 'Failed to update expense' : 'Failed to add expense', error);
        this.cdr.detectChanges();
        alert(this.isEditMode ? 'Unable to update expense. Please try again.' : 'Unable to add expense. Please try again.');
      },
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