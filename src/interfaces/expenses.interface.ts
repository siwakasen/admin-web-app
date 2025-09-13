import { Meta, Pagination } from './common.interface';

export interface ExpensesResponse {
  data: Expense[];
  meta: Meta;
}

export interface Expense {
  id: number;
  expense_name: string;
  expense_amount: number;
  expense_date: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
}

export interface ExpenseDetailResponse {
  data: Expense;
  message: string;
}

export interface CreateExpenseRequest {
  expense_name: string;
  expense_amount: number;
  expense_date: string;
}

export interface ExpensesPagination extends Pagination {
  start_date?: string;
  end_date?: string;
}
