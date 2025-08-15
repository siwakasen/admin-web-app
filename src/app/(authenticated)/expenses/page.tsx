'use client';
import { HeaderNavigation } from '@/components/shared/navbar/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetExpenses } from '@/hooks/expenses.hook';
import { ExpensesTable } from './_components/expenses-table';
import { Expense } from '@/interfaces/expenses.interface';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusSquare, Search } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Meta } from '@/interfaces';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();
  const [meta, setMeta] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 30,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateExpense = () => {
    redirect('/expenses/create');
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    setRefetch(!refetch);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDateRangeChange = (
    newStartDate: string | undefined,
    newEndDate: string | undefined
  ) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleApplyDateFilter = () => {
    setCurrentPage(1); // Reset to first page when applying date filter
    setRefetch(!refetch);
  };

  const handleClearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
    setRefetch(!refetch);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await useGetExpenses({
        limit: 30,
        page: currentPage,
        search: searchQuery,
        start_date: startDate,
        end_date: endDate,
      });
      if (response && 'data' in response) {
        setExpenses(response.data);
        setMeta(response.meta);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentPage, refetch]);

  return (
    <section>
      <HeaderNavigation />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex gap-2 justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">Expenses</CardTitle>
                <p className="text-muted-foreground">
                  Manage and view all expenses
                </p>
              </div>
              <div>
                <Button
                  onClick={handleCreateExpense}
                  className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  variant="default"
                >
                  <PlusSquare className="h-4 w-4" />
                  <span className="hidden md:block">Add New Expense</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pr-10"
                />
                <Button
                  onClick={handleSearch}
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={handleDateRangeChange}
                onApply={handleApplyDateFilter}
                onClear={handleClearDateFilter}
              />
            </div>
            <ExpensesTable
              expenses={expenses}
              meta={meta}
              loading={loading}
              onPageChange={handlePageChange}
              onRefetch={() => setRefetch(!refetch)}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
