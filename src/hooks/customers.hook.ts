'use server'
import { CustomersDetailResponse } from "@/interfaces";
import { getCustomersById, getCustomersImage } from "@/services";
import { getToken } from "@/lib/user-provider";
import { redirect, RedirectType } from "next/navigation";
import { AxiosError } from "axios";

export async function useGetCustomersById(id: number): Promise<CustomersDetailResponse | {status?: number, errors?: any}> {
    try{
  const token = (await getToken()) || "";
  if (!token) {
     
    redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    return await getCustomersById(id, token);
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

export async function useGetCustomersImage(id: number, filename: string): Promise<string | {status?: number, errors?: any}> {
  try{
    const token = (await getToken()) || "";
    if (!token) {
       
      redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    const response = await getCustomersImage(id, filename, token);
    return response;
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