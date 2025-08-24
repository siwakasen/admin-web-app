import { Booking, BookingWithoutAdjustments } from "./booking.interface";
import { Meta } from "./common.interface";
export interface BookingAdjustment {
    id: number
    request_type: string
    status: string
    reason: string
    new_start_date: string
    new_end_date: string
    additional_price: number
    created_at: string
    updated_at: string
  }
  export enum RequestType {
    CANCELLATION = 'CANCELLATION',
    RESCHEDULE = 'RESCHEDULE'
  }
  
  export enum AdjustmentStatus {
    PENDING = 'PENDING',
    WAITING_PAYMENT = 'WAITING_PAYMENT',
    WAITING_RECONFIRMATION = 'WAITING_RECONFIRMATION',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
  }

  export interface BookingAdjustmentResponse {
    data: BookingAdjustmentWithBooking[]
    meta: Meta
  }

  export interface BookingAdjustmentDetailsResponse {
    data: BookingAdjustmentWithBooking
    message: string
  }

  export interface ApprovementCancellationResponse {
    data: any
    message: string
  }
  
  export interface BookingAdjustmentWithBooking {
    id: number
    request_type: string
    status: string
    reason: string
    new_start_date: string
    new_end_date: string
    additional_price: number
    created_at: string
    updated_at: string
    booking: BookingWithoutAdjustments
  }

  export interface RescheduleAdjustmentResponse {
    data: {
        adjustment: {
            request_type: RequestType;
            status: AdjustmentStatus;
        };
    };

    message: string
  }