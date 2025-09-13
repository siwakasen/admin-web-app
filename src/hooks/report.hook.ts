'use server';
import {
  BookingMonthlyReportRequest,
  BookingMonthlyReportResponse,
  BookingYearlyReportRequest,
  BookingYearlyReportResponse,
  ExpensesMonthlyReportRequest,
  ExpensesMonthlyReportResponse,
  ExpensesYearlyReportRequest,
  ExpensesYearlyReportResponse,
  ProfitLossReportRequest,
  ProfitLossReportResponse,
  YearBookingComparisonReportRequest,
  YearBookingComparisonReportResponse,
  YearExpensesComparisonReportRequest,
  YearExpensesComparisonReportResponse,
  YearsProfitLossComparisonReportRequest,
  YearsProfitLossComparisonReportResponse,
} from '@/interfaces/report.interface';
import { getToken } from '@/lib/user-provider';
import {
  getBookingMonthlyRevenue,
  getBookingYearlyReport,
  getExpensesMonthlyReport,
  getExpensesYearlyReport,
  getProfitLossReport,
  getYearBookingComparisonReport,
  getYearExpensesComparisonReport,
  getYearsProfitLossComparisonReport,
} from '@/services/report.service';
import { AxiosError } from 'axios';

export async function useGetBookingMonthlyRevenue(
  payload: BookingMonthlyReportRequest
): Promise<BookingMonthlyReportResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || '';
    return await getBookingMonthlyRevenue(payload, token);
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

export async function useGetBookingYearlyReport(
  payload: BookingYearlyReportRequest
): Promise<BookingYearlyReportResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || '';
    const response = await getBookingYearlyReport(payload, token);

    return response;
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

export async function useGetYearBookingComparisonReport(
  payload: YearBookingComparisonReportRequest
): Promise<
  YearBookingComparisonReportResponse | { status?: number; errors?: any }
> {
  try {
    const token = (await getToken()) || '';
    const response = await getYearBookingComparisonReport(payload, token);
    return response;
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

export async function useGetExpensesMonthlyReport(
  payload: ExpensesMonthlyReportRequest
): Promise<ExpensesMonthlyReportResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || '';
    const response = await getExpensesMonthlyReport(payload, token);
    return response;
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

export async function useGetExpensesYearlyReport(
  payload: ExpensesYearlyReportRequest
): Promise<ExpensesYearlyReportResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || '';
    const response = await getExpensesYearlyReport(payload, token);
    return response;
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

export async function useGetYearExpensesComparisonReport(
  payload: YearExpensesComparisonReportRequest
): Promise<
  YearExpensesComparisonReportResponse | { status?: number; errors?: any }
> {
  try {
    const token = (await getToken()) || '';
    const response = await getYearExpensesComparisonReport(payload, token);
    return response;
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

export async function useGetProfitLossReport(
  payload: ProfitLossReportRequest
): Promise<ProfitLossReportResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || '';
    const response = await getProfitLossReport(payload, token);
    return response;
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

export async function useGetYearsProfitLossComparisonReport(
  payload: YearsProfitLossComparisonReportRequest
): Promise<
  YearsProfitLossComparisonReportResponse | { status?: number; errors?: any }
> {
  try {
    const token = (await getToken()) || '';
    const response = await getYearsProfitLossComparisonReport(payload, token);
    return response;
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
