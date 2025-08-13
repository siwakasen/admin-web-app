'use server'
import { CustomersDetailResponse } from "@/interfaces";
import { getCustomersById, getCustomersImage } from "@/services";
import { getToken } from "@/lib/user-provider";
import { redirect, RedirectType } from "next/navigation";

export async function useGetCustomersById(id: number): Promise<CustomersDetailResponse | {status?: number, errors?: any}> {
    try{
  const token = (await getToken()) || "";
  if (!token) {
    console.warn("No token found");
    redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    return await getCustomersById(id, token);
  } catch (error: any) {
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useGetCustomersImage(id: number, filename: string): Promise<string | {status?: number, errors?: any}> {
  try{
    const token = (await getToken()) || "";
    if (!token) {
      console.warn("No token found");
      redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    const response = await getCustomersImage(id, filename, token);
    return response;
  } catch (error: any) {  
    console.warn("Hooks:", error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}