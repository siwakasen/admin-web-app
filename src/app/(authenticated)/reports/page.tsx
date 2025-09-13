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
  useGetYearBookingComparisonReport,
  useGetYearExpensesComparisonReport,
  useGetYearsProfitLossComparisonReport,
} from '@/hooks/report.hook';
import { getToken } from '@/lib/user-provider/cookies';
import {
  YearBookingComparisonReportResponse,
  YearExpensesComparisonReportResponse,
  YearsProfitLossComparisonReportResponse,
} from '@/interfaces/report.interface';
import { X, Printer } from 'lucide-react';
import {
  BookingRevenueSection,
  ExpensesSection,
  ProfitLossSection,
} from './_components';

export default function ReportsPage() {
  const [startYear, setStartYear] = useState<number>(
    new Date().getFullYear() - 4
  );
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [bookingReportData, setBookingReportData] =
    useState<YearBookingComparisonReportResponse | null>(null);
  const [expensesReportData, setExpensesReportData] =
    useState<YearExpensesComparisonReportResponse | null>(null);
  const [profitLossReportData, setProfitLossReportData] =
    useState<YearsProfitLossComparisonReportResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

  // Fetch report data when year range changes
  useEffect(() => {
    if (token && startYear && endYear && startYear <= endYear) {
      fetchReportData();
    }
  }, [token, startYear, endYear]);

  const fetchReportData = async () => {
    if (!token) return;

    setError('');
    setLoading(true);
    try {
      // Fetch booking data
      const bookingData = await useGetYearBookingComparisonReport({
        start_year: startYear,
        end_year: endYear,
      });
      if ('yearly_breakdown' in bookingData) {
        setBookingReportData(bookingData);
      }

      // Fetch expenses data
      const expensesData = await useGetYearExpensesComparisonReport({
        start_year: startYear,
        end_year: endYear,
      });
      if ('yearly_breakdown' in expensesData) {
        setExpensesReportData(expensesData);
      }

      // Fetch profit/loss data
      const profitLossData = await useGetYearsProfitLossComparisonReport({
        start_year: startYear,
        end_year: endYear,
      });
      if ('yearly_breakdown' in profitLossData) {
        setProfitLossReportData(profitLossData);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to fetch report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    const currentYear = new Date().getFullYear();
    setStartYear(currentYear - 4);
    setEndYear(currentYear);
  };

  const handlePrintReport = () => {
    window.print();
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
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Year Comparison Report
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive financial analysis across multiple years
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

      {/* Year Range Selection */}
      <div className="flex flex-col gap-4 pl-2">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Start Year
            </label>
            <Input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value) || 0)}
              className="w-32"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              End Year
            </label>
            <Input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(parseInt(e.target.value) || 0)}
              className="w-32"
              max={new Date().getFullYear()}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleResetFilters} variant="outline">
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* BOOKING REVENUE SECTION */}
      <BookingRevenueSection
        bookingReportData={bookingReportData}
        startYear={startYear}
        endYear={endYear}
      />

      {/* EXPENSES SECTION */}
      <ExpensesSection
        expensesReportData={expensesReportData}
        startYear={startYear}
        endYear={endYear}
      />

      {/* PROFIT/LOSS SECTION */}
      <ProfitLossSection
        profitLossReportData={profitLossReportData}
        startYear={startYear}
        endYear={endYear}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading report data...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        Report for years: {startYear} - {endYear}
      </div>
    </div>
  );
}
