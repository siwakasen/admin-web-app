'use server';
import { Pagination } from "@/interfaces/common.interface";
import { createApiInstance } from "./api";
import { AdjustmentStatus, ApprovementCancellationResponse, BookingAdjustmentDetailsResponse, BookingAdjustmentResponse, RescheduleAdjustmentResponse } from "@/interfaces/booking-adjustments.interface";
import { AxiosResponse } from "axios";

export async function getAllBookingAdjustments(
  token: string,
  pagination: Pagination
): Promise<BookingAdjustmentResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );

  let url = `/bookings/adjustments/all?limit=${pagination.limit}&page=${pagination.page}`;
  if (pagination.search && pagination.search.trim() !== '') {
    url += `&search=${encodeURIComponent(pagination.search)}`;
  }

  const response: AxiosResponse = await api.get(url);
  return response.data;
}

export async function getBookingAdjustmentById(
  id: number,
  token: string
): Promise<BookingAdjustmentDetailsResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );

  const response: AxiosResponse = await api.get(`/bookings/adjustments/${id}`);
  return response.data;
}

export async function approvementCancellation(
  id: number,
  token: string,
  status: AdjustmentStatus.APPROVED | AdjustmentStatus.REJECTED
): Promise<ApprovementCancellationResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );

  const response: AxiosResponse = await api.patch(`/bookings/aprrovement-cancellation/${id}`, {
    status: status
  });
  return response.data;
}

export async function rescheduleAdjustment(
  id: number,
  token: string,
  status: AdjustmentStatus.APPROVED | AdjustmentStatus.REJECTED,
  employee_id?: string,
): Promise<RescheduleAdjustmentResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );

  const response: AxiosResponse = await api.patch(`/bookings/approvement-reschedule/${id}`, {
    status: status,
    employee_id: employee_id
  });
  return response.data;
}