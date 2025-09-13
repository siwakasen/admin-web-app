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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetExpensesMonthlyReport } from '@/hooks/report.hook';
import { getToken } from '@/lib/user-provider/cookies';
import { ExpensesMonthlyReportResponse } from '@/interfaces/report.interface';
import {
  TrendingUp,
  Users,
  Receipt,
  Calendar,
  X,
  Printer,
  DollarSign,
} from 'lucide-react';

// Utility function to format currency
const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ExpensesMonthlyPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [reportData, setReportData] =
    useState<ExpensesMonthlyReportResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');

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

  // Fetch report data when month changes
  useEffect(() => {
    if (token && selectedMonth) {
      fetchReportData();
    }
  }, [token, selectedMonth]);

  const fetchReportData = async () => {
    if (!token) return;

    setError('');
    try {
      // Calculate start and end dates from selected month
      const [year, month] = selectedMonth.split('-');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(parseInt(year), parseInt(month), 0)
        .toISOString()
        .split('T')[0];

      const data = await useGetExpensesMonthlyReport({
        start_date: startDate,
        end_date: endDate,
      });
      if ('total_cost' in data) {
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to fetch report data. Please try again.');
    } finally {
    }
  };

  const handleResetFilters = () => {
    setSelectedMonth(new Date().toISOString().slice(0, 7));
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Calculate totals from report data
  const totals = reportData || {
    total_cost: 0,
    employees: {
      salary_cost: 0,
      employee_data: [],
      employee_count: 0,
    },
    expenses: {
      expenses_cost: 0,
      expenses_data: [],
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
            Monthly Expenses Report
          </h1>
          <p className="text-gray-600 mt-1">
            An overview of monthly expenses including salary costs and
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

      <div className="flex flex-col gap-4 pl-2">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Select Month
            </label>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleResetFilters} variant="outline">
              Reset
            </Button>
          </div>
        </div>
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

      {/* Employee Details */}
      {reportData?.employees?.employee_data &&
        reportData.employees.employee_data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Details
              </CardTitle>
              <CardDescription>
                Detailed information about employee salaries for the selected
                month.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  {reportData.employees.employee_data.map(
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
            </CardContent>
          </Card>
        )}

      {/* Expenses Details */}
      {reportData?.expenses?.expenses_data &&
        reportData.expenses.expenses_data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Expenses Details
              </CardTitle>
              <CardDescription>
                Detailed information about operational expenses for the selected
                month.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  {reportData.expenses.expenses_data.map(
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
            </CardContent>
          </Card>
        )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        Report for month: {selectedMonth}
      </div>
    </div>
  );
}
