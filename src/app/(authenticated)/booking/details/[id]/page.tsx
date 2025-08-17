import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Palmtree,
  Users,
  AlertCircle,
  X,
  ArrowLeft,
  CreditCard,
  CarIcon,
} from 'lucide-react';
import {
  CustomersDetailResponse,
  Employee,
  EmployeeResponse,
  Booking,
  TravelPackages,
  Car,
  BookingStatus,
  Customer,
} from '@/interfaces';
import { getToken } from '@/lib/user-provider';
import { getBookingById } from '@/services/bookings.service';
import {
  getCustomersById,
  getCustomersImage,
} from '@/services/customers.service';
import { getAvailableEmployeesByDateRange } from '@/services/employees.service';
import { useGetBookingById } from '@/hooks/booking.hook';
import {
  useGetCustomersById,
  useGetCustomersImage,
} from '@/hooks/customers.hook';
import {
  useGetAvailableEmployeesByDateRange,
  useGetEmployeeById,
} from '@/hooks/employees.hook';
import {
  useGetCarDetail,
  useGetTravelPackagesDetail,
  useGetTravelPackagesHistory,
  useGetTravelPackagesHistoryById,
} from '@/hooks';
import { getCarsDetailHistoryById } from '@/services/cars.service';
import { convertCarImageUrl } from '@/lib/helper/images-url';
import Action from './_components/action';
import IdentityImagesZoom from './_components/identity-images-zoom';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const token = await getToken();
  if (!token) {
    redirect('/redirect/reset-cookie');
  }

  const bookingId = Number(id);

  // Fetch booking data first
  const bookingResponse = await useGetBookingById(bookingId);
  if (!bookingResponse || !('data' in bookingResponse)) {
    notFound();
  }

  const booking = bookingResponse.data;
  // Fetch customer data
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
    console.log(employeeResponse);
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

  // Determine if we need employee assignment
  const needsEmployeeAssignment = Boolean(
    booking.package_id || (booking.car_id && booking.with_driver)
  );
  const requiredRole = booking.package_id ? 3 : 4; // Role 3 for travel package, Role 4 for driver

  // Fetch available employees if needed
  let availableEmployees: Employee[] = [];
  if (needsEmployeeAssignment) {
    const employeesResponse = await useGetAvailableEmployeesByDateRange(
      booking.start_date,
      booking.end_date,
      requiredRole
    );
    if (employeesResponse && 'data' in employeesResponse) {
      availableEmployees = employeesResponse.data;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Confirm Booking</h1>
            <p className="text-muted-foreground">
              Review customer details and confirm the booking
            </p>
          </div>
        </div>

        {/* Package Details */}
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
                      Rp{travelPackage.package_price.toLocaleString()}
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
                            src={image}
                            alt={`Package Image ${index + 1}`}
                            className="max-h-32 w-auto object-contain rounded-lg border shadow-sm  hover:shadow-lg transition-all duration-200 hover:scale-105"
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
                      Rp{car.price_per_day.toLocaleString()}
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
                          className="max-h-48 w-auto object-contain rounded-lg border shadow-sm  hover:shadow-lg transition-all duration-200 hover:scale-105"
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
              {/* Service Type */}
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
              {/* Dates */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Dates
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    {new Date(booking.start_date).toLocaleDateString()} -{' '}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {/* Booking ID */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Booking ID
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{booking.id}</span>
                </div>
              </div>
              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Status
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{booking.status}</span>
                </div>
              </div>
              {/* With Driver */}
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
              {/* Employee */}
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

              {/* Pickup Location */}
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
              {/* Total Price */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Total Price
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {booking.total_price
                      ? `Rp${booking.total_price.toLocaleString()}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {/* Notes */}
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
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Payment Method
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {booking.payments[0]?.payment_method || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Payment Status
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {booking.payments[0]?.status || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Payment Amount
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    {booking.payments[0]?.gross_amount
                      ? `$${booking.payments[0].gross_amount.toLocaleString()}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Payed at
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {booking.payments[0]?.payment_date
                      ? new Date(
                          booking.payments[0].payment_date
                        ).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Separator />
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
        <IdentityImagesZoom
          identityImages={identityImages}
          imageLoadErrors={imageLoadErrors}
        />

        {/* Action Component */}
        {booking.status === BookingStatus.WAITING_CONFIRMATION && (
          <Action
            booking={booking}
            availableEmployees={availableEmployees}
            needsEmployeeAssignment={needsEmployeeAssignment}
            requiredRole={requiredRole}
          />
        )}
      </div>
    </div>
  );
}
