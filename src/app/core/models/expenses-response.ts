export interface Expense {

  _id: string;

  userId: string;

  amount: number;

  category: string;

  description?: string;

  expenseDate: string;

  paymentMode: string;

  notes?: string;

  createdAt: string;

  updatedAt: string;

  __v: number;

}


export interface ExpensePagination {

  totalExpenses: number;

  currentPage: number;

  pageSize: number;

  totalPages: number;

}


export interface ExpenseData {

  expenses: Expense[];

  pagination: ExpensePagination;

}


export interface ExpenseResponse {

  success: boolean;

  message: string;

  data: ExpenseData;

}