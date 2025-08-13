'use server';
import { getToken } from "@/lib/user-provider";


import { redirect } from "next/navigation";
import { RedirectType } from "next/navigation";
import { AdjustmentStatus, ApprovementCancellationResponse, BookingAdjustmentResponse } from "@/interfaces/booking-adjustments.interface";
import { approvementCancellation, getAllBookingAdjustments } from "@/services/booking-adjustments.service";
import { Pagination } from "@/interfaces/common.interface";

export async function useGetAllBookingAdjustments(pagination: Pagination): Promise<BookingAdjustmentResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getAllBookingAdjustments(token, pagination);
  } catch (error: any) {
    console.warn("Hooks:", error.response);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
};

export async function useApprovementCancellation(id: number, status: AdjustmentStatus.APPROVED | AdjustmentStatus.REJECTED): Promise<ApprovementCancellationResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await approvementCancellation(id, token, status);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

// export async function useGetBookingById(bookingId: number): Promise<BookingResponse | { status?: number; errors?: any }> {
//   const token = (await getToken()) || "";
//   if (!token) {
//     console.warn("No token found");
//     redirect("/redirect/reset-cookie", RedirectType.replace);
//   }
//   try {
//     return await getBookingById(bookingId, token);
//   } catch (error: any) {
//     console.warn("Hooks:", error.response.data);
//     return {
//       status: error.response.status,
//       errors: error.response.data,
//     };
//   }
// }