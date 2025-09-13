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
import { useGetProfitLossReport } from '@/hooks/report.hook';
import { getToken } from '@/lib/user-provider/cookies';
import { ProfitLossReportResponse } from '@/interfaces/report.interface';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  X,
  Printer,
  BarChart3,
  Receipt,
  Users,
} from 'lucide-react';
import { ProfitLossChart } from './_components/profit-loss-chart';

// Utility function to format currency
const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProfitLossYearlyPage() {
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [reportData, setReportData] = useState<ProfitLossReportResponse | null>(
    null
  );
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [yearOptions, setYearOptions] = useState<string[]>(
    (() => {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
    })()
  );

  const chartData =
    reportData?.monthly_breakdown?.map((month) => ({
      month: month.monthName,
      profit_loss: month.profit_loss,
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
      const data = await useGetProfitLossReport({
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

  // Calculate totals from report data
  const totals = reportData?.monthly_breakdown?.reduce(
    (acc, month) => ({
      gross_revenue: acc.gross_revenue + month.revenue.gross_revenue,
      refund_cost: acc.refund_cost + month.revenue.refund_cost,
      payment_gateway_cost:
        acc.payment_gateway_cost + month.revenue.payment_gateway_cost,
      net_revenue: acc.net_revenue + month.revenue.net_revenue,
      salary_cost: acc.salary_cost + month.costs.salary_cost,
      expenses_cost: acc.expenses_cost + month.costs.expenses_cost,
      total_cost: acc.total_cost + month.costs.total_cost,
      profit_loss: acc.profit_loss + month.profit_loss,
    }),
    {
      gross_revenue: 0,
      refund_cost: 0,
      payment_gateway_cost: 0,
      net_revenue: 0,
      salary_cost: 0,
      expenses_cost: 0,
      total_cost: 0,
      profit_loss: 0,
    }
  ) || {
    gross_revenue: 0,
    refund_cost: 0,
    payment_gateway_cost: 0,
    net_revenue: 0,
    salary_cost: 0,
    expenses_cost: 0,
    total_cost: 0,
    profit_loss: 0,
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
            Profit/Loss Report
          </h1>
          <p className="text-gray-600 mt-1">
            An overview of yearly profit/loss analysis including revenue and
            costs breakdown.
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

      <ProfitLossChart chartData={chartData} />

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
                <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.net_revenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.total_cost)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profit/Loss</p>
                <p
                  className={`text-2xl font-bold ${
                    totals.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatToIDR(totals.profit_loss)}
                </p>
                <p className="text-xs text-gray-500">
                  {totals.profit_loss >= 0 ? 'Profit' : 'Loss'}
                </p>
              </div>
              {totals.profit_loss >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Revenue Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Gross Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatToIDR(totals.gross_revenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Refund Cost
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatToIDR(totals.refund_cost)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Payment Gateway Cost
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatToIDR(totals.payment_gateway_cost)}
                  </p>
                </div>
                <Receipt className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Costs Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Costs Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Salary Cost
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatToIDR(totals.salary_cost)}
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
                    Operational Expenses
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatToIDR(totals.expenses_cost)}
                  </p>
                </div>
                <Receipt className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Profit/Loss Breakdown for {selectedYear}
          </CardTitle>
          <CardDescription>
            A detailed breakdown of profit/loss for each month in the selected
            year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MONTH</TableHead>
                <TableHead>GROSS REVENUE</TableHead>
                <TableHead>NET REVENUE</TableHead>
                <TableHead>TOTAL COST</TableHead>
                <TableHead>PROFIT/LOSS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData?.monthly_breakdown?.map((month, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {month.monthName}
                  </TableCell>
                  <TableCell>
                    {formatToIDR(month.revenue.gross_revenue)}
                  </TableCell>
                  <TableCell>
                    {formatToIDR(month.revenue.net_revenue)}
                  </TableCell>
                  <TableCell>{formatToIDR(month.costs.total_cost)}</TableCell>
                  <TableCell
                    className={`font-medium ${
                      month.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatToIDR(month.profit_loss)}
                  </TableCell>
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

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        Report for year: {selectedYear}
      </div>
    </div>
  );
}
