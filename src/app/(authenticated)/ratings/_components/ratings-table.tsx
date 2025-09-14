'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  User,
  MapPin,
  Clock,
  DollarSign,
  Package,
  Car,
} from 'lucide-react';
import { Rating } from '@/interfaces/rating.interface';

interface Meta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface RatingsTableProps {
  ratings: Rating[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function RatingsTable({
  ratings,
  meta,
  loading,
  onPageChange,
}: RatingsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 shadow-sm';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-full mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded w-full mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No ratings found.
                </TableCell>
              </TableRow>
            ) : (
              ratings.map((rating) => (
                <React.Fragment key={rating.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(rating.id)}
                        className="cursor-pointer"
                      >
                        {expandedRows.has(rating.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      #{rating.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-mono text-sm">
                          #{rating.customer_id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getRatingStars(rating.service_rate)}
                        <span className="ml-1 text-sm font-medium">
                          {rating.service_rate}/5
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-[300px] truncate"
                        title={rating.description}
                      >
                        {rating.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                          {formatDate(rating.created_at)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(rating.id) && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-muted/30">
                        <Card className="border-0 shadow-none">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Star className="h-5 w-5 text-yellow-500" />
                                  Rating Details
                                </h4>
                                <div className="space-y-3 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      Rating ID:
                                    </span>{' '}
                                    <span className="font-mono">
                                      #{rating.id}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Customer ID:
                                    </span>{' '}
                                    <span className="font-mono">
                                      #{rating.customer_id}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Service Rating:
                                    </span>{' '}
                                    <div className="flex items-center gap-1 mt-1">
                                      {getRatingStars(rating.service_rate)}
                                      <span className="ml-2 font-semibold">
                                        {rating.service_rate}/5
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Description:
                                    </span>
                                    <p className="mt-1 text-muted-foreground bg-muted/50 p-2 rounded">
                                      {rating.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span>
                                      Created:{' '}
                                      {formatDateTime(rating.created_at)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span>
                                      Updated:{' '}
                                      {formatDateTime(rating.updated_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Package className="h-5 w-5 text-green-500" />
                                  Booking Details
                                </h4>
                                <div className="space-y-3 text-sm">
                                  {rating.booking ? (
                                    <>
                                      <div>
                                        <span className="font-medium">
                                          Booking ID:
                                        </span>{' '}
                                        <span className="font-mono">
                                          #{rating.booking.id}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Package ID:
                                        </span>{' '}
                                        <span className="font-mono">
                                          #{rating.booking.package_id}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Car ID:
                                        </span>{' '}
                                        <span className="font-mono">
                                          {rating.booking.car_id
                                            ? `#${rating.booking.car_id}`
                                            : 'N/A'}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Customer ID:
                                        </span>{' '}
                                        <span className="font-mono">
                                          #{rating.booking.customer_id}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Employee ID:
                                        </span>{' '}
                                        <span className="font-mono">
                                          #{rating.booking.employee_id}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          With Driver:
                                        </span>{' '}
                                        <Badge
                                          variant="outline"
                                          className={
                                            rating.booking.with_driver
                                              ? 'bg-green-100 text-green-800 border-green-300'
                                              : 'bg-gray-100 text-gray-800 border-gray-300'
                                          }
                                        >
                                          {rating.booking.with_driver
                                            ? 'Yes'
                                            : 'No'}
                                        </Badge>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Number of Persons:
                                        </span>{' '}
                                        <span className="font-semibold">
                                          {rating.booking.number_of_persons}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Total Price:
                                        </span>{' '}
                                        <div className="flex items-center gap-1 mt-1">
                                          <DollarSign className="h-4 w-4 text-green-600" />
                                          <span className="font-semibold text-green-600">
                                            {formatPrice(
                                              rating.booking.total_price
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Status:
                                        </span>{' '}
                                        <Badge
                                          variant="outline"
                                          className={getStatusBadgeClass(
                                            rating.booking.status
                                          )}
                                        >
                                          {rating.booking.status}
                                        </Badge>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Pickup Location:
                                        </span>
                                        <div className="flex items-center gap-1 mt-1">
                                          <MapPin className="h-4 w-4 text-blue-600" />
                                          <span>
                                            {rating.booking.pickup_location}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Pickup Time:
                                        </span>{' '}
                                        <span>
                                          {rating.booking.pickup_time}
                                        </span>
                                      </div>
                                      {rating.booking.additional_notes && (
                                        <div>
                                          <span className="font-medium">
                                            Additional Notes:
                                          </span>
                                          <p className="mt-1 text-muted-foreground bg-muted/50 p-2 rounded">
                                            {rating.booking.additional_notes}
                                          </p>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        <span>
                                          Start Date:{' '}
                                          {formatDate(
                                            rating.booking.start_date
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        <span>
                                          End Date:{' '}
                                          {formatDate(rating.booking.end_date)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                        <span>
                                          Created:{' '}
                                          {formatDateTime(
                                            rating.booking.created_at
                                          )}
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-muted-foreground">
                                      Booking information not available
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(meta.currentPage - 1) * meta.limit + 1} to{' '}
            {Math.min(meta.currentPage * meta.limit, meta.totalItems)} of{' '}
            {meta.totalItems} results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    meta.hasPrevPage && onPageChange(meta.currentPage - 1)
                  }
                  className={
                    !meta.hasPrevPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {[...Array(meta.totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === meta.currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    meta.hasNextPage && onPageChange(meta.currentPage + 1)
                  }
                  className={
                    !meta.hasNextPage
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
