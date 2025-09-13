import { Pagination } from '@/interfaces/common.interface';
import { createApiInstance } from './api';
import {
  BookingResponse,
  BookingStatus,
  GetAllBookingsResponse,
} from '@/interfaces/booking.interface';
import { AxiosResponse } from 'axios';

export async function getAllBookings(
  pagination: Pagination,
  token: string
): Promise<GetAllBookingsResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );

  let url = `/bookings/all?limit=${pagination.limit}&page=${pagination.page}`;
  if (pagination.search && pagination.search.trim() !== '') {
    url += `&search=${encodeURIComponent(pagination.search)}`;
  }

  const response: AxiosResponse = await api.get(url);
  return response.data;
}

export async function assignBookingToEmployee(
  bookingId: number,
  employeeId: number,
  token: string
): Promise<BookingResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );

  const response: AxiosResponse = await api.patch(
    `/bookings/assign-employee/${bookingId}`,
    {
      employee_id: employeeId,
    }
  );
  return response.data;
}

export async function confirmBookingWithoutDriver(
  bookingId: number,
  token: string
): Promise<BookingResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );
  const response: AxiosResponse = await api.patch(
    `/bookings/confirm-without-driver/${bookingId}`
  );
  return response.data;
}

export async function finishBooking(
  bookingId: number,
  bookingStatus: BookingStatus.COMPLETED | BookingStatus.NO_SHOW,
  token: string
): Promise<BookingResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );

  const response: AxiosResponse = await api.patch(
    `/bookings/finish/${bookingId}`,
    {
      status: bookingStatus,
    }
  );
  return response.data;
}

export async function getBookingById(
  bookingId: number,
  token: string
): Promise<BookingResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    token
  );

  const response: AxiosResponse = await api.get(`/bookings/emp/${bookingId}`);
  return response.data;
}
