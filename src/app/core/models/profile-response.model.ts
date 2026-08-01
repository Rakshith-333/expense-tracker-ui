export interface ProfileUser {
  _id?: string;
  name: string;
  email: string;
  mobileNumber?: string;
  monthlyBudget?: number;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  user: ProfileUser;
}

export interface UpdateMonthlyBudgetRequest {
  monthlyBudget: number;
}

export interface UpdateMonthlyBudgetResponse {
  success: boolean;
  message: string;
}
