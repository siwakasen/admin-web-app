import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Palmtree,
  Users,
  CreditCard,
  CarIcon,
  FileText,
  XCircle,
} from 'lucide-react';
import {
  Employee,
  TravelPackages,
  Car,
  BookingStatus,
  Customer,
  PaymentStatus,
} from '@/interfaces';
import {
  BookingAdjustmentWithBooking,
  BookingAdjustmentDetailsResponse,
  AdjustmentStatus,
  RequestType,
} from '@/interfaces/booking-adjustments.interface';
import { getToken } from '@/lib/user-provider';
import { useGetBookingAdjustmentById } from '@/hooks/booking-adjustments.hook';
import {
  useGetCustomersById,
  useGetCustomersImage,
} from '@/hooks/customers.hook';
import {
  useGetAvailableEmployeesByDateRange,
  useGetEmployeeById,
} from '@/hooks/employees.hook';
import { useGetTravelPackagesHistoryById } from '@/hooks';
import { getCarsDetailHistoryById } from '@/services/cars.service';
import {
  convertCarImageUrl,
  convertTravelImageUrl,
} from '@/lib/helper/images-url';
import IdentityImagesZoom from '../../../booking/details/[id]/_components/identity-images-zoom';
import AdjustmentActions from './_components/adjustment-actions';

interface PageProps {
  params: Promise<{
    id: number;
  }>;
}

