import { Meta } from "./common.interface";
  
  export interface Booking {
    id: number
    package_id?: number
    car_id?: number
    customer_id: number
    employee_id: any
    with_driver: boolean
    number_of_persons?: number
    start_date: string
    end_date: string
    total_price: number
    status: string
    pickup_location: string
    pickup_time: string
    additional_notes: string
    created_at: string
    updated_at: string
    payments: Payment[]
  }

  export interface GetAllBookingsResponse {
    data: Booking[]
    meta: Meta
  }
  export interface BookingResponse {
    data: Booking
    message: string
  }

  export enum BookingStatus {
    WAITING_PAYMENT = 'WAITING_PAYMENT',
    WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
    CONFIRMED = 'CONFIRMED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
  }

  
  export interface Payment {
    id: number
    gross_amount: number
    net_amount?: number
    payment_date?: string
    payment_method: string
    payment_gateway_id: string
    status: string
    created_at: string
    updated_at: string
  }
  