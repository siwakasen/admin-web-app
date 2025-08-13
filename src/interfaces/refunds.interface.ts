import { Booking } from "./booking.interface"

export interface RefundsResponse {
    data: Refund
    message: string
  }
  
  export interface Refund {
    id: number
    amount: string
    method: string
    bank_name: any
    account_number: any
    account_name: any
    status: string
    refund_date: any
    reason: string
    created_at: string
    updated_at: string
    booking: Booking
  }
  
 