'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
} from 'lucide-react';
import { Employee } from '@/interfaces';
import {
  BookingAdjustmentWithBooking,
  AdjustmentStatus,
  RequestType,
} from '@/interfaces/booking-adjustments.interface';
import { toast } from 'sonner';
import {
  useApprovementCancellation,
  useRescheduleAdjustment,
} from '@/hooks/booking-adjustments.hook';
import { useRouter } from 'next/navigation';

interface AdjustmentActionsProps {
  adjustment: BookingAdjustmentWithBooking;
  availableEmployees: Employee[];
  needsEmployeeAssignment: boolean;
}

export default function AdjustmentActions({
  adjustment,
  availableEmployees,
  needsEmployeeAssignment,
}: AdjustmentActionsProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const router = useRouter();

  const handleApproveClick = () => {
    setApproveDialogOpen(true);
  };

  const handleRejectClick = () => {
    setRejectDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (
      needsEmployeeAssignment &&
      adjustment.request_type === RequestType.RESCHEDULE &&
      !selectedEmployeeId
    ) {
      toast.error(
        `Please assign a ${
          adjustment.booking.package_id ? 'travel guide' : 'driver'
        } before approving the reschedule request`
      );
      return;
    }

    setProcessing(true);
    try {
      let response;
      if (adjustment.request_type === RequestType.CANCELLATION) {
        response = await useApprovementCancellation(
          adjustment.id,
          AdjustmentStatus.APPROVED
        );
      } else if (adjustment.request_type === RequestType.RESCHEDULE) {
        response = await useRescheduleAdjustment(
          adjustment.id,
          AdjustmentStatus.APPROVED,
          selectedEmployeeId
        );
      }

      if (response && 'errors' in response) {
        toast.error(response.errors.message || 'Failed to approve adjustment');
      } else if (response && 'message' in response) {
        toast.success('Adjustment approved successfully!');
        router.push('/booking-adjustments');
      }
    } catch (error) {
      console.error('Error approving adjustment:', error);
      toast.error('Failed to approve adjustment. Please try again.');
    } finally {
      setProcessing(false);
      setApproveDialogOpen(false);
    }
  };

  const handleRejectConfirm = async () => {
    setProcessing(true);
    try {
      let response;
      if (adjustment.request_type === RequestType.CANCELLATION) {
        response = await useApprovementCancellation(
          adjustment.id,
          AdjustmentStatus.REJECTED
        );
      } else if (adjustment.request_type === RequestType.RESCHEDULE) {
        response = await useRescheduleAdjustment(
          adjustment.id,
          AdjustmentStatus.REJECTED
        );
      }

      if (response && 'errors' in response) {
        toast.error(response.errors.message || 'Failed to reject adjustment');
      } else if (response && 'message' in response) {
        toast.success(response.message || 'Adjustment rejected successfully!');
        router.push('/booking-adjustments');
      }
    } catch (error) {
      console.error('Error rejecting adjustment:', error);
      toast.error('Failed to reject adjustment. Please try again.');
    } finally {
      setProcessing(false);
      setRejectDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setApproveDialogOpen(false);
    setRejectDialogOpen(false);
    setSelectedEmployeeId('');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Employee Assignment Section for Reschedule */}
      {needsEmployeeAssignment &&
        adjustment.request_type === RequestType.RESCHEDULE && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Assignment Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">
                    New dates: {formatDate(adjustment.new_start_date)} -{' '}
                    {formatDate(adjustment.new_end_date)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please assign a{' '}
                    {adjustment.booking.package_id ? 'travel guide' : 'driver'}{' '}
                    for these dates before approving
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-select">
                  Select{' '}
                  {adjustment.booking.package_id ? 'Travel Guide' : 'Driver'}
                </Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger id="employee-select">
                    <SelectValue
                      placeholder={
                        availableEmployees.length === 0
                          ? `No available ${
                              adjustment.booking.package_id
                                ? 'travel guides'
                                : 'drivers'
                            } for selected dates`
                          : `Select ${
                              adjustment.booking.package_id
                                ? 'travel guide'
                                : 'driver'
                            }`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.length === 0 ? (
                      <SelectItem value="no-employees" disabled>
                        No available{' '}
                        {adjustment.booking.package_id
                          ? 'travel guides'
                          : 'drivers'}{' '}
                        for selected dates
                      </SelectItem>
                    ) : (
                      availableEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{emp.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {emp.role.role_name === 'tour_guide'
                                ? 'Travel Guide'
                                : 'Driver'}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {availableEmployees.length === 0 && (
                  <p className="text-sm text-amber-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    No{' '}
                    {adjustment.booking.package_id
                      ? 'travel guides'
                      : 'drivers'}{' '}
                    available for the selected dates
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      <Separator />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleRejectClick}
          disabled={processing}
          className="min-w-[120px] border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
        <Button
          onClick={handleApproveClick}
          disabled={
            processing ||
            (needsEmployeeAssignment &&
              adjustment.request_type === RequestType.RESCHEDULE &&
              !selectedEmployeeId)
          }
          className="min-w-[120px] bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve
        </Button>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approve Adjustment Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this adjustment request #
              {adjustment.id}? This will approve the{' '}
              {adjustment.request_type?.toLowerCase()} request.
            </DialogDescription>
          </DialogHeader>

          {/* Summary of what will happen */}
          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">
                What will happen:
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                {adjustment.request_type === RequestType.CANCELLATION ? (
                  <li>• The booking will be cancelled</li>
                ) : (
                  <>
                    <li>
                      • The booking dates will be changed to{' '}
                      {formatDate(adjustment.new_start_date)} -{' '}
                      {formatDate(adjustment.new_end_date)}
                    </li>
                    {needsEmployeeAssignment && selectedEmployeeId && (
                      <li>
                        •{' '}
                        {
                          availableEmployees.find(
                            (emp) => emp.id.toString() === selectedEmployeeId
                          )?.name
                        }{' '}
                        will be assigned as the{' '}
                        {adjustment.booking.package_id
                          ? 'travel guide'
                          : 'driver'}
                      </li>
                    )}
                    {adjustment.additional_price !== 0 && (
                      <li>
                        • Additional price of{' '}
                        <span
                          className={
                            adjustment.additional_price > 0
                              ? 'text-red-600'
                              : 'text-green-600'
                          }
                        >
                          {adjustment.additional_price > 0 ? '+' : ''}$
                          {Math.abs(
                            adjustment.additional_price
                          ).toLocaleString()}
                        </span>{' '}
                        will be applied
                      </li>
                    )}
                  </>
                )}
                <li>• The customer will be notified</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={processing}
            >
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
              {adjustment.id}? This will reject the{' '}
              {adjustment.request_type?.toLowerCase()} request.
            </DialogDescription>
          </DialogHeader>

          {/* Summary of what will happen */}
          <div className="space-y-4 py-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">
                What will happen:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• The adjustment request will be rejected</li>
                <li>• The original booking will remain unchanged</li>
                <li>• The customer will be notified of the rejection</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={processing}
            >
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
    </>
  );
}
