'use server';
import { RefundsResponse } from '@/interfaces/refunds.interface';
import { completeRefund, getRefunds } from '@/services/refunds.service';
import { getToken } from '@/lib/user-provider';
import { redirect } from 'next/navigation';
import { RedirectType } from 'next/navigation';
import { Pagination } from '@/interfaces/common.interface';
import { AxiosError } from 'axios';

export async function useGetRefunds(
  pagination: Pagination
): Promise<RefundsResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    return await getRefunds(token, pagination);
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

export async function useCompleteRefund(
  id: number
): Promise<{ message: string } | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    return await completeRefund(id, token);
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
