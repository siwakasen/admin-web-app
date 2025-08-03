"use server";
import {
  Pagination,
  TravelPackagesDetailRequest,
  TravelPackagesDetailResponse,
  TravelPackagesResponse,
  CreateTravelPackageRequest,
  CreateTravelPackageResponse,
  DeleteTravelPackageResponse,
  UploadTravelPackageImagesResponse,
  UpdateTravelPackageRequest,
  UpdateTravelPackageResponse,
} from "@/interfaces";
import { getToken } from "@/lib/user-provider";
import { createTravelPackage, deleteTravelPackage, fetchTravelPackages, fetchTravelPackagesDetail, uploadTravelPackageImages, updateTravelPackage } from "@/services";
import { redirect, RedirectType } from "next/navigation";
export async function useGetTravelPackages(
  pagination: Pagination
): Promise<TravelPackagesResponse> {
  return await fetchTravelPackages(pagination);
}

export async function useGetTravelPackagesDetail(
  pagination: TravelPackagesDetailRequest
): Promise<TravelPackagesDetailResponse> {
  return await fetchTravelPackagesDetail(pagination);
}

export async function useCreateTravelPackage(
  payload: CreateTravelPackageRequest,
) {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await createTravelPackage(payload, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useUpdateTravelPackage(
  packageId: number,
  payload: UpdateTravelPackageRequest,
) {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await updateTravelPackage(packageId, payload, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useUploadTravelPackageImages(
  packageId: number,
  images: File[]
): Promise<UploadTravelPackageImagesResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await uploadTravelPackageImages(packageId, images, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
} 

export async function useDeleteTravelPackage(
  packageId: number
): Promise<DeleteTravelPackageResponse | {status?: number, errors?: any}> {
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
  }
  try {
    return await deleteTravelPackage(packageId, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}