"use server";

import { CreateExpenseRequest, ExpenseDetailResponse, ExpensesPagination, ExpensesResponse } from "@/interfaces/expenses.interface";
import { createExpense, deleteExpense, getExpenseDetail, getExpenses, updateExpense } from "@/services/expenses/expenses.service";
import { getToken } from "@/lib/user-provider";
import { redirect, RedirectType } from "next/navigation";

export async function useGetExpenses(pagination: ExpensesPagination): Promise<ExpensesResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getExpenses(pagination, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useGetExpenseDetail(id: number): Promise<ExpenseDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
    try{
    return await getExpenseDetail(id, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useCreateExpense(payload: CreateExpenseRequest): Promise<ExpensesResponse | {status?: number, errors?: any}> {   
    const token = (await getToken()) || "";
    if (!token) {
        console.warn("No token found");
        redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    try {
        return await createExpense(payload, token);
    } catch (error: any) {
        console.warn("Hooks:", error.response.data);
        return {    
            status: error.response.status,
            errors: error.response.data,
        };
    }
}

export async function useUpdateExpense(id: number, payload: CreateExpenseRequest): Promise<ExpensesResponse | {status?: number, errors?: any}> {
    const token = (await getToken()) || "";
    if (!token) {
        console.warn("No token found");
        redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    try {
        return await updateExpense(id, payload, token);
    } catch (error: any) {
        console.warn("Hooks:", error.response.data);
        return {
            status: error.response.status,
            errors: error.response.data,
        };
    }
}

export async function useDeleteExpense(id: number): Promise<ExpensesResponse | {status?: number, errors?: any}> {
    const token = (await getToken()) || "";
    if (!token) {
        console.warn("No token found");
        redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    try {
        return await deleteExpense(id, token);
    } catch (error: any) {
        console.warn("Hooks:", error.response.data);
        return {
            status: error.response.status,
            errors: error.response.data,
        };
    }
}
