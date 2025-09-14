import { RatingResponse } from '@/interfaces/rating.interface';
import { AxiosResponse } from 'axios';
import { createApiInstance } from './api';
import { Pagination } from '@/interfaces/common.interface';

export async function getRating(
  token: string,
  pagination: Pagination
): Promise<RatingResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );
  const { limit, page, search } = pagination;
  let url = `/ratings?page=${page}&limit=${limit}`;
  if (search && search.trim() !== '') {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const response: AxiosResponse = await api.get(url);
  return response.data;
}
