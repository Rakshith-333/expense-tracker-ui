export interface AddExpenseRequest {
  amount: number;
  category: string;
  expenseDate: string;
  paymentMode: string;
  description: string;
}