export default async function BookingAdjustmentDetailsPage({
  params,
}: PageProps) {
  const { id: adjustmentId } = await params;
  const token = await getToken();
  if (!token) {
    redirect('/redirect/reset-cookie');
  }

  // Fetch adjustment data first
  const adjustmentResponse = await useGetBookingAdjustmentById(adjustmentId);
  if (!adjustmentResponse || !('data' in adjustmentResponse)) {
    notFound();
  }

  const adjustment: BookingAdjustmentWithBooking = (
    adjustmentResponse as BookingAdjustmentDetailsResponse
  ).data;
  const booking = adjustment.booking;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case AdjustmentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case AdjustmentStatus.WAITING_PAYMENT:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case AdjustmentStatus.WAITING_RECONFIRMATION:
        return 'bg-blue-100 text-blue-800 border-blue-200';
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

  const getBookingStatusBadgeClass = (status: string) => {
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

  // Fetch related data
  const customerResponse = await useGetCustomersById(booking.customer_id);

  let travelPackage: TravelPackages | null = null;
  if (booking.package_id) {
    const travelPackageResponse = await useGetTravelPackagesHistoryById(
      booking.package_id
    );
    if ('data' in travelPackageResponse) {
      travelPackage = travelPackageResponse.data;
    }
  }

  let car: Car | null = null;
  if (booking.car_id) {
    const carResponse = await getCarsDetailHistoryById(booking.car_id);
    if (carResponse) {
      car = carResponse.data;
    }
  }

  let employee: Employee | null = null;
  if (booking.employee_id) {
    const employeeResponse = await useGetEmployeeById(booking.employee_id);
    if (employeeResponse && 'data' in employeeResponse) {
      employee = employeeResponse.data;
    }
  }

  let customer: Customer | null = null;
  if (customerResponse && 'data' in customerResponse) {
    customer = customerResponse.data;
  }

  // Fetch customer images if available
  let identityImages: string[] = [];
  let imageLoadErrors: string[] = [];

  if (customer && customer.identity_file && customer.identity_file.length > 0) {
    for (const filename of customer.identity_file) {
      try {
        const response = await useGetCustomersImage(
          booking.customer_id,
          filename
        );
        if (typeof response === 'string') {
          identityImages.push(response);
        } else if (response && typeof response === 'object') {
          if ('errors' in response) {
            console.error(`Failed to load image ${filename}:`, response.errors);
            imageLoadErrors.push(filename);
          }
        }
      } catch (error) {
        console.error(`Error loading image ${filename}:`, error);
        imageLoadErrors.push(filename);
      }
    }
  }

  // Determine if we need employee assignment for reschedule
  const needsEmployeeAssignment = Boolean(
    adjustment.request_type === RequestType.RESCHEDULE &&
      (booking.package_id || (booking.car_id && booking.with_driver))
  );
  const requiredRole = booking.package_id ? 3 : 4;

  // Fetch available employees if needed for reschedule
  let availableEmployees: Employee[] = [];
  if (
    needsEmployeeAssignment &&
    adjustment.request_type === RequestType.RESCHEDULE
  ) {
    const startDate = adjustment.new_start_date || booking.start_date;
    const endDate = adjustment.new_end_date || booking.end_date;

    const employeesResponse = await useGetAvailableEmployeesByDateRange(
      startDate,
      endDate,
      requiredRole,
      booking.id
    );
    if (employeesResponse && 'data' in employeesResponse) {
      availableEmployees = employeesResponse.data;
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Adjustment Request Details</h1>
            <p className="text-muted-foreground">
              Review and process the adjustment request
            </p>
          </div>
        </div>

        {/* Adjustment Request Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const { icon: Icon, color } = getRequestTypeIcon(
                  adjustment.request_type
                );
                return (
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm">{adjustment.request_type}</span>
                  </div>
                );
              })()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Request ID
                </Label>
                <p className="text-sm font-mono">#{adjustment.id}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Status
                </Label>
                <Badge
                  variant="outline"
                  className={getStatusBadgeClass(adjustment.status)}
                >
                  {adjustment.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Created At
                </Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(adjustment.created_at)}
                  </span>
                </div>
              </div>
              {adjustment.additional_price !== 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Additional Price
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono text-green-600`}>
                      {adjustment.additional_price > 0 ? '+' : ''}
                      {formatPrice(adjustment.additional_price)}
                    </span>
                  </div>
                </div>
              )}
              {adjustment.reason && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Reason
                  </Label>
                  <p className="text-sm">{adjustment.reason}</p>
                </div>
              )}
              {adjustment.request_type === RequestType.RESCHEDULE && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    New Dates
                  </Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {formatDate(adjustment.new_start_date)} -{' '}
                      {formatDate(adjustment.new_end_date)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Travel Package Details */}
        {travelPackage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palmtree className="h-5 w-5" />
                Travel Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Package Name
                  </Label>
                  <p className="text-sm font-medium">
                    {travelPackage.package_name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Duration
                  </Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {travelPackage.duration} days
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Max Persons
                  </Label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {travelPackage.max_persons} people
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Package Price
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-green-600">
                      {formatPrice(travelPackage.package_price)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {travelPackage.description}
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Itineraries
                  </Label>
                  <div className="space-y-2">
                    {travelPackage.itineraries.map((itinerary, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{itinerary}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    What's Included
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {travelPackage.includes.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                {travelPackage.images && travelPackage.images.length > 0 && (
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Package Images
                    </Label>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {travelPackage.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={convertTravelImageUrl(image)}
                            alt={`Package Image ${index + 1}`}
                            className="max-h-32 w-auto object-contain rounded-lg border shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Car Details */}
        {car && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CarIcon className="h-5 w-5" />
                Car Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Car Name
                  </Label>
                  <p className="text-sm font-medium">{car.car_name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Police Number
                  </Label>
                  <p className="text-sm font-mono">{car.police_number}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Color
                  </Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: car.car_color.toLowerCase() }}
                    ></div>
                    <span className="text-sm capitalize">{car.car_color}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Transmission
                  </Label>
                  <Badge variant="outline" className="text-xs">
                    {car.transmission}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Max Persons
                  </Label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{car.max_persons} people</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Price per Day
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-green-600">
                      {formatPrice(car.price_per_day)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {car.description}
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    What's Included
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {car.includes.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                {car.car_image && (
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Car Image
                    </Label>
                    <div className="flex justify-center">
                      <div className="relative group">
                        <img
                          src={convertCarImageUrl(car.car_image)}
                          alt={car.car_name}
                          className="max-h-48 w-auto object-contain rounded-lg border shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Service Type
                </Label>
                <div className="flex items-center gap-2">
                  {booking.package_id ? (
                    <>
                      <Palmtree className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Travel Package</span>
                    </>
                  ) : (
                    <>
                      <CarIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        Car Rental{' '}
                        {booking.with_driver ? 'with Driver' : 'without Driver'}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Original Dates
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    {formatDate(booking.start_date)} -{' '}
                    {formatDate(booking.end_date)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Booking ID
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">#{booking.id}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Booking Status
                </Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getBookingStatusBadgeClass(booking.status)}
                  >
                    {booking.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  With Driver
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {booking.with_driver ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Assigned Employee
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {booking.employee_id && employee
                      ? employee.name
                      : 'Not Assigned'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Pickup Location
                </Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.pickup_location || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Original Total Price
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {booking.total_price
                      ? formatPrice(booking.total_price)
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {booking.additional_notes && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Notes
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{booking.additional_notes}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details ({booking.payments?.length || 0} payment
              {booking.payments?.length !== 1 ? 's' : ''})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.payments && booking.payments.length > 0 ? (
              <div className="space-y-6">
                {booking.payments.map((payment, index) => (
                  <div key={payment.id || index} className="space-y-4">
                    {booking.payments.length > 1 && (
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <span className="text-sm font-medium text-muted-foreground">
                          Payment #{index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {payment.status || 'Unknown'}
                        </Badge>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Payment Method
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {payment.payment_method || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Payment Status
                        </Label>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              payment.status === PaymentStatus.SUCCESS
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : payment.status === PaymentStatus.PENDING
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                : payment.status === PaymentStatus.FAILED
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }
                          >
                            {payment.status || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Payment Amount
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-green-600">
                            {payment.gross_amount
                              ? formatPrice(payment.gross_amount)
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Paid at
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {payment.payment_date
                              ? new Date(payment.payment_date).toLocaleString()
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < booking.payments.length - 1 && (
                      <div className="border-b border-gray-200 mt-4"></div>
                    )}
                  </div>
                ))}

                {/* Payment Summary */}
                {booking.payments.length > 1 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">
                      Payment Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Total Payments:
                        </span>
                        <span className="ml-2 font-mono text-green-600">
                          {formatPrice(
                            booking.payments.reduce(
                              (sum, payment) =>
                                sum + (payment.gross_amount || 0),
                              0
                            )
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Successful:
                        </span>
                        <span className="ml-2">
                          {
                            booking.payments.filter(
                              (p) => p.status === PaymentStatus.SUCCESS
                            ).length
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Pending/Failed:
                        </span>
                        <span className="ml-2">
                          {
                            booking.payments.filter(
                              (p) => p.status !== PaymentStatus.SUCCESS
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <CreditCard className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No payment information available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Payment details have not been recorded for this booking
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Information */}
        {customer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Name
                  </Label>
                  <p className="text-sm font-medium">{customer.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Email
                  </Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{customer.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {customer.phone_number || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Country Origin
                  </Label>
                  <p className="text-sm">
                    {customer.country_origin || 'Not provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Identity Images with Zoom */}
        {booking.car_id && (
          <IdentityImagesZoom
            identityImages={identityImages}
            imageLoadErrors={imageLoadErrors}
          />
        )}

        {/* Action Component */}
        {(adjustment.status === AdjustmentStatus.PENDING ||
          adjustment.status === AdjustmentStatus.WAITING_RECONFIRMATION) && (
          <AdjustmentActions
            adjustment={adjustment}
            availableEmployees={availableEmployees}
            needsEmployeeAssignment={needsEmployeeAssignment}
          />
        )}
      </div>
    </div>
  );
}
