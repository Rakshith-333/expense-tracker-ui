import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { materialImports } from '../../material';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartOptions } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import {
  CategorySummary,
  DashboardData,
  DashboardResponse,
  RecentExpense,
} from '../../core/models/dashboard-response';

const CATEGORY_STYLES: Record<string, { color: string; icon: string }> = {
  Food: { color: '#FF6384', icon: 'restaurant' },
  Transport: { color: '#36A2EB', icon: 'directions_car' },
  Other: { color: '#FFCE56', icon: 'category' },
  Health: { color: '#4BC0C0', icon: 'medical_services' },
};

const DEFAULT_CATEGORY_STYLE = { color: '#9CA3AF', icon: 'payments' };

@Component({
  selector: 'app-dashboard',
  imports: [materialImports,CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  sidebarOpen = false;
  userName = this.tokenService.getUser<{ name: string }>()?.name ?? 'User';

  summaryCards: Array<{
    title: string;
    amount: string;
    subtitle: string;
    icon: string;
    iconClass: string;
    cardClass: string;
  }> = [];

  categorySummary: CategorySummary[] = [];
  recentExpenses: Array<RecentExpense & { icon: string; color: string; date: string }> = [];
  topCategories: Array<{ name: string; amount: number; percentage: number; color: string }> = [];

  selectedPeriod = 'month';
  selectedTrend = 'month';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Expenses',
        data: [],
        borderColor: '#7C3AED',
        backgroundColor: 'rgba(124,58,237,.15)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  pieChartType: ChartType = 'doughnut';

  pieChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 0,
      },
    ],
  };

  isLoading = true;
  hasError = false;

  ngOnInit(): void {
    this.loadDashboard();
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.hasError = false;

    this.authService.getDashboard().subscribe({
      next: (response: DashboardResponse) => {
        this.applyDashboardData(response.data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
        alert('Unable to load dashboard data. Please login again or try later.');
        this.tokenService.logout();
        this.router.navigate(['/login']);
      },
    });
  }

  private applyDashboardData(dashboard: DashboardData): void {
    this.summaryCards = [
      {
        title: 'Total This Month',
        amount: `₹${dashboard.summary.totalThisMonth.amount}`,
        subtitle: `${dashboard.summary.totalThisMonth.percentage}% ${dashboard.summary.totalThisMonth.trend}`,
        icon: 'account_balance_wallet',
        iconClass: 'purple-icon',
        cardClass: 'purple-card',
      },
      {
        title: "Today's Expense",
        amount: `₹${dashboard.summary.todaysExpenses}`,
        subtitle: `${dashboard.summary.todaysTransactions} transaction${dashboard.summary.todaysTransactions === 1 ? '' : 's'}`,
        icon: 'trending_up',
        iconClass: 'green-icon',
        cardClass: 'green-card',
      },
      {
        title: 'This Week',
        amount: `₹${dashboard.summary.thisWeeksExpenses.amount}`,
        subtitle: `${dashboard.summary.thisWeeksExpenses.percentage}% ${dashboard.summary.thisWeeksExpenses.trend}`,
        icon: 'calendar_month',
        iconClass: 'blue-icon',
        cardClass: 'blue-card',
      },
      {
        title: 'This Month Transactions',
        amount: `${dashboard.summary.thisMonthsTransactions}`,
        subtitle: 'Transactions this month',
        icon: 'pie_chart',
        iconClass: 'orange-icon',
        cardClass: 'orange-card',
      },
    ];

    this.categorySummary = dashboard.categorySummary;

    this.recentExpenses = dashboard.recentExpenses.map((expense) => {
      const style = CATEGORY_STYLES[expense.category] ?? DEFAULT_CATEGORY_STYLE;
      return {
        ...expense,
        icon: style.icon,
        color: style.color,
        date: new Date(expense.expenseDate).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
        }),
      };
    });

    this.topCategories = dashboard.categorySummary.map((category) => {
      const style = CATEGORY_STYLES[category.category] ?? DEFAULT_CATEGORY_STYLE;
      return {
        name: category.category,
        amount: category.totalAmount,
        percentage: category.percentage,
        color: style.color,
      };
    });

    this.pieChartData = {
      labels: dashboard.categorySummary.map((item) => item.category),
      datasets: [
        {
          data: dashboard.categorySummary.map((item) => item.totalAmount),
          backgroundColor: dashboard.categorySummary.map(
            (item) => (CATEGORY_STYLES[item.category] ?? DEFAULT_CATEGORY_STYLE).color
          ),
          borderWidth: 0,
        },
      ],
    };

    this.lineChartData = {
      labels: dashboard.monthlyTrend.map((trend) => trend.month),
      datasets: [
        {
          label: 'Expenses',
          data: dashboard.monthlyTrend.map((trend) => trend.totalAmount),
          borderColor: '#7C3AED',
          backgroundColor: 'rgba(124,58,237,.15)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }
}





