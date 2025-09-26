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
import { useGetBookingMonthlyRevenue } from '@/hooks/report.hook';
import { getToken } from '@/lib/user-provider/cookies';
import {
  BookingMonthlyReportResponse,
  BookingMonthlyReportRequest,
} from '@/interfaces/report.interface';
import {
  TrendingUp,
  Undo2,
  DollarSign,
  Calendar,
  X,
  Printer,
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

const formatToUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BookingMonthlyRevenuePage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [reportData, setReportData] =
    useState<BookingMonthlyReportResponse | null>(null);
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
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 2)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
        .toISOString()
        .split('T')[0];
      const data = await useGetBookingMonthlyRevenue({
        start_date: startDate,
        end_date: endDate,
      });
      if ('gross_revenue' in data) {
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
    gross_revenue: 0,
    refund_cost: 0,
    payment_gateway_cost: 0,
    net_revenue: 0,
    booking_count: 0,
    bookings_data: [],
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
            Monthly Revenue Report
          </h1>
          <p className="text-gray-600 mt-1">
            An overview of monthly revenue, refunds, and booking statistics.
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
                <p className="text-sm font-medium text-gray-600">
                  Gross Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.gross_revenue)}
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(totals.net_revenue)}
                </p>
              </div>
              <span className="h-8 w-8 text-2xl text-blue-600">IDR</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Details */}
      {reportData?.bookings_data && reportData.bookings_data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Details
            </CardTitle>
            <CardDescription>
              Detailed information about bookings for the selected date range.
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
                {reportData.bookings_data.map((booking, index: number) => (
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
        Report for month: {selectedMonth}
      </div>
    </div>
  );
}
