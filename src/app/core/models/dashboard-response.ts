export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface DashboardData {
  summary: DashboardSummary;
  categorySummary: CategorySummary[];
  recentExpenses: RecentExpense[];
  monthlyTrend: MonthlyTrend[];
  topCategories: TopCategory | TopCategory[];
}

export interface DashboardSummary {
  monthlyBudget?: number;
  totalSpent?: number;
  remainingBalance?: number;
  budgetUtilization?: number;
  budgetStatus?: string;
  remainingDays?: number;
  dailyLimit?: number;
  totalThisMonth: SummaryAmount;
  todaysExpenses: number;
  todaysTransactions: number;
  thisWeeksExpenses: SummaryAmount;
  thisMonthsTransactions: number;
  comparison?: ComparisonSummary;
  forecast?: ForecastSummary;
}

export interface SummaryAmount {
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral' | string;
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
  percentage: number;
}

export interface RecentExpense {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  expenseDate: string;
  paymentMode: string;
}

export interface MonthlyTrend {
  month: string;
  totalAmount: number;
}

export interface TopCategory {
  category: string;
  totalAmount: number;
  percentage: number;
}

export interface ComparisonSummary {
  previousMonth: number;
  currentMonth: number;
  difference: number;
  trend: string;
}

export interface ForecastSummary {
  predictedSpend: number;
  status: string;
}