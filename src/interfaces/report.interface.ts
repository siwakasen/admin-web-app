import { Payment } from './booking.interface';
import { Refunds } from './refunds.interface';
import { Expense } from './expenses.interface';
import { Employee } from './employees.interface';

export interface BookingMonthlyReportRequest {
  start_date: string;
  end_date: string;
}

export interface BookingMonthlyReportResponse {
  gross_revenue: number;
  refund_cost: number;
  payment_gateway_cost: number;
  net_revenue: number;
  booking_count: number;
  bookings_data: BookingWithRefunds[];
}

export interface BookingYearlyReportRequest {
  year: number;
}

export interface BookingYearlyReportResponse {
  year: number;
  totals: YearlyTotalsBooking;
  monthly_breakdown: MonthlyBreakdown[];
  data: BookingWithRefunds[];
}

export interface YearlyTotalsBooking {
  gross_revenue: number;
  refund_cost: number;
  payment_gateway_cost: number;
  net_revenue: number;
}

export interface MonthlyBreakdown extends BookingMonthlyReportResponse {
  month: number;
  month_name: string;
}

export interface BookingWithRefunds {
  id: number;
  package_id: number;
  car_id: any;
  customer_id: number;
  employee_id: number;
  with_driver: boolean;
  number_of_persons: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  pickup_location: string;
  pickup_time: string;
  additional_notes: string;
  created_at: string;
  updated_at: string;
  payments: Payment[];
  refunds: Refunds;
}

export interface YearBookingComparisonReportRequest {
  start_year: number;
  end_year: number;
}

export interface YearBookingComparisonReportResponse {
  yearly_breakdown: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  gross_revenue: number;
  refund_cost: number;
  payment_gateway_cost: number;
  net_revenue: number;
}

export interface ExpensesMonthlyReportRequest {
  start_date: string;
  end_date: string;
}

export interface ExpensesMonthlyReportResponse {
  total_cost: number;
  employees: Employees;
  expenses: Expenses;
}

export interface Employees {
  salary_cost: number;
  employee_data: Employee[];
  employee_count: number;
}

export interface Expenses {
  expenses_cost: number;
  expenses_data: Expense[];
  expenses_count: number;
}

export interface ExpensesYearlyReportRequest {
  year: number;
}

export interface ExpensesYearlyReportResponse {
  year: number;
  totals: YearlyTotalsExpenses;
  monthly_breakdown: MonthlyBreakdownExpenses[];
}

export interface YearlyTotalsExpenses {
  total_cost: number;
  employees: EmployeesData;
  expenses: ExpensesData;
}

export interface EmployeesData {
  salary_cost: number;
  employee_count: number;
}

export interface ExpensesData {
  expenses_cost: number;
  expenses_count: number;
}

export interface MonthlyBreakdownExpenses
  extends ExpensesMonthlyReportResponse {
  month: number;
  month_name: string;
}

export interface YearExpensesComparisonReportRequest {
  start_year: number;
  end_year: number;
}

export interface YearExpensesComparisonReportResponse {
  yearly_breakdown: YearlyBreakdownExpenses[];
}

export interface YearlyBreakdownExpenses {
  year: number;
  total_cost: number;
  salary_cost: number;
  expenses_cost: number;
}

export interface ProfitLossReportRequest {
  year: number;
}

export interface ProfitLossReportResponse {
  year: number;
  monthly_breakdown: MonthlyBreakdownProfitLoss[];
}

export interface MonthlyBreakdownProfitLoss {
  month: number;
  monthName: string;
  revenue: Revenue;
  costs: Costs;
  profit_loss: number;
}

export interface Revenue {
  gross_revenue: number;
  refund_cost: number;
  payment_gateway_cost: number;
  net_revenue: number;
}

export interface Costs {
  salary_cost: number;
  expenses_cost: number;
  total_cost: number;
}

export interface YearsProfitLossComparisonReportRequest {
  start_year: number;
  end_year: number;
}

export interface YearsProfitLossComparisonReportResponse {
  yearly_breakdown: YearlyBreakdownProfitLoss[];
}

export interface YearlyBreakdownProfitLoss {
  year: number;
  revenue: Revenue;
  costs: Costs;
  profit_loss: number;
}

export interface Revenue {
  gross_revenue: number;
  refund_cost: number;
  payment_gateway_cost: number;
  net_revenue: number;
}

export interface Costs {
  salary_cost: number;
  expenses_cost: number;
  total_cost: number;
}
