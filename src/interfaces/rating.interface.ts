export interface RatingResponse {
  data: Rating[];
  message: string;
}

export interface Rating {
  customer_id: number;
  service_rate: number;
  description: string;
  booking: Booking;
  id: number;
  created_at: string;
  updated_at: string;
}

interface Booking {
  id: number;
  package_id: number;
  car_id: any;
  customer_id: number;
  employee_id: number;
  with_driver: boolean;
  number_of_persons: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  pickup_location: string;
  pickup_time: string;
  additional_notes: string;
  created_at: string;
  updated_at: string;
}
