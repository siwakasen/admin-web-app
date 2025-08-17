"use server";

import { getAllBookings, assignBookingToEmployee, finishBooking, confirmBookingWithoutDriver, getBookingById } from "@/services/bookings.service";
import { getToken } from "@/lib/user-provider";
import { redirect, RedirectType } from "next/navigation";
import { Pagination } from "@/interfaces/common.interface";
import { BookingResponse, BookingStatus, GetAllBookingsResponse } from "@/interfaces/booking.interface";
import { AxiosError } from "axios";

export async function useGetAllBookings(pagination: Pagination): Promise<GetAllBookingsResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getAllBookings(pagination, token);
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

export async function useAssignBookingToEmployee(bookingId: number, employeeId: number): Promise<BookingResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
    }
  try {
    return await assignBookingToEmployee(bookingId, employeeId, token);
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

export async function useConfirmBookingWithoutDriver(bookingId: number): Promise<BookingResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try{
    return await confirmBookingWithoutDriver(bookingId, token);
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

export async function useConfirmCarBookingWithoutDriver(bookingId: number): Promise<BookingResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try{
    return await confirmBookingWithoutDriver(bookingId, token);
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

export async function useFinishBooking(bookingId: number, bookingStatus: BookingStatus.COMPLETED | BookingStatus.NO_SHOW): Promise<BookingResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try{
    return await finishBooking(bookingId, bookingStatus, token);
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

export async function useGetBookingById(bookingId: number): Promise<BookingResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getBookingById(bookingId, token);
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