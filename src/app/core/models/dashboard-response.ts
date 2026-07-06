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
  topCategories: TopCategory;
}

export interface DashboardSummary {
  totalThisMonth: SummaryAmount;
  todaysExpenses: number;
  todaysTransactions: number;
  thisWeeksExpenses: SummaryAmount;
  thisMonthsTransactions: number;
}

export interface SummaryAmount {
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
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