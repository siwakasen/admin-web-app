import {
  TravelPackagesResponse,
  Pagination,
  TravelPackagesDetailResponse,
  CreateTravelPackageRequest,
  CreateTravelPackageResponse,
  UploadTravelPackageImagesResponse,
  UpdateTravelPackageRequest,
  UpdateTravelPackageResponse,
  EmployeeResponse,
} from "@/interfaces";
import { createApiInstance } from "./api";
import { AxiosResponse } from "axios";

export async function getAllTravelPackages(
  pagination: Pagination
): Promise<TravelPackagesResponse> {
  try {
    const api = await createApiInstance(
      process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL
    );
    const response = await api.get(
      `/travel-packages?limit=${pagination.limit}&page=${
        pagination.page
      }&search=${pagination.search || ""}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to  fetch travel packages");
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function getAllTravelPackagesHistory(
  pagination: Pagination,
  token: string
): Promise<TravelPackagesResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL,
    token
  );
  const response = await api.get(
    `/travel-packages/history?limit=${pagination.limit}&page=${
      pagination.page
    }`,
  );
  return response.data;
}

export async function getTravelPackagesDetail(
  id: number
): Promise<TravelPackagesDetailResponse> {
  
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL,
  );
  const response: AxiosResponse = await api.get(
    `/travel-packages/${id}`
  );
  if (response.status !== 200) {
    throw new Error("Failed to fetch travel packages detail");
  }
  return response.data;
}

export async function getTravelPackagesHistoryById(
  id: number,
): Promise<TravelPackagesDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL
  );
  const response: AxiosResponse = await api.get(`/travel-packages/${id}/history`);
  return response.data;
}

export async function createTravelPackage(payload: CreateTravelPackageRequest, token: string): Promise<CreateTravelPackageResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL,
    token
  );
  const response: AxiosResponse = await api.post("/travel-packages", payload, {
    });
    return response.data;
}

export async function updateTravelPackage(
  packageId: number,
  payload: UpdateTravelPackageRequest, 
  token: string
): Promise<UpdateTravelPackageResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL,
    token
  );
  const response: AxiosResponse = await api.put(`/travel-packages/${packageId}`, payload, {
    });
    return response.data;
}

export async function uploadTravelPackageImages(
  packageId: number,
  images: File[],
  token: string
): Promise<UploadTravelPackageImagesResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL,
    token
  );
  
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("images", image);
  });

  const response: AxiosResponse = await api.post(
    `/travel-packages/upload-images/${packageId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function deleteTravelPackage(
  packageId: number,
  token: string
): Promise<any> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL,
    token
  );
  const response: AxiosResponse = await api.delete(
    `/travel-packages/${packageId}`,
  );
  return response.data;
}

export async function deleteTravelPackageImage(
  packageId: number,
  imageUrl: string,
  token: string
): Promise<EmployeeResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL,
    token
  );
  const response: AxiosResponse = await api.delete(
    `/travel-packages/delete-images/${packageId}`,
    {
      data: {
        imagePath: imageUrl,
      },
    }
  );
  return response.data;
}