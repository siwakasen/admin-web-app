'use server';

import {
  CarsDetailResponse,
  CarsResponse,
  CreateUpdateCarRequest,
  Pagination,
} from '@/interfaces';
import {
  getCarDetail,
  getAllCars,
  deleteCar,
  createCar,
  updateCar,
  uploadCarImage,
  getAllCarsHistory,
  getCarsDetailHistoryById,
} from '@/services';
import { getToken } from '@/lib/user-provider';
import { redirect, RedirectType } from 'next/navigation';
import { AxiosError } from 'axios';

export async function useGetAllCars(
  pagination: Pagination
): Promise<CarsResponse> {
  console.log('useGetAllCars | payload', { pagination });
  const response = await getAllCars(pagination);
  console.log('useGetAllCars | response', response);
  return response;
}

export async function useGetAllCarsHistory(
  pagination: Pagination
): Promise<CarsResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useGetAllCarsHistory | payload', { pagination });
    const response = await getAllCarsHistory(pagination, token);
    console.log('useGetAllCarsHistory | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
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

export async function useGetCarDetail(
  id: number
): Promise<CarsDetailResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useGetCarDetail | payload', { id });
    const response = await getCarDetail(id);
    console.log('useGetCarDetail | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
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

export async function useGetCarsDetailHistoryById(
  id: number
): Promise<CarsDetailResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useGetCarsDetailHistoryById | payload', { id });
    const response = await getCarsDetailHistoryById(id);
    console.log('useGetCarsDetailHistoryById | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
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

export async function useDeleteCar(
  id: number
): Promise<CarsDetailResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useDeleteCar | payload', { id });
    const response = await deleteCar(id, token);
    console.log('useDeleteCar | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
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

export async function useCreateCar(
  payload: CreateUpdateCarRequest
): Promise<CarsDetailResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useCreateCar | payload', { payload });
    const response = await createCar(payload, token);
    console.log('useCreateCar | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
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

export async function useUploadCarImage(
  id: number,
  image: File
): Promise<CarsDetailResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useUploadCarImage | payload', { id, image });
    const response = await uploadCarImage(id, image, token);
    console.log('useUploadCarImage | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
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

export async function useUpdateCar(
  id: number,
  payload: CreateUpdateCarRequest
): Promise<CarsDetailResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useUpdateCar | payload', { id, payload });
    const response = await updateCar(id, payload, token);
    console.log('useUpdateCar | response', response);
    return response;
  } catch (error: any) {
    if (error instanceof AxiosError) {
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
