export interface RefundsResponse {
    data: Refunds[]
    meta: Meta
  }
  
  export interface Refunds {
    id: number
    amount: string
    method: string
    bank_name?: string
    account_number?: string
    account_name?: string
    status: RefundStatus
    refund_date: string
    reason: string
    created_at: string
    updated_at: string
    booking: Booking
  }
  
  export interface Booking {
    id: number
    package_id?: number
    car_id?: number
    customer_id: number
    employee_id?: number
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
    booking_adjustments: BookingAdjustment[]
  }
  
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
  
  export interface Meta {
    totalItems: number
    currentPage: number
    totalPages: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  
  export enum RefundStatus {
    WAITING_FORM = 'WAITING_FORM',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
  }