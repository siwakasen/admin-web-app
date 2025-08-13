import { RefundsResponse } from "@/interfaces/refunds.interface";
import { createApiInstance } from "./api";
import { AxiosResponse } from "axios";
import { Pagination } from "@/interfaces/common.interface";

export async function getRefunds(token: string, pagination: Pagination): Promise<RefundsResponse> {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL, token);
  let url = `/refunds/data/all?limit=${pagination.limit}&page=${pagination.page}`;
  if (pagination.search && pagination.search.trim() !== '') {
    url += `&search=${encodeURIComponent(pagination.search)}`;
  }
  const response: AxiosResponse = await api.get(url);
  return response.data;
}

export async function completeRefund(id: number, token: string): Promise<{message: string}> {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL, token);
  const response: AxiosResponse = await api.patch(`/refunds/complete/${id}`);
  return response.data;
}
