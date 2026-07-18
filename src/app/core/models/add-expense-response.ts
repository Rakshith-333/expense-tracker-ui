export interface AddExpenseResponse {
  success: boolean;
  message: string;
  data: Expense;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  expenseDate: string;
  paymentMode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}