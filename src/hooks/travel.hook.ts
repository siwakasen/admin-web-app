'use server';
import {
  Pagination,
  TravelPackagesDetailResponse,
  TravelPackagesResponse,
  CreateTravelPackageRequest,
  CreateTravelPackageResponse,
  DeleteTravelPackageResponse,
  UploadTravelPackageImagesResponse,
  UpdateTravelPackageRequest,
  UpdateTravelPackageResponse,
  EmployeeResponse,
} from '@/interfaces';
import { getToken } from '@/lib/user-provider';
import {
  createTravelPackage,
  deleteTravelPackage,
  getAllTravelPackages,
  getTravelPackagesDetail,
  uploadTravelPackageImages,
  updateTravelPackage,
  deleteTravelPackageImage,
  getAllTravelPackagesHistory,
  getTravelPackagesHistoryById,
} from '@/services';
import { redirect, RedirectType } from 'next/navigation';
import { AxiosError } from 'axios';
export async function useGetTravelPackages(
  pagination: Pagination
): Promise<TravelPackagesResponse> {
  return await getAllTravelPackages(pagination);
}

export async function useGetTravelPackagesHistory(
  pagination: Pagination
): Promise<TravelPackagesResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useGetTravelPackagesHistory | payload', { pagination });
    const response = await getAllTravelPackagesHistory(pagination, token);
    console.log('useGetTravelPackagesHistory | response', response);
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

export async function useGetTravelPackagesDetail(
  id: number
): Promise<TravelPackagesDetailResponse | { status?: number; errors?: any }> {
  try {
    console.log('useGetTravelPackagesDetail | payload', { id });
    const response = await getTravelPackagesDetail(id);
    console.log('useGetTravelPackagesDetail | response', response);
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

export async function useGetTravelPackagesHistoryById(
  id: number
): Promise<TravelPackagesDetailResponse | { status?: number; errors?: any }> {
  try {
    console.log('useGetTravelPackagesHistoryById | payload', { id });
    const response = await getTravelPackagesHistoryById(id);
    console.log('useGetTravelPackagesHistoryById | response', response);
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

export async function useCreateTravelPackage(
  payload: CreateTravelPackageRequest
) {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useCreateTravelPackage | payload', { payload });
    const response = await createTravelPackage(payload, token);
    console.log('useCreateTravelPackage | response', response);
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

export async function useUpdateTravelPackage(
  packageId: number,
  payload: UpdateTravelPackageRequest
) {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useUpdateTravelPackage | payload', { packageId, payload });
    const response = await updateTravelPackage(packageId, payload, token);
    console.log('useUpdateTravelPackage | response', response);
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

export async function useUploadTravelPackageImages(
  packageId: number,
  images: File[]
): Promise<
  UploadTravelPackageImagesResponse | { status?: number; errors?: any }
> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useUploadTravelPackageImages | payload', {
      packageId,
      images,
    });
    const response = await uploadTravelPackageImages(packageId, images, token);
    console.log('useUploadTravelPackageImages | response', response);
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

export async function useDeleteTravelPackage(
  packageId: number
): Promise<DeleteTravelPackageResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useDeleteTravelPackage | payload', { packageId });
    const response = await deleteTravelPackage(packageId, token);
    console.log('useDeleteTravelPackage | response', response);
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

export async function useDeleteTravelPackageImage(
  packageId: number,
  imageUrl: string
): Promise<EmployeeResponse | { status?: number; errors?: any }> {
  const token = (await getToken()) || '';
  if (!token) {
    redirect('/redirect/reset-cookie', RedirectType.replace);
  }
  try {
    console.log('useDeleteTravelPackageImage | payload', {
      packageId,
      imageUrl,
    });
    const response = await deleteTravelPackageImage(packageId, imageUrl, token);
    console.log('useDeleteTravelPackageImage | response', response);
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
