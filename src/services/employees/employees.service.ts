"use server";
import { toast } from "sonner";
import { createApiInstance } from "../api";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  EmployeeResponse,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  LoginRequest,
  LoginResponse,
} from "@/interfaces";
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL
  );
  const response = await api.post("/employees/login", payload);
  return response.data;
};

export const getEmployee = async (token: string): Promise<EmployeeResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  const response = await api.get("/employees/me");

  return response.data;
};

export const forgetPassword = async (
  payload: ForgetPasswordRequest
): Promise<ForgetPasswordResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL
  );
  const response = await api.post("/employees/forget-password", payload);
  return response.data;
};

export const changePassword = async (
  payload: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL
  );

  const response = await api.post("/employees/change-password", payload);
  return response.data;
};

export const getALlEmployees = async (token: string): Promise<EmployeeResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  const response = await api.get("/employees");
  return response.data;
};
