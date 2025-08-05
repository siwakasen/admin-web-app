"use server";

import { CarsDetailResponse, CarsResponse, CreateCarRequest, Pagination } from "@/interfaces";
import { getCarDetail, getAllCars, deleteCar, createCar } from "@/services";
import { getToken } from "@/lib/user-provider";
import { redirect, RedirectType } from "next/navigation";

export async function useGetAllCars(pagination: Pagination): Promise<CarsResponse> {
  return await getAllCars(pagination);
}

export async function useGetCarDetail(id: number): Promise<CarsDetailResponse> {
  return await getCarDetail(id);
}   

export async function useDeleteCar(id: number): Promise<{ data: { message: string }; message: string }> {
  return await deleteCar(id);
}

export async function useCreateCar(payload: CreateCarRequest): Promise<CarsDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    try {
      return await createCar(payload, token);
    } catch (error: any) {
      console.warn("Hooks:", error.response.data);
      return {
        status: error.response.status,
        errors: error.response.data,
      };
    }
}