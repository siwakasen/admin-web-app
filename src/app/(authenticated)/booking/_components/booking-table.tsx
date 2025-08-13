'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  User,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  MapPin,
  Clock,
  Car as CarIcon,
  Palmtree,
  CheckCircle,
  XCircle,
  Users,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Booking, BookingStatus } from '@/interfaces/booking.interface';
import { Meta } from '@/interfaces/common.interface';
import { TravelPackages } from '@/interfaces/travel.interface';
import { Car } from '@/interfaces/car.interfaces';
import { useFinishBooking } from '@/hooks/booking.hook';
import { toast } from 'sonner';

interface BookingTableProps {
  bookings: Booking[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  travelPackages: TravelPackages[];
  cars: Car[];
  servicesLoading: boolean;
}

export function BookingTable({
  bookings,
  meta,
  loading,
  onPageChange,
  onRefetch,
  statusFilter,
  onStatusFilterChange,
  travelPackages,
  cars,
  servicesLoading,
}: BookingTableProps) {
  const router = useRouter();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [bookingToFinish, setBookingToFinish] = useState<Booking | null>(null);
  const [finishStatus, setFinishStatus] = useState<
    BookingStatus.COMPLETED | BookingStatus.NO_SHOW
  >(BookingStatus.COMPLETED);
  // Helper function to get service name by ID
  const getServiceName = (packageId?: number, carId?: number) => {
    if (packageId) {
      const travelPackage = travelPackages.find((pkg) => pkg.id === packageId);
      return travelPackage
        ? travelPackage.package_name
        : `Package #${packageId}`;
    }
    if (carId) {
      const car = cars.find((c) => c.id === carId);
      return car ? car.car_name : `Car #${carId}`;
    }
    return 'No service';
  };

  // Helper function to get service icon and color
  const getServiceIcon = (packageId?: number, carId?: number) => {
    if (packageId) {
      return { icon: Palmtree, color: 'text-green-600' };
    }
    if (carId) {
      return { icon: CarIcon, color: 'text-blue-600' };
    }
    return { icon: Palmtree, color: 'text-gray-600' };
  };

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleFinishClick = (booking: Booking) => {
    setBookingToFinish(booking);
    setFinishDialogOpen(true);
  };

  const handleConfirmClick = (booking: Booking) => {
    router.push(`/booking/confirmation/${booking.id}`);
  };

  const handleViewDetails = (id: number) => {
    router.push(`/booking/details/${id}`);
  };

  const handleFinishConfirm = async () => {
    if (!bookingToFinish) return;

    try {
      const response = await useFinishBooking(bookingToFinish.id, finishStatus);
      if ('errors' in response) {
        toast.error(response.errors.message || 'Failed to finish booking');
      } else if ('message' in response) {
        toast.success(response.message || 'Booking finished successfully!');
        onRefetch();
      }
    } catch (error) {
      console.error('Error finishing booking:', error);
      toast.error('Failed to finish booking. Please try again.');
    } finally {
      setFinishDialogOpen(false);
      setBookingToFinish(null);
      setFinishStatus(BookingStatus.COMPLETED);
    }
  };

  const handleFinishCancel = () => {
    setFinishDialogOpen(false);
    setBookingToFinish(null);
    setFinishStatus(BookingStatus.COMPLETED);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatTime = (timeString: string) => {
    // 13:04:00
    // Remove the seconds from the time string (e.g., "13:04:00" -> "13:04")
    return timeString.slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case BookingStatus.ONGOING:
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case BookingStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      case BookingStatus.WAITING_PAYMENT:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case BookingStatus.WAITING_CONFIRMATION:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case BookingStatus.NO_SHOW:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case BookingStatus.PAYMENT_FAILED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      {/* Status Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by Status:</label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(BookingStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Pickup Time</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(booking.id)}
                        className="cursor-pointer"
                      >
                        {expandedRows.has(booking.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      #{booking.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {servicesLoading ? (
                          <span className="text-sm text-muted-foreground">
                            Loading...
                          </span>
                        ) : (
                          <>
                            {(() => {
                              const { icon: Icon, color } = getServiceIcon(
                                booking.package_id,
                                booking.car_id,
                              );
                              const serviceName = getServiceName(
                                booking.package_id,
                                booking.car_id,
                              );
                              return (
                                <>
                                  <Icon className={`h-4 w-4 ${color}`} />
                                  <span className="text-sm">{serviceName}</span>
                                </>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <div className="text-sm">
                          <div>{formatDate(booking.start_date)}</div>
                          <div className="text-muted-foreground">
                            to {formatDate(booking.end_date)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatTime(booking.pickup_time)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatPrice(booking.total_price)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeClass(booking.status)}
                      >
                        {booking.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right w-[120px]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(booking.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          {booking.status ===
                            BookingStatus.WAITING_CONFIRMATION && (
                            <DropdownMenuItem
                              className="text-green-600 focus:text-green-600"
                              onClick={() => handleConfirmClick(booking)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm Booking
                            </DropdownMenuItem>
                          )}
                          {booking.status === BookingStatus.ONGOING && (
                            <DropdownMenuItem
                              className="text-green-600 focus:text-green-600"
                              onClick={() => handleFinishClick(booking)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Finish Booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(booking.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/30">
                        <Card className="border-0 shadow-none">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Pickup Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-600" />
                                    <span>{booking.pickup_location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span>{booking.pickup_time}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Booking Info
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      With Driver:
                                    </span>{' '}
                                    {booking.with_driver ? 'Yes' : 'No'}
                                  </div>
                                  {booking.number_of_persons && (
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-green-600" />
                                      <span>
                                        {booking.number_of_persons} persons
                                      </span>
                                    </div>
                                  )}
                                  {booking.employee_id && (
                                    <div>
                                      <span className="font-medium">
                                        Employee:
                                      </span>{' '}
                                      #{booking.employee_id}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Additional Notes
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {booking.additional_notes ||
                                    'No additional notes'}
                                </p>
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

      {/* Finish Booking Dialog */}
      <Dialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finish Booking</DialogTitle>
            <DialogDescription>
              How would you like to finish booking #{bookingToFinish?.id}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select finish status:
              </label>
              <Select
                value={finishStatus}
                onValueChange={(value) =>
                  setFinishStatus(
                    value as BookingStatus.COMPLETED | BookingStatus.NO_SHOW,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BookingStatus.COMPLETED}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Completed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={BookingStatus.NO_SHOW}>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>No Show</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleFinishCancel}>
              Cancel
            </Button>
            <Button onClick={handleFinishConfirm}>Finish Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
