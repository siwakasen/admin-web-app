import { Meta } from "./common.interface";

export interface CarsResponse {
  data: Car[];
  meta: Meta;
}

export interface Car {
  id: number;
  car_name: string;
  car_image: string;
  car_color: string;
  police_number: string;
  transmission: string;
  description: string;
  max_persons: number;
  price_per_day: number;
  includes: string[];
  created_at: string;
  updated_at: string;
  deleted_at: any;
}

export interface CarsDetailResponse {
  data: Car;
  message: string;
}

export interface CarsDetailRequest {
  id: number;
}


export interface CreateUpdateCarRequest {
  car_name: string;
  car_color: string;
  police_number: string;
  transmission: string;
  description: string;
  max_persons: number;
  price_per_day: number;
  includes: string[];
}