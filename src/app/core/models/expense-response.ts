export interface ExpensesResponse {
  success: boolean;
  message: string;
  data: ExpensesData;
}

export interface ExpensesData {
  expenses: Expense[];
  pagination: Pagination;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  notes?: string;
  expenseDate: string;
  paymentMode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  totalExpenses: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}