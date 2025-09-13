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
import { createApiInstance } from './api';
import { AxiosResponse } from 'axios';

export async function getBookingMonthlyRevenue(
  payload: BookingMonthlyReportRequest,
  token: string
): Promise<BookingMonthlyReportResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REPORT_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/report/monthly/bookings?start_date=${encodeURIComponent(
      payload.start_date
    )}&end_date=${encodeURIComponent(payload.end_date)}`
  );
  return response.data;
}

export async function getBookingYearlyReport(
  payload: BookingYearlyReportRequest,
  token: string
): Promise<BookingYearlyReportResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REPORT_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/report/yearly/bookings?year=${payload.year}`
  );
  return response.data;
}

export async function getYearBookingComparisonReport(
  payload: YearBookingComparisonReportRequest,
  token: string
): Promise<YearBookingComparisonReportResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REPORT_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/report/year-comparison/bookings?start_year=${payload.start_year}&end_year=${payload.end_year}`
  );
  return response.data;
}

export async function getExpensesMonthlyReport(
  payload: ExpensesMonthlyReportRequest,
  token: string
): Promise<ExpensesMonthlyReportResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REPORT_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/report/monthly/expenses?start_date=${encodeURIComponent(
      payload.start_date
    )}&end_date=${encodeURIComponent(payload.end_date)}`
  );
  return response.data;
}

export async function getExpensesYearlyReport(
  payload: ExpensesYearlyReportRequest,
  token: string
): Promise<ExpensesYearlyReportResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REPORT_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/report/yearly/expenses?year=${payload.year}`
  );
  return response.data;
}

export async function getYearExpensesComparisonReport(
  payload: YearExpensesComparisonReportRequest,
  token: string
): Promise<YearExpensesComparisonReportResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REPORT_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/report/year-comparison/expenses?start_year=${payload.start_year}&end_year=${payload.end_year}`
  );
  return response.data;
}

export async function getProfitLossReport(
  payload: ProfitLossReportRequest,
  token: string
): Promise<ProfitLossReportResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REPORT_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/report/yearly/profit-loss?year=${payload.year}`
  );
  return response.data;
}

export async function getYearsProfitLossComparisonReport(
  payload: YearsProfitLossComparisonReportRequest,
  token: string
): Promise<YearsProfitLossComparisonReportResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REPORT_API_URL,
    token
  );
  const response: AxiosResponse = await api.get(
    `/report/year-comparison/profit-loss?start_year=${payload.start_year}&end_year=${payload.end_year}`
  );
  return response.data;
}
