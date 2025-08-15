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
import { Users, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Employee, Booking } from '@/interfaces';
import { toast } from 'sonner';
import {
  useAssignBookingToEmployee,
  useConfirmBookingWithoutDriver,
} from '@/hooks/booking.hook';
import { useRouter } from 'next/navigation';

interface ActionProps {
  booking: Booking;
  availableEmployees: Employee[];
  needsEmployeeAssignment: boolean;
  requiredRole: number;
}

export default function Action({
  booking,
  availableEmployees,
  needsEmployeeAssignment,
  requiredRole,
}: ActionProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const router = useRouter();
  const handleConfirmBooking = async () => {
    // Check if employee assignment is required but not completed
    if (needsEmployeeAssignment && !selectedEmployeeId) {
      toast.error('Please assign an employee before confirming the booking');
      return;
    }

    setIsConfirming(true);
    try {
      // TODO: Implement booking confirmation API call

      if (needsEmployeeAssignment) {
        console.log('assigning employee');
        const response = await useAssignBookingToEmployee(
          booking.id,
          Number(selectedEmployeeId)
        );
        if ('errors' in response) {
          toast.error(response.errors.message || 'Failed to assign employee');
          return;
        } else if ('data' in response) {
          console.log('employee assigned successfully');
          toast.success(response.message || 'Employee assigned successfully');
        }
        router.push('/booking?status=WAITING_CONFIRMATION');
      } else {
        console.log('confirming booking without driver');
        const response = await useConfirmBookingWithoutDriver(booking.id);
        if ('errors' in response) {
          toast.error(response.errors.message || 'Failed to confirm booking');
          return;
        } else if ('data' in response) {
          console.log('booking confirmed successfully');
          toast.success(response.message || 'Booking confirmed successfully');
        }
        router.push('/booking?status=WAITING_CONFIRMATION');
      }
    } catch (error) {
      console.log('error', error);
      toast.error('Failed to confirm booking. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      {/* Employee Assignment Section */}
      {needsEmployeeAssignment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Assign Employee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee-select">
                Select {booking.package_id ? 'Travel Guide' : 'Driver'}
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
                            booking.package_id ? 'travel guides' : 'drivers'
                          } for selected dates`
                        : `Select ${
                            booking.package_id ? 'travel guide' : 'driver'
                          }`
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees.length === 0 ? (
                    <SelectItem value="no-employees" disabled>
                      No available{' '}
                      {booking.package_id ? 'travel guides' : 'drivers'} for
                      selected dates
                    </SelectItem>
                  ) : (
                    availableEmployees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{emp.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {emp.role.role_name == 'tour_guide'
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
                  No {booking.package_id ? 'travel guides' : 'drivers'}{' '}
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
          onClick={handleConfirmBooking}
          disabled={
            isConfirming || (needsEmployeeAssignment && !selectedEmployeeId)
          }
          className="min-w-[120px] cursor-pointer"
        >
          {isConfirming ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              Confirming...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirm Booking
            </div>
          )}
        </Button>
      </div>
    </>
  );
}
