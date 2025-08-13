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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BookingAdjustmentWithBooking,
  AdjustmentStatus,
  RequestType,
} from '@/interfaces/booking-adjustments.interface';
import { Meta } from '@/interfaces/common.interface';
import { useApprovementCancellation } from '@/hooks/booking-adjustments.hook';
import { toast } from 'sonner';

interface BookingAdjustmentTableProps {
  adjustments: BookingAdjustmentWithBooking[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function BookingAdjustmentTable({
  adjustments,
  meta,
  loading,
  onPageChange,
  onRefetch,
  statusFilter,
  onStatusFilterChange,
}: BookingAdjustmentTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [adjustmentToProcess, setAdjustmentToProcess] =
    useState<BookingAdjustmentWithBooking | null>(null);
  const [processing, setProcessing] = useState(false);

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleApproveClick = (adjustment: BookingAdjustmentWithBooking) => {
    setAdjustmentToProcess(adjustment);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (adjustment: BookingAdjustmentWithBooking) => {
    setAdjustmentToProcess(adjustment);
    setRejectDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!adjustmentToProcess) return;

    setProcessing(true);
    try {
      const response = await useApprovementCancellation(
        adjustmentToProcess.id,
        AdjustmentStatus.APPROVED,
      );
      if ('errors' in response) {
        toast.error(response.errors.message || 'Failed to approve adjustment');
      } else if ('message' in response) {
        toast.success(response.message || 'Adjustment approved successfully!');
        onRefetch();
      }
    } catch (error) {
      console.error('Error approving adjustment:', error);
      toast.error('Failed to approve adjustment. Please try again.');
    } finally {
      setProcessing(false);
      setApproveDialogOpen(false);
      setAdjustmentToProcess(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!adjustmentToProcess) return;

    setProcessing(true);
    try {
      const response = await useApprovementCancellation(
        adjustmentToProcess.id,
        AdjustmentStatus.REJECTED,
      );
      if ('errors' in response) {
        toast.error(response.errors.message || 'Failed to reject adjustment');
      } else if ('message' in response) {
        toast.success(response.message || 'Adjustment rejected successfully!');
        onRefetch();
      }
    } catch (error) {
      console.error('Error rejecting adjustment:', error);
      toast.error('Failed to reject adjustment. Please try again.');
    } finally {
      setProcessing(false);
      setRejectDialogOpen(false);
      setAdjustmentToProcess(null);
    }
  };

  const handleCancel = () => {
    setApproveDialogOpen(false);
    setRejectDialogOpen(false);
    setAdjustmentToProcess(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case AdjustmentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case AdjustmentStatus.WAITING_PAYMENT:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case AdjustmentStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case AdjustmentStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case AdjustmentStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRequestTypeIcon = (requestType: string) => {
    switch (requestType) {
      case RequestType.CANCELLATION:
        return { icon: XCircle, color: 'text-red-600' };
      case RequestType.RESCHEDULE:
        return { icon: Calendar, color: 'text-blue-600' };
      default:
        return { icon: FileText, color: 'text-gray-600' };
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
            {Object.values(AdjustmentStatus).map((status) => (
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
              <TableHead>Request Type</TableHead>
              <TableHead>Booking ID</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Additional Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No adjustments found.
                </TableCell>
              </TableRow>
            ) : (
              adjustments.map((adjustment) => (
                <React.Fragment key={adjustment.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(adjustment.id)}
                        className="cursor-pointer"
                      >
                        {expandedRows.has(adjustment.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      #{adjustment.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const { icon: Icon, color } = getRequestTypeIcon(
                            adjustment.request_type,
                          );
                          return (
                            <>
                              <Icon className={`h-4 w-4 ${color}`} />
                              <span className="text-sm">
                                {adjustment.request_type.replace(/_/g, ' ')}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm">
                          #{adjustment.booking?.id || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <div className="text-sm">
                          <div>{formatDate(adjustment.new_start_date)}</div>
                          <div className="text-muted-foreground">
                            to {formatDate(adjustment.new_end_date)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatPrice(adjustment.additional_price)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeClass(adjustment.status)}
                      >
                        {adjustment.status.replace(/_/g, ' ')}
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
                            onClick={() => toggleRowExpansion(adjustment.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          {adjustment.status === AdjustmentStatus.PENDING && (
                            <>
                              <DropdownMenuItem
                                className="text-green-600 focus:text-green-600"
                                onClick={() => handleApproveClick(adjustment)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleRejectClick(adjustment)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(adjustment.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/30">
                        <Card className="border-0 shadow-none">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Request Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      Request Type:
                                    </span>{' '}
                                    {adjustment.request_type.replace(/_/g, ' ')}
                                  </div>
                                  <div>
                                    <span className="font-medium">Reason:</span>{' '}
                                    {adjustment.reason || 'No reason provided'}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span>
                                      Created:{' '}
                                      {formatDate(adjustment.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Date Changes
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      New Start Date:
                                    </span>{' '}
                                    {formatDate(adjustment.new_start_date)}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      New End Date:
                                    </span>{' '}
                                    {formatDate(
                                      adjustment.new_end_date
                                        ? adjustment.new_end_date
                                        : '',
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Additional Price:
                                    </span>{' '}
                                    {formatPrice(adjustment.additional_price)}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Booking Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {adjustment.booking ? (
                                    <>
                                      <div>
                                        <span className="font-medium">
                                          Booking ID:
                                        </span>{' '}
                                        #{adjustment.booking.id}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Customer ID:
                                        </span>{' '}
                                        #{adjustment.booking.customer_id}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Service:
                                        </span>{' '}
                                        {adjustment.booking.package_id
                                          ? 'Travel Package'
                                          : 'Car Rental'}
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

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Adjustment Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve adjustment request #
              {adjustmentToProcess?.id}? This will approve the{' '}
              {adjustmentToProcess?.request_type?.toLowerCase()} request.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleApproveConfirm}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Approving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Adjustment Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject adjustment request #
              {adjustmentToProcess?.id}? This will reject the{' '}
              {adjustmentToProcess?.request_type?.toLowerCase()} request.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={processing}
              variant="destructive"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Rejecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Reject
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
