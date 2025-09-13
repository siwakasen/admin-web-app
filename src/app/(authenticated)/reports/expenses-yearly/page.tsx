'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetExpensesYearlyReport } from '@/hooks/report.hook';
import { getToken } from '@/lib/user-provider/cookies';
import { ExpensesYearlyReportResponse } from '@/interfaces/report.interface';
import {
  TrendingUp,
  Users,
  Receipt,
  Calendar,
  X,
  Printer,
  DollarSign,
} from 'lucide-react';
import { YearlyExpensesChart } from './_components/yearly-chart';

// Utility function to format currency
const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ExpensesYearlyPage() {
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedMonth, setSelectedMonth] = useState<string>('1');
  const [reportData, setReportData] =
    useState<ExpensesYearlyReportResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [yearOptions, setYearOptions] = useState<string[]>(
    (() => {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
    })()
  );

  const monthOptions = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const chartData =
    reportData?.monthly_breakdown?.map((month) => ({
      month: month.month_name,
      salary_cost: month.employees.salary_cost,
      expenses_cost: month.expenses.expenses_cost,
    })) || [];

  // Get token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      if (userToken) {
        setToken(userToken);
      }
    };
    fetchToken();
  }, []);

  // Fetch report data when year changes
  useEffect(() => {
    if (token && selectedYear) {
      fetchReportData();
    }
  }, [token, selectedYear]);

  const fetchReportData = async () => {
    if (!token) return;

    setError('');
    try {
      const data = await useGetExpensesYearlyReport({
        year: parseInt(selectedYear),
      });
      if ('year' in data) {
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to fetch report data. Please try again.');
    } finally {
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Get selected month's data
  const getSelectedMonthData = () => {
    if (!reportData?.monthly_breakdown) return null;
    return reportData.monthly_breakdown.find(
      (month) => month.month === parseInt(selectedMonth)
    );
  };

  const selectedMonthData = getSelectedMonthData();

  // Calculate totals from report data
  const totals = reportData?.totals || {
    total_cost: 0,
    employees: {
      salary_cost: 0,
      employee_count: 0,
    },
    expenses: {
      expenses_cost: 0,
      expenses_count: 0,
    },
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <X className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchReportData} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Yearly Expenses Report
          </h1>
          <p className="text-gray-600 mt-1">
            An overview of yearly expenses including salary costs and
            operational expenses.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handlePrintReport}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>

      <YearlyExpensesChart chartData={chartData} />

      <div className="flex flex-col gap-2 pl-2">
        <label className="text-sm font-medium text-gray-700">Year</label>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.total_cost)}
                </p>
              </div>
              <span className="h-8 w-8 text-2xl text-red-600">IDR</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Salary Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.employees.salary_cost)}
                </p>
                <p className="text-xs text-gray-500">
                  {totals.employees.employee_count} employees
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Expenses Cost
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.expenses.expenses_cost)}
                </p>
                <p className="text-xs text-gray-500">
                  {totals.expenses.expenses_count} expenses
                </p>
              </div>
              <Receipt className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Breakdown for {selectedYear}
          </CardTitle>
          <CardDescription>
            A summary of expenses for each month in the selected year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MONTH</TableHead>
                <TableHead>TOTAL COST</TableHead>
                <TableHead>SALARY COST</TableHead>
                <TableHead>EXPENSES COST</TableHead>
                <TableHead>EMPLOYEE COUNT</TableHead>
                <TableHead>EXPENSES COUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData?.monthly_breakdown?.map((month, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {month.month_name}
                  </TableCell>
                  <TableCell>{formatToIDR(month.total_cost)}</TableCell>
                  <TableCell>
                    {formatToIDR(month.employees.salary_cost)}
                  </TableCell>
                  <TableCell>
                    {formatToIDR(month.expenses.expenses_cost)}
                  </TableCell>
                  <TableCell>{month.employees.employee_count}</TableCell>
                  <TableCell>{month.expenses.expenses_count}</TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Employee Details */}
      {reportData?.monthly_breakdown &&
        reportData.monthly_breakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Details for {selectedYear}
              </CardTitle>
              <CardDescription>
                Detailed information about employees and their salaries for the
                selected month.
              </CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Month
                  </label>
                  <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedMonthData?.employees?.employee_data &&
              selectedMonthData.employees.employee_data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Start Working At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedMonthData.employees.employee_data.map(
                      (employee, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {employee.id}
                          </TableCell>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{formatToIDR(employee.salary)}</TableCell>
                          <TableCell>
                            {new Date(employee.created_at).toLocaleDateString(
                              'id-ID'
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No employee data available for the selected month
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* Expenses Details */}
      {reportData?.monthly_breakdown &&
        reportData.monthly_breakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Expenses Details for {selectedYear}
              </CardTitle>
              <CardDescription>
                Detailed information about operational expenses for the selected
                month.
              </CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Month
                  </label>
                  <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedMonthData?.expenses?.expenses_data &&
              selectedMonthData.expenses.expenses_data.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Expense Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Expense Date</TableHead>
                      <TableHead>Created By (Employee ID)</TableHead>
                      <TableHead>Recorded At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedMonthData.expenses.expenses_data.map(
                      (expense, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {expense.id}
                          </TableCell>
                          <TableCell>{expense.expense_name}</TableCell>
                          <TableCell>
                            {formatToIDR(expense.expense_amount)}
                          </TableCell>
                          <TableCell>
                            {new Date(expense.expense_date).toLocaleDateString(
                              'id-ID'
                            )}
                          </TableCell>
                          <TableCell>{expense.created_by}</TableCell>
                          <TableCell>
                            {new Date(expense.created_at).toLocaleDateString(
                              'id-ID'
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No expense data available for the selected month
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        Report for year: {selectedYear}
      </div>
    </div>
  );
}
