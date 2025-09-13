'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TrendingUp, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { ChartBarStacked } from './booking-comparison-chart';
import { YearBookingComparisonReportResponse } from '@/interfaces/report.interface';

// Utility function to format currency
const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface BookingRevenueSectionProps {
  bookingReportData: YearBookingComparisonReportResponse | null;
  startYear: number;
  endYear: number;
}

export function BookingRevenueSection({
  bookingReportData,
  startYear,
  endYear,
}: BookingRevenueSectionProps) {
  // Calculate booking totals from report data
  const bookingTotals = bookingReportData?.yearly_breakdown?.reduce(
    (acc, year) => ({
      gross_revenue: acc.gross_revenue + year.gross_revenue,
      refund_cost: acc.refund_cost + year.refund_cost,
      payment_gateway_cost:
        acc.payment_gateway_cost + year.payment_gateway_cost,
      net_revenue: acc.net_revenue + year.net_revenue,
    }),
    {
      gross_revenue: 0,
      refund_cost: 0,
      payment_gateway_cost: 0,
      net_revenue: 0,
    }
  ) || {
    gross_revenue: 0,
    refund_cost: 0,
    payment_gateway_cost: 0,
    net_revenue: 0,
  };

  // Prepare booking chart data
  const bookingChartData =
    bookingReportData?.yearly_breakdown?.map((year) => ({
      year: year.year.toString(),
      gross_revenue: year.gross_revenue,
      net_revenue: year.net_revenue,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-blue-500 pl-4">
        <h2 className="text-2xl font-bold text-gray-900">Booking Revenue</h2>
        <p className="text-gray-600">
          Revenue analysis and booking performance
        </p>
      </div>

      {/* Booking Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Gross Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(bookingTotals.gross_revenue)}
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
                  Total Refund Cost
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(bookingTotals.refund_cost)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Payment Gateway Cost
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(bookingTotals.payment_gateway_cost)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Net Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(bookingTotals.net_revenue)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Year Comparison Chart */}
      {bookingChartData.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Booking Yearly Comparison Chart
            </CardTitle>
            <CardDescription>
              Revenue comparison across selected years ({startYear} - {endYear})
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full px-6 pb-6">
              <ChartBarStacked data={bookingChartData} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Yearly Breakdown Table */}
      {bookingReportData?.yearly_breakdown &&
        bookingReportData.yearly_breakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Yearly Booking Breakdown
              </CardTitle>
              <CardDescription>
                Detailed revenue breakdown for each year in the selected range.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Year</th>
                      <th className="text-right p-3 font-medium">
                        Gross Revenue
                      </th>
                      <th className="text-right p-3 font-medium">
                        Refund Cost
                      </th>
                      <th className="text-right p-3 font-medium">
                        Payment Gateway Cost
                      </th>
                      <th className="text-right p-3 font-medium">
                        Net Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingReportData.yearly_breakdown.map((year, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{year.year}</td>
                        <td className="p-3 text-right">
                          {formatToIDR(year.gross_revenue)}
                        </td>
                        <td className="p-3 text-right">
                          {formatToIDR(year.refund_cost)}
                        </td>
                        <td className="p-3 text-right">
                          {formatToIDR(year.payment_gateway_cost)}
                        </td>
                        <td className="p-3 text-right font-medium">
                          {formatToIDR(year.net_revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
