import { Booking } from "./booking.interface";
import { Meta } from "./common.interface";
export interface BookingAdjustment {
    id: number
    request_type: string
    status: string
    reason: string
    new_start_date: any
    new_end_date: any
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
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
  }

  export interface BookingAdjustmentResponse {
    data: BookingAdjustmentWithBooking[]
    meta: Meta
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
    new_start_date: any
    new_end_date: any
    additional_price: number
    created_at: string
    updated_at: string
    booking: Booking
  }