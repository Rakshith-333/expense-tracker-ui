import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { materialImports } from '../../material';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AddExpenseRequest } from '../../core/models/add-expense-request';
import { AddExpenseResponse } from '../../core/models/add-expense-response';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddExpenseSuccessDialog } from '../../shared/components/add-expense-success-dialog/add-expense-success-dialog';

@Component({
  selector: 'app-add-expense',
  imports: [materialImports, FormsModule, CommonModule],
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
    amount: null,
    category: '',
    description: '',
    date: new Date(),
    paymentMode: '',
    notes: ''
  };
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

    const payload: AddExpenseRequest = {
      amount: Number(this.expense.amount),
      category: this.expense.category,
      expenseDate: this.expense.date.toISOString().split('T')[0],
      paymentMode: this.expense.paymentMode,
      description: this.expense.description
    };

    this.authService.addExpense(payload).subscribe({

      next: (response: AddExpenseResponse) => {

        console.log('Expense added successfully');
        console.log(response);

        this.cancel();

        // this.isLoading = false;
        this.cdr.detectChanges();

      const dialogRef = this.dialog.open(AddExpenseSuccessDialog, {
        width: '420px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result =>{
        if(result){
          this.cancel();
        }else{
          this.router.navigate(['/expenses'])
        }
      });

      },

      error: (error) => {

        console.error('Failed to add expense', error);

        // this.hasError = true;
        // this.isLoading = false;
        this.cdr.detectChanges();

        alert('Unable to add expense. Please try again.');

      }

    });

  }

  cancel() {
    this.expense = {
      amount: null,
      category: '',
      description: '',
      date: new Date(),
      paymentMode: '',
      notes: ''
    };
  }

 


}
