"use server";

import { CarsDetailResponse, CarsResponse, CreateUpdateCarRequest, Pagination } from "@/interfaces";
import { getCarDetail, getAllCars, deleteCar, createCar, updateCar, uploadCarImage, getAllCarsHistory, getCarsDetailHistoryById } from "@/services";
import { getToken } from "@/lib/user-provider";
import { redirect, RedirectType } from "next/navigation";
import { AxiosError } from "axios";

export async function useGetAllCars(pagination: Pagination): Promise<CarsResponse> {
  return await getAllCars(pagination);
}

export async function useGetAllCarsHistory(pagination: Pagination): Promise<CarsResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getAllCarsHistory(pagination, token);
  } catch (error: any) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response?.status,
      errors: error.response?.data,
    };
  }
}

export async function useGetCarDetail(id: number): Promise<CarsDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getCarDetail(id);
  } catch (error: any) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response?.status,
      errors: error.response?.data,
    };
  }
}   

export async function useGetCarsDetailHistoryById(id: number): Promise<CarsDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await getCarsDetailHistoryById(id);
  } catch (error: any) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useDeleteCar(id: number): Promise<CarsDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await deleteCar(id, token);
  } catch (error: any) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useCreateCar(payload: CreateUpdateCarRequest): Promise<CarsDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    try {
      return await createCar(payload, token);
    } catch (error: any) {
      if(error instanceof AxiosError) {
        console.error('Axios response message:', error.response?.data.message);
      } else {
        console.error('Error message:', error.message);
      }
      return {
        status: error.response.status,
        errors: error.response.data,
      };
    }
}

export async function useUploadCarImage(id: number, image: File): Promise<CarsDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
    }
  try{
    return await uploadCarImage(id, image, token);
  } catch (error: any) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useUpdateCar(id: number, payload: CreateUpdateCarRequest): Promise<CarsDetailResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try{
    return await updateCar(id, payload, token);
  } catch (error: any) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

