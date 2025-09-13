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
import { useGetBookingYearlyReport } from '@/hooks/report.hook';
import { getToken } from '@/lib/user-provider/cookies';
import { BookingYearlyReportResponse } from '@/interfaces/report.interface';
import {
  TrendingUp,
  Undo2,
  DollarSign,
  Calendar,
  X,
  Printer,
} from 'lucide-react';
import { YearlyChart } from './_components/yearly-chart';

// Utility function to format currency
const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatToUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BookingYearlyRevenuePage() {
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [reportData, setReportData] =
    useState<BookingYearlyReportResponse | null>(null);
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
      month: month.month_name,
      gross_revenue: month.gross_revenue,
      net_revenue: month.net_revenue,
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
      const data = await useGetBookingYearlyReport({
        year: parseInt(selectedYear),
      });
      if ('data' in data) {
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
  const totals = reportData?.totals || {
    gross_revenue: 0,
    refund_cost: 0,
    payment_gateway_cost: 0,
    net_revenue: 0,
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
            Yearly Revenue Report
          </h1>
          <p className="text-gray-600 mt-1">
            An overview of yearly revenue, refunds, and booking statistics.
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

      <YearlyChart chartData={chartData} />
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
                <p className="text-sm font-medium text-gray-600">
                  Gross Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.gross_revenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refund Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.refund_cost)}
                </p>
              </div>
              <Undo2 className="h-8 w-8 text-red-600" />
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
              <span className="h-8 w-8 text-2xl text-orange-600">IDR</span>
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
            A summary of financial activity for each month in the selected year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MONTH</TableHead>
                <TableHead>GROSS REVENUE</TableHead>
                <TableHead>REFUND COST</TableHead>
                <TableHead>PAYMENT GATEWAY COST</TableHead>
                <TableHead>NET REVENUE</TableHead>
                <TableHead>BOOKING COUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData?.monthly_breakdown?.map((month, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {month.month_name}
                  </TableCell>
                  <TableCell>{formatToIDR(month.gross_revenue)}</TableCell>
                  <TableCell>{formatToIDR(month.refund_cost)}</TableCell>
                  <TableCell>
                    {formatToIDR(month.payment_gateway_cost)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatToIDR(month.net_revenue)}
                  </TableCell>

                  <TableCell>{month.booking_count}</TableCell>
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

      {/* Booking Details */}
      {reportData?.data && reportData.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Details
            </CardTitle>
            <CardDescription>
              Detailed information about bookings for the selected year.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>PACKAGE ID</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>TOTAL PRICE</TableHead>
                  <TableHead>START DATE</TableHead>
                  <TableHead>END DATE</TableHead>
                  <TableHead>PAYMENT METHOD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.data.map((booking, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.package_id}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatToUSD(booking.total_price)}</TableCell>
                    <TableCell>
                      {new Date(booking.start_date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.end_date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>{booking.payments[0].payment_method}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
