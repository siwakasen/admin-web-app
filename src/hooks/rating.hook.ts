'use server';
import { Pagination } from '@/interfaces/common.interface';
import { RatingResponse } from '@/interfaces/rating.interface';
import { getToken } from '@/lib/user-provider';
import { redirect, RedirectType } from 'next/navigation';
import { getRating } from '@/services/rating.service';
import { AxiosError } from 'axios';

export async function useGetRating(
  pagination: Pagination
): Promise<RatingResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    return await getRating(token, pagination);
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
