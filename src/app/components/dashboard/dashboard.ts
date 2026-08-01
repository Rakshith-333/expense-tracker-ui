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
  TopCategory,
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
  imports: [materialImports, CommonModule, RouterModule, BaseChartDirective],
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

  budgetInsights: Array<{
    label: string;
    value: string;
    helper: string;
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
    const summary = dashboard.summary ?? ({} as DashboardData['summary']);
    const monthlyBudget = summary.monthlyBudget ?? 0;
    const totalSpent = summary.totalSpent ?? summary.totalThisMonth?.amount ?? 0;
    const remainingBalance = summary.remainingBalance ?? Math.max(monthlyBudget - totalSpent, 0);
    const budgetUtilization = summary.budgetUtilization ?? summary.totalThisMonth?.percentage ?? 0;
    const budgetStatus = summary.budgetStatus ?? 'Good';
    const remainingDays = summary.remainingDays ?? 30;
    const dailyLimit = summary.dailyLimit ?? 0;
    const forecastStatus = summary.forecast?.status ?? 'Within Budget';
    const forecastSpend = summary.forecast?.predictedSpend ?? 0;
    const comparisonDiff = summary.comparison?.difference ?? 0;
    const comparisonTrend = summary.comparison?.trend ?? 'saved';

    const categoryList = Array.isArray(dashboard.categorySummary)
      ? dashboard.categorySummary
      : [];

    const topCategoryList = Array.isArray(dashboard.topCategories)
      ? dashboard.topCategories
      : dashboard.topCategories
        ? [dashboard.topCategories]
        : [];

    const chartCategories = categoryList.length > 0 ? categoryList : topCategoryList;

    this.summaryCards = [
      {
        title: 'Monthly Budget',
        amount: `₹${monthlyBudget}`,
        subtitle: `Status: ${budgetStatus}`,
        icon: 'account_balance_wallet',
        iconClass: 'purple-icon',
        cardClass: 'purple-card',
      },
      {
        title: 'Total Spent',
        amount: `₹${totalSpent}`,
        subtitle: `${budgetUtilization}% utilization`,
        icon: 'trending_up',
        iconClass: 'green-icon',
        cardClass: 'green-card',
      },
      {
        title: 'Remaining Balance',
        amount: `₹${remainingBalance}`,
        subtitle: `${remainingDays} days left`,
        icon: 'savings',
        iconClass: 'blue-icon',
        cardClass: 'blue-card',
      },
      {
        title: 'Daily Limit',
        amount: `₹${dailyLimit}`,
        subtitle: `Forecast: ${forecastStatus}`,
        icon: 'calendar_month',
        iconClass: 'orange-icon',
        cardClass: 'orange-card',
      },
    ];

    this.budgetInsights = [
      {
        label: 'Budget Status',
        value: budgetStatus,
        helper: `${budgetUtilization}% of budget used`,
      },
      {
        label: 'Forecast',
        value: `₹${forecastSpend}`,
        helper: forecastStatus,
      },
      {
        label: 'Comparison',
        value: `₹${comparisonDiff}`,
        helper: `${comparisonTrend} vs previous month`,
      },
    ];

    this.categorySummary = chartCategories;

    this.recentExpenses = (dashboard.recentExpenses ?? []).map((expense) => {
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

    this.topCategories = topCategoryList.map((category: TopCategory) => {
      const style = CATEGORY_STYLES[category.category] ?? DEFAULT_CATEGORY_STYLE;
      return {
        name: category.category,
        amount: category.totalAmount,
        percentage: category.percentage,
        color: style.color,
      };
    });

    this.pieChartData = {
      labels: chartCategories.map((item) => item.category),
      datasets: [
        {
          data: chartCategories.map((item) => item.totalAmount),
          backgroundColor: chartCategories.map(
            (item) => (CATEGORY_STYLES[item.category] ?? DEFAULT_CATEGORY_STYLE).color
          ),
          borderWidth: 0,
        },
      ],
    };

    this.lineChartData = {
      labels: (dashboard.monthlyTrend ?? []).map((trend) => trend.month),
      datasets: [
        {
          label: 'Expenses',
          data: (dashboard.monthlyTrend ?? []).map((trend) => trend.totalAmount),
          borderColor: '#7C3AED',
          backgroundColor: 'rgba(124,58,237,.15)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }
}





