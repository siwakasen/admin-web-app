'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { DollarSign, Users, Receipt } from 'lucide-react';
import { ExpensesChartBarStacked } from './expenses-comparison-chart';
import { YearExpensesComparisonReportResponse } from '@/interfaces/report.interface';

// Utility function to format currency
const formatToIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface ExpensesSectionProps {
  expensesReportData: YearExpensesComparisonReportResponse | null;
  startYear: number;
  endYear: number;
}

export function ExpensesSection({
  expensesReportData,
  startYear,
  endYear,
}: ExpensesSectionProps) {
  // Calculate expenses totals from report data
  const expensesTotals = expensesReportData?.yearly_breakdown?.reduce(
    (acc, year) => ({
      total_cost: acc.total_cost + year.total_cost,
      salary_cost: acc.salary_cost + year.salary_cost,
      expenses_cost: acc.expenses_cost + year.expenses_cost,
    }),
    {
      total_cost: 0,
      salary_cost: 0,
      expenses_cost: 0,
    }
  ) || {
    total_cost: 0,
    salary_cost: 0,
    expenses_cost: 0,
  };

  // Prepare expenses chart data
  const expensesChartData =
    expensesReportData?.yearly_breakdown?.map((year) => ({
      year: year.year.toString(),
      salary_cost: year.salary_cost,
      expenses_cost: year.expenses_cost,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-red-500 pl-4">
        <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
        <p className="text-gray-600">Cost analysis and expense breakdown</p>
      </div>

      {/* Expenses Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Expenses Cost
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(expensesTotals.total_cost)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Salary Cost
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(expensesTotals.salary_cost)}
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
                  Total Operational Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatToIDR(expensesTotals.expenses_cost)}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Year Comparison Chart */}
      {expensesChartData.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Expenses Yearly Comparison Chart
            </CardTitle>
            <CardDescription>
              Expenses comparison across selected years ({startYear} - {endYear}
              )
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full px-6 pb-6">
              <ExpensesChartBarStacked data={expensesChartData} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses Yearly Breakdown Table */}
      {expensesReportData?.yearly_breakdown &&
        expensesReportData.yearly_breakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Yearly Expenses Breakdown
              </CardTitle>
              <CardDescription>
                Detailed expenses breakdown for each year in the selected range.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Year</th>
                      <th className="text-right p-3 font-medium">Total Cost</th>
                      <th className="text-right p-3 font-medium">
                        Salary Cost
                      </th>
                      <th className="text-right p-3 font-medium">
                        Expenses Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expensesReportData.yearly_breakdown.map((year, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{year.year}</td>
                        <td className="p-3 text-right font-medium">
                          {formatToIDR(year.total_cost)}
                        </td>
                        <td className="p-3 text-right">
                          {formatToIDR(year.salary_cost)}
                        </td>
                        <td className="p-3 text-right">
                          {formatToIDR(year.expenses_cost)}
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
