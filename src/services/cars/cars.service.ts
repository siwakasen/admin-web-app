import { CarsDetailResponse, CarsResponse, CreateUpdateCarRequest, Pagination } from "@/interfaces";
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
  id: number,
  token: string
): Promise<CarsDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CARS_API
  );
  const response: AxiosResponse = await api.delete(`/cars/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createCar(payload: CreateUpdateCarRequest, token: string): Promise<CarsDetailResponse> {
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

export async function uploadCarImage(id: number, image: File, token: string): Promise<CarsDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CARS_API
  );
  const formData = new FormData();
  formData.append("image", image);
  const response: AxiosResponse = await api.post(`/cars/upload-image/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateCar(id: number, payload: CreateUpdateCarRequest, token: string): Promise<CarsDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CARS_API
  );
  const response: AxiosResponse = await api.put(`/cars/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
} 