'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { ProfitLossChart } from './profitloss-comparison-chart';
import { YearsProfitLossComparisonReportResponse } from '@/interfaces/report.interface';

// Utility function to format currency
const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface ProfitLossSectionProps {
  profitLossReportData: YearsProfitLossComparisonReportResponse | null;
  startYear: number;
  endYear: number;
}

export function ProfitLossSection({
  profitLossReportData,
  startYear,
  endYear,
}: ProfitLossSectionProps) {
  // Calculate profit/loss totals from report data
  const profitLossTotals = profitLossReportData?.yearly_breakdown?.reduce(
    (acc, year) => ({
      gross_revenue: acc.gross_revenue + year.revenue.gross_revenue,
      refund_cost: acc.refund_cost + year.revenue.refund_cost,
      payment_gateway_cost:
        acc.payment_gateway_cost + year.revenue.payment_gateway_cost,
      net_revenue: acc.net_revenue + year.revenue.net_revenue,
      salary_cost: acc.salary_cost + year.costs.salary_cost,
      expenses_cost: acc.expenses_cost + year.costs.expenses_cost,
      total_cost: acc.total_cost + year.costs.total_cost,
      profit_loss: acc.profit_loss + year.profit_loss,
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

  // Prepare profit/loss chart data
  const profitLossChartData =
    profitLossReportData?.yearly_breakdown?.map((year) => ({
      year: year.year.toString(),
      profit_loss: year.profit_loss,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-green-500 pl-4">
        <h2 className="text-2xl font-bold text-gray-900">Profit/Loss</h2>
        <p className="text-gray-600">
          Financial performance and profitability analysis
        </p>
      </div>

      {/* Profit/Loss Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(profitLossTotals.net_revenue)}
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
                  {formatToIDR(profitLossTotals.total_cost)}
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
                    profitLossTotals.profit_loss >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatToIDR(profitLossTotals.profit_loss)}
                </p>
                <p className="text-xs text-gray-500">
                  {profitLossTotals.profit_loss >= 0 ? 'Profit' : 'Loss'}
                </p>
              </div>
              {profitLossTotals.profit_loss >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Profit Margin
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {profitLossTotals.net_revenue > 0
                    ? `${(
                        (profitLossTotals.profit_loss /
                          profitLossTotals.net_revenue) *
                        100
                      ).toFixed(1)}%`
                    : '0%'}
                </p>
                <p className="text-xs text-gray-500">vs Net Revenue</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit/Loss Year Comparison Chart */}
      {profitLossChartData.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Profit/Loss Yearly Comparison Chart
            </CardTitle>
            <CardDescription>
              Profit/Loss comparison across selected years ({startYear} -{' '}
              {endYear})
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full px-6 pb-6">
              <ProfitLossChart data={profitLossChartData} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profit/Loss Yearly Breakdown Table */}
      {profitLossReportData?.yearly_breakdown &&
        profitLossReportData.yearly_breakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Yearly Profit/Loss Breakdown
              </CardTitle>
              <CardDescription>
                Detailed profit/loss breakdown for each year in the selected
                range.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Year</th>
                      <th className="text-right p-3 font-medium">
                        Net Revenue
                      </th>
                      <th className="text-right p-3 font-medium">Total Cost</th>
                      <th className="text-right p-3 font-medium">
                        Profit/Loss
                      </th>
                      <th className="text-right p-3 font-medium">Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitLossReportData.yearly_breakdown.map(
                      (year, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{year.year}</td>
                          <td className="p-3 text-right">
                            {formatToIDR(year.revenue.net_revenue)}
                          </td>
                          <td className="p-3 text-right">
                            {formatToIDR(year.costs.total_cost)}
                          </td>
                          <td
                            className={`p-3 text-right font-medium ${
                              year.profit_loss >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {formatToIDR(year.profit_loss)}
                          </td>
                          <td
                            className={`p-3 text-right font-medium ${
                              year.profit_loss >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {year.revenue.net_revenue > 0
                              ? `${(
                                  (year.profit_loss /
                                    year.revenue.net_revenue) *
                                  100
                                ).toFixed(1)}%`
                              : '0%'}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
