"use server";

import { getAllBookings, assignBookingToEmployee, finishBooking, confirmBookingWithoutDriver, getBookingById } from "@/services/bookings.service";
import { getToken } from "@/lib/user-provider";
import { redirect, RedirectType } from "next/navigation";
import { Pagination } from "@/interfaces/common.interface";
import { BookingResponse, BookingStatus, GetAllBookingsResponse } from "@/interfaces/booking.interface";

export async function useGetAllBookings(pagination: Pagination): Promise<GetAllBookingsResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getAllBookings(pagination, token);
  } catch (error: any) {
    console.log("get all bookings error:", error);
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useAssignBookingToEmployee(bookingId: number, employeeId: number): Promise<BookingResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
    }
  try {
    return await assignBookingToEmployee(bookingId, employeeId, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useConfirmBookingWithoutDriver(bookingId: number): Promise<BookingResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try{
    return await confirmBookingWithoutDriver(bookingId, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useConfirmCarBookingWithoutDriver(bookingId: number): Promise<BookingResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try{
    return await confirmBookingWithoutDriver(bookingId, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useFinishBooking(bookingId: number, bookingStatus: BookingStatus.COMPLETED | BookingStatus.NO_SHOW): Promise<BookingResponse| {status?: number, errors?:any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try{
    return await finishBooking(bookingId, bookingStatus, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useGetBookingById(bookingId: number): Promise<BookingResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getBookingById(bookingId, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}