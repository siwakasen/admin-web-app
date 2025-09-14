'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/shared/navbar/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { RatingsTable } from './_components/ratings-table';
import { useGetRating } from '@/hooks/rating.hook';
import { RatingResponse } from '@/interfaces/rating.interface';

export default function RatingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ratings, setRatings] = useState<RatingResponse['data']>([]);
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

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [refetch, setRefetch] = useState(false);

  // Update URL when params change
  const updateURL = (page: number) => {
    const params = new URLSearchParams();

    if (page > 1) params.set('page', page.toString());

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.push(`/ratings${newURL}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await useGetRating({
        limit: 10,
        page: currentPage,
        search: '',
      });
      console.log(response);
      if ('data' in response) {
        setRatings(response.data);
        // Since the rating API doesn't return meta, we'll create a simple pagination
        setMeta({
          totalItems: response.data.length,
          currentPage: currentPage,
          totalPages: Math.ceil(response.data.length / 10),
          limit: 10,
          hasNextPage: response.data.length === 10,
          hasPrevPage: currentPage > 1,
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [currentPage, refetch]);

  // Sync state with URL params when component mounts or URL changes
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    setCurrentPage(page);
  }, [searchParams]);

  return (
    <section>
      <HeaderNavigation />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex gap-2 justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">Ratings</CardTitle>
                <p className="text-muted-foreground">
                  View and manage customer ratings and reviews
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RatingsTable
              ratings={ratings}
              meta={meta}
              loading={loading}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
