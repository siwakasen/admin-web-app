"use server";

import { CreateExpenseRequest, ExpenseDetailResponse, ExpensesPagination, ExpensesResponse } from "@/interfaces";
import { createExpense, deleteExpense, getExpenseDetail, getExpenses, updateExpense } from "@/services";
import { getToken } from "@/lib/user-provider";
import { redirect, RedirectType } from "next/navigation";
import { AxiosError } from "axios";

export async function useGetExpenses(pagination: ExpensesPagination): Promise<ExpensesResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getExpenses(pagination, token);
  } catch (error: any) {
    if(error instanceof AxiosError) {
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

export async function useGetExpenseDetail(id: number): Promise<ExpenseDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
    try{
    return await getExpenseDetail(id, token);
  } catch (error: any) {
    if(error instanceof AxiosError) {
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

export async function useCreateExpense(payload: CreateExpenseRequest): Promise<ExpensesResponse | {status?: number, errors?: any}> {   
    const token = (await getToken()) || "";
    if (!token) {
         
        redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    try {
        return await createExpense(payload, token);
    } catch (error: any) {
        if(error instanceof AxiosError) {
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

export async function useUpdateExpense(id: number, payload: CreateExpenseRequest): Promise<ExpensesResponse | {status?: number, errors?: any}> {
    const token = (await getToken()) || "";
    if (!token) {
         
        redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    try {
        return await updateExpense(id, payload, token);
    } catch (error: any) {
        if(error instanceof AxiosError) {
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

export async function useDeleteExpense(id: number): Promise<ExpensesResponse | {status?: number, errors?: any}> {
    const token = (await getToken()) || "";
    if (!token) {
         
        redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    try {
        return await deleteExpense(id, token);
    } catch (error: any) {
        if(error instanceof AxiosError) {
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
