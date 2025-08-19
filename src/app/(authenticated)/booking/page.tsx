'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/shared/navbar/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BookingTable } from './_components/booking-table';
import { useGetAllBookings } from '@/hooks/booking.hook';
import { useGetTravelPackagesHistory, useGetAllCarsHistory } from '@/hooks';
import { Booking } from '@/interfaces/booking.interface';
import { TravelPackages } from '@/interfaces/travel.interface';
import { Car } from '@/interfaces/car.interfaces';
import { ToastApi } from '@/lib/helper/toast-api';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Service data state
  const [travelPackages, setTravelPackages] = useState<TravelPackages[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

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
    router.push(`/booking${newURL}`, { scroll: false });
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

  // Fetch service data (travel packages and cars)
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        // Fetch travel packages history
        const travelResponse = await useGetTravelPackagesHistory({
          limit: 1000, // Get all packages
          page: 1,
        });

        // Fetch cars history
        const carsResponse = await useGetAllCarsHistory({
          limit: 1000, // Get all cars
          page: 1,
        });

        if ('data' in travelResponse) {
          setTravelPackages(travelResponse.data);
        }

        if ('data' in carsResponse) {
          setCars(carsResponse.data);
        }
      } catch (error: any) {
        console.error('Error fetching services:', error.response.data);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await useGetAllBookings({
        limit: 10,
        page: currentPage,
        search: statusFilter === 'all' ? '' : statusFilter,
      });
      ToastApi(response);
      if ('data' in response && 'meta' in response) {
        setBookings(response.data);
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
                <CardTitle className="text-2xl font-bold">Bookings</CardTitle>
                <p className="text-muted-foreground">
                  Manage and view all customer bookings
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BookingTable
              bookings={bookings}
              meta={meta}
              loading={loading}
              onPageChange={handlePageChange}
              onRefetch={() => setRefetch(!refetch)}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              travelPackages={travelPackages}
              cars={cars}
              servicesLoading={servicesLoading}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
