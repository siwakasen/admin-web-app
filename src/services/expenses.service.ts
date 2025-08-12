import { createApiInstance } from "./api";
import { CreateExpenseRequest, ExpenseDetailResponse, ExpensesResponse, ExpensesPagination } from "@/interfaces/expenses.interface";
import { AxiosResponse } from "axios";

export async function getExpenses(
  pagination: ExpensesPagination,
  token: string
): Promise<ExpensesResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EXPENSES_API_URL,
    token
  );
  
  // Build query parameters
  const params = new URLSearchParams({
    limit: pagination.limit.toString(),
    page: pagination.page.toString(),
    search: pagination.search || "",
  });
  
  // Add date range parameters if provided
  if (pagination.start_date) {
    params.append('start_date', pagination.start_date);
  }
  if (pagination.end_date) {
    params.append('end_date', pagination.end_date);
  }

  const response: AxiosResponse = await api.get(
    `/expenses?${params.toString()}`,
  );
  return response.data;
}

export async function getExpenseDetail(
  id: number,
  token: string
): Promise<ExpenseDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EXPENSES_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/expenses/${id}`,
  );
  return response.data;
}

export async function createExpense(
  payload: CreateExpenseRequest,
  token: string
): Promise<ExpensesResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EXPENSES_API_URL,
    token
  );
  const response: AxiosResponse = await api.post(
    `/expenses`,
    payload,
  );
  return response.data;
}

export async function updateExpense(
  id: number,
  payload: CreateExpenseRequest,
  token: string
): Promise<ExpensesResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EXPENSES_API_URL,
    token
  );
  const response: AxiosResponse = await api.put(
    `/expenses/${id}`,
    payload,
  );
  return response.data;
}

export async function deleteExpense(
  id: number,
  token: string
): Promise<ExpensesResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EXPENSES_API_URL,
    token
  );
  const response: AxiosResponse = await api.delete(
    `/expenses/${id}`,
  );
  return response.data;
}