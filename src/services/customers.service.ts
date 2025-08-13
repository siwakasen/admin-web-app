import { CustomersDetailResponse } from "@/interfaces";
import { createApiInstance } from "./api";

export async function getCustomersById(id: number, token: string): Promise<CustomersDetailResponse> {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_CUSTOMERS_API_URL, token);
  const response = await api.get(`/customers/${id}`);
  return response.data;
}

export async function getCustomersImage(id: number, filename: string, token: string): Promise<string> {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_CUSTOMERS_API_URL, token);
  const response = await api.get(`/customers/${id}/identity-files/${filename}`, {
    responseType: 'arraybuffer'
  });
  
  // Convert arraybuffer to base64 using Buffer (Node.js compatible)
  const buffer = Buffer.from(response.data);
  const base64 = buffer.toString('base64');
  
  // Determine content type based on filename extension
  const extension = filename.split('.').pop()?.toLowerCase();
  let mimeType = 'image/jpeg'; // default
  if (extension === 'png') mimeType = 'image/png';
  else if (extension === 'gif') mimeType = 'image/gif';
  else if (extension === 'webp') mimeType = 'image/webp';
  
  return `data:${mimeType};base64,${base64}`;
}