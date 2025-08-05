import { CarsDetailResponse, CarsResponse, CreateCarRequest, Pagination } from "@/interfaces";
import { createApiInstance } from "../api";
import { AxiosResponse } from "axios";

export async function getAllCars(
  pagination: Pagination
): Promise<CarsResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CARS_API
  );
  try {
      const response: AxiosResponse = await api.get(
        `/cars?limit=${pagination.limit}&page=${pagination.page}&search=${pagination.search || ""}`
      );
      return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function getCarDetail(
  id: number
): Promise<CarsDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CARS_API
  );
  try {
    const response: AxiosResponse = await api.get(`/cars/${id}`);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function deleteCar(
  id: number
): Promise<{ data: { message: string }; message: string }> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CARS_API
  );
  try {
    const response: AxiosResponse = await api.delete(`/cars/${id}`);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function createCar(payload: CreateCarRequest, token: string): Promise<CarsDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CARS_API
  );
  
  const response: AxiosResponse = await api.post(`/cars`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
