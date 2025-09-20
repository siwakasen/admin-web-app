'use server';
import { getToken } from '@/lib/user-provider';
import { getAllChatSessions, ChatSession } from '@/services/live-chat.service';
import { redirect, RedirectType } from 'next/navigation';
import { AxiosError } from 'axios';

export async function useGetChatSessions(): Promise<
  ChatSession[] | { status?: number; errors?: any }
> {
  const token = (await getToken()) || '';
  try {
    return await getAllChatSessions(token);
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
