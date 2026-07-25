import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { materialImports } from '../../material';
import { AuthService } from '../../core/services/auth.service';
import { Expense, Pagination } from '../../core/models/expense-response';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    materialImports
  ],
  providers: [DatePipe],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss'
})
export class Expenses implements OnInit {

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly datePipe = inject(DatePipe);
  private readonly cdr = inject(ChangeDetectorRef);
  pages: number[] = [];

  expenses: Expense[] = [];

  pagination: Pagination = {
    totalExpenses: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
  };

  totalAmount = 0;
  averageAmount = 0;
  highestExpense = 0;
  highestExpenseDescription = '';

  ngOnInit(): void {

    this.loadExpenses();

  }

  loadExpenses(page: number = 1) {

    this.authService.getExpenses(page, this.pagination.pageSize).subscribe({

      next: (response) => {

        this.expenses = [...response.data.expenses];
        this.pagination = response.data.pagination;

        this.calculateSummary();
        this.generatePages();
        this.cdr.detectChanges();

      },

      error: (err) => {
        console.error(err);
      }

    });

  }
  generatePages() {

    this.pages = [];

    for (let i = 1; i <= this.pagination.totalPages; i++) {
      this.pages.push(i);
    }

  }

  goToPage(page: number) {

    if (
      page >= 1 &&
      page <= this.pagination.totalPages &&
      page !== this.pagination.currentPage
    ) {

      this.loadExpenses(page);

    }

  }
  previousPage() {

    if (this.pagination.currentPage > 1) {

      this.loadExpenses(this.pagination.currentPage - 1);

    }

  }

  nextPage() {

    if (this.pagination.currentPage < this.pagination.totalPages) {

      this.loadExpenses(this.pagination.currentPage + 1);

    }

  }

  calculateSummary() {

    if (this.expenses.length === 0) {

      return;

    }

    this.totalAmount = this.expenses.reduce((sum, item) => sum + item.amount, 0);

    this.averageAmount = Math.round(this.totalAmount / this.expenses.length);

    const highest = this.expenses.reduce((a, b) =>
      a.amount > b.amount ? a : b
    );

    this.highestExpense = highest.amount;
    this.highestExpenseDescription = highest.description ?? '-';

  }

  formatDate(date: string) {

    return this.datePipe.transform(date, 'dd MMM');

  }

  formatDay(date: string) {

    return this.datePipe.transform(date, 'EEEE');

  }

  getCategoryIcon(category: string): string {

    switch (category) {

      case 'Food':
      case 'Food & Dining':
        return 'restaurant';

      case 'Transportation':
      case 'Transport':
        return 'directions_car';

      case 'Travel':
        return 'flight';

      case 'Beauty':
        return 'spa';

      case 'Shopping':
        return 'shopping_bag';

      case 'Medical':
        return 'medical_services';

      default:
        return 'category';

    }

  }

  addExpense() {

    this.router.navigate(['/add-expense']);

  }


}