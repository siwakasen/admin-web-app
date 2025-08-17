'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/shared/navbar/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BookingAdjustmentTable } from './_components/adjustment-table';
import { useGetAllBookingAdjustments } from '@/hooks/booking-adjustments.hook';
import {
  BookingAdjustmentWithBooking,
  AdjustmentStatus,
} from '@/interfaces/booking-adjustments.interface';

export default function BookingAdjustmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [adjustments, setAdjustments] = useState<
    BookingAdjustmentWithBooking[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Get initial values from URL params
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialStatus = searchParams.get('status') || 'all';

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [refetch, setRefetch] = useState(false);

  // Update URL when params change
  const updateURL = (page: number, status: string) => {
    const params = new URLSearchParams();

    if (page > 1) params.set('page', page.toString());
    if (status !== 'all') params.set('status', status);

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.push(`/booking-adjustments${newURL}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, statusFilter);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    const newPage = 1; // Reset to first page when changing status
    setCurrentPage(newPage);
    updateURL(newPage, status);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await useGetAllBookingAdjustments({
        limit: 10,
        page: currentPage,
        search: statusFilter === 'all' ? '' : statusFilter,
      });
      if ('data' in response && 'meta' in response) {
        setAdjustments(response.data);
        setMeta(response.meta);
      }
      setLoading(false);
    };
    fetchData();
  }, [currentPage, statusFilter, refetch]);

  // Sync state with URL params when component mounts or URL changes
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status') || 'all';

    setCurrentPage(page);
    setStatusFilter(status);
  }, [searchParams]);

  return (
    <section>
      <HeaderNavigation />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex gap-2 justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Reschedule & Cancellation Booking Adjustments
                </CardTitle>
                <p className="text-muted-foreground">
                  Manage and view all reschedule & cancellation requests
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BookingAdjustmentTable
              adjustments={adjustments}
              meta={meta}
              loading={loading}
              onPageChange={handlePageChange}
              onRefetch={() => setRefetch(!refetch)}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
