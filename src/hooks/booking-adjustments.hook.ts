'use server';
import { getToken } from "@/lib/user-provider";


import { redirect } from "next/navigation";
import { RedirectType } from "next/navigation";
import { AdjustmentStatus, ApprovementCancellationResponse, BookingAdjustmentDetailsResponse, BookingAdjustmentResponse, RescheduleAdjustmentResponse } from "@/interfaces/booking-adjustments.interface";
import { approvementCancellation, getAllBookingAdjustments, getBookingAdjustmentById, rescheduleAdjustment } from "@/services/booking-adjustments.service";
import { Pagination } from "@/interfaces/common.interface";
import { AxiosError } from "axios";

export async function useGetAllBookingAdjustments(pagination: Pagination): Promise<BookingAdjustmentResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || "";
  if (!token) {
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getAllBookingAdjustments(token, pagination);
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
};

export async function useGetBookingAdjustmentById(id: number): Promise<BookingAdjustmentDetailsResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || "";
  if (!token) {
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getBookingAdjustmentById(id, token);
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
};

export async function useApprovementCancellation(id: number, status: AdjustmentStatus.APPROVED | AdjustmentStatus.REJECTED): Promise<ApprovementCancellationResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || "";
  if (!token) {
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await approvementCancellation(id, token, status);
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

export async function useRescheduleAdjustment(id: number, status: AdjustmentStatus.APPROVED | AdjustmentStatus.REJECTED, employee_id?: string): Promise<RescheduleAdjustmentResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || "";
  if (!token) {
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await rescheduleAdjustment(id, token, status, employee_id);
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