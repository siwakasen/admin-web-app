'use server';

import {
  CreateExpenseRequest,
  ExpenseDetailResponse,
  ExpensesPagination,
  ExpensesResponse,
} from '@/interfaces';
import {
  createExpense,
  deleteExpense,
  getExpenseDetail,
  getExpenses,
  updateExpense,
} from '@/services';
import { getToken } from '@/lib/user-provider';
import { redirect, RedirectType } from 'next/navigation';
import { AxiosError } from 'axios';

export async function useGetExpenses(
  pagination: ExpensesPagination
): Promise<ExpensesResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useGetExpenses | payload', { pagination });
    const response = await getExpenses(pagination, token);
    console.log('useGetExpenses | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response?.status,
      errors: error.response?.data,
    };
  }
}

export async function useGetExpenseDetail(
  id: number
): Promise<ExpenseDetailResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useGetExpenseDetail | payload', { id });
    const response = await getExpenseDetail(id, token);
    console.log('useGetExpenseDetail | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response?.status,
      errors: error.response?.data,
    };
  }
}

export async function useCreateExpense(
  payload: CreateExpenseRequest
): Promise<ExpensesResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useCreateExpense | payload', { payload });
    const response = await createExpense(payload, token);
    console.log('useCreateExpense | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response?.status,
      errors: error.response?.data,
    };
  }
}

export async function useUpdateExpense(
  id: number,
  payload: CreateExpenseRequest
): Promise<ExpensesResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useUpdateExpense | payload', { id, payload });
    const response = await updateExpense(id, payload, token);
    console.log('useUpdateExpense | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response?.status,
      errors: error.response?.data,
    };
  }
}

export async function useDeleteExpense(
  id: number
): Promise<ExpensesResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useDeleteExpense | payload', { id });
    const response = await deleteExpense(id, token);
    console.log('useDeleteExpense | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response?.status,
      errors: error.response?.data,
    };
  }
}
