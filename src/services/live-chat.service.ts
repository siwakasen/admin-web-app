import { createApiInstance } from './api';
import { AxiosResponse } from 'axios';

export interface ChatSession {
  id: number;
  customer_id?: number;
  guest_name: string;
  status_session: 'OPEN' | 'CLOSED';
  session_key: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface ChatSessionsResponse {
  data: ChatSession[];
  message: string;
  status: number;
}

export async function getAllChatSessions(
  token: string
): Promise<ChatSession[]> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    token
  );
  const response: AxiosResponse<ChatSessionsResponse> = await api.get(
    '/live-chat/sessions'
  );

  // Handle different response formats
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (Array.isArray(response.data)) {
    return response.data;
  } else {
    console.warn(
      'Unexpected response format from chat sessions API:',
      response.data
    );
    return [];
  }
}
