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
  DollarSign,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Clock,
  CheckCircle,
  Building2,
  CreditCard,
  Calendar,
  User,
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
import { Refunds, Meta } from '@/interfaces/refunds.interface';
import { useCompleteRefund } from '@/hooks/refunds.hook';
import { toast } from 'sonner';

interface RefundsTableProps {
  refunds: Refunds[];
  meta: Meta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function RefundsTable({
  refunds,
  meta,
  loading,
  onPageChange,
  onRefetch,
  statusFilter,
  onStatusFilterChange,
}: RefundsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [refundToComplete, setRefundToComplete] = useState<Refunds | null>(
    null
  );
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

  const handleCompleteClick = (refund: Refunds) => {
    setRefundToComplete(refund);
    setCompleteDialogOpen(true);
  };

  const handleCompleteConfirm = async () => {
    if (!refundToComplete) return;

    setProcessing(true);
    try {
      const response = await useCompleteRefund(refundToComplete.id);
      if ('errors' in response) {
        toast.error(response.errors.message || 'Failed to complete refund');
      } else if ('message' in response) {
        toast.success(response.message || 'Refund completed successfully!');
        onRefetch();
      }
    } catch (error) {
      console.error('Error completing refund:', error);
      toast.error('Failed to complete refund. Please try again.');
    } finally {
      setProcessing(false);
      setCompleteDialogOpen(false);
      setRefundToComplete(null);
    }
  };

  const handleCancel = () => {
    setCompleteDialogOpen(false);
    setRefundToComplete(null);
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
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
    switch (status.toLowerCase()) {
      case 'waiting_form':
        return 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm';
      case 'processing':
        return 'bg-sky-100 text-sky-800 border-sky-300 shadow-sm';
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm';
      case 'failed':
        return 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 shadow-sm';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank_transfer':
        return { icon: Building2, color: 'text-blue-600' };
      case 'credit_card':
        return { icon: CreditCard, color: 'text-green-600' };
      default:
        return { icon: DollarSign, color: 'text-gray-600' };
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
            <SelectItem value="waiting_form">Waiting Form</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Refund At</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {refunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No refunds found.
                </TableCell>
              </TableRow>
            ) : (
              refunds.map((refund) => (
                <React.Fragment key={refund.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(refund.id)}
                        className="cursor-pointer"
                      >
                        {expandedRows.has(refund.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      #{refund.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatPrice(refund.amount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const { icon: Icon, color } = getMethodIcon(
                            refund.method
                          );
                          return (
                            <>
                              <Icon className={`h-4 w-4 ${color}`} />
                              <span className="text-sm">
                                {refund.method.replace(/_/g, ' ')}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusBadgeClass(refund.status)}
                      >
                        {refund.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                          {formatDate(refund.refund_date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-[200px] truncate"
                        title={refund.reason}
                      >
                        {refund.reason}
                      </div>
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
                            onClick={() => toggleRowExpansion(refund.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>

                          {refund.status.toLowerCase() === 'processing' && (
                            <DropdownMenuItem
                              className="text-green-600 focus:text-green-600"
                              onClick={() => handleCompleteClick(refund)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Complete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(refund.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-muted/30">
                        <Card className="border-0 shadow-none">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Refund Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Amount:</span>{' '}
                                    <span className="font-semibold text-green-600">
                                      {formatPrice(refund.amount)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Method:</span>{' '}
                                    {refund.method.replace(/_/g, ' ')}
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>{' '}
                                    <Badge
                                      variant="outline"
                                      className={getStatusBadgeClass(
                                        refund.status
                                      )}
                                    >
                                      {refund.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span>
                                      Created: {formatDate(refund.created_at)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Payment Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {refund.bank_name && (
                                    <div>
                                      <span className="font-medium">Bank:</span>{' '}
                                      {refund.bank_name}
                                    </div>
                                  )}
                                  {refund.account_number && (
                                    <div>
                                      <span className="font-medium">
                                        Account Number:
                                      </span>{' '}
                                      {refund.account_number}
                                    </div>
                                  )}
                                  {refund.account_name && (
                                    <div>
                                      <span className="font-medium">
                                        Account Name:
                                      </span>{' '}
                                      {refund.account_name}
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-medium">
                                      Refund At:
                                    </span>{' '}
                                    {formatDate(refund.refund_date)}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Booking Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {refund.booking ? (
                                    <>
                                      <div>
                                        <span className="font-medium">
                                          Booking ID:
                                        </span>{' '}
                                        #{refund.booking.id}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Customer ID:
                                        </span>{' '}
                                        #{refund.booking.customer_id}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Service:
                                        </span>{' '}
                                        {refund.booking.package_id
                                          ? 'Travel Package'
                                          : 'Car Rental'}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Total Price:
                                        </span>{' '}
                                        {formatPrice(
                                          refund.booking.total_price.toString()
                                        )}
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

      {/* Complete Refund Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Complete Refund</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this refund as complete? Make sure
              you already transferred the amount to the customer.
            </DialogDescription>
          </DialogHeader>

          {/* Refund Details in Dialog */}
          {refundToComplete && (
            <div className="bg-muted/30 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-3 text-lg">Refund Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Refund ID:</span>
                  <div className="font-mono">#{refundToComplete.id}</div>
                </div>
                <div>
                  <span className="font-medium">Amount:</span>
                  <div className="font-semibold text-green-600">
                    {formatPrice(refundToComplete.amount)}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Method:</span>
                  <div>{refundToComplete.method.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <div>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(refundToComplete.status)}
                    >
                      {refundToComplete.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Reason:</span>
                  <div className="text-muted-foreground">
                    {refundToComplete.reason}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <div>{formatDate(refundToComplete.created_at)}</div>
                </div>
                {refundToComplete.bank_name && (
                  <div>
                    <span className="font-medium">Bank:</span>
                    <div>{refundToComplete.bank_name}</div>
                  </div>
                )}
                {refundToComplete.account_number && (
                  <div>
                    <span className="font-medium">Account:</span>
                    <div className="font-mono">
                      {refundToComplete.account_number}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleCompleteConfirm}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Completing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Mark as Complete
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
