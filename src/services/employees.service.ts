"use server";
import { toast } from "sonner";
import { createApiInstance } from "./api";
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  EmployeeResponse,
  GetAllEmployeesResponse ,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  LoginRequest,
  LoginResponse,
  Pagination,
  CreateEmployeeRequest,
  DeleteEmployeeResponse,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
  CreateEmployeeResponse,
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



export const getAllEmployees = async (token: string, pagination?: Pagination): Promise<GetAllEmployeesResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  
  let url = "/employees";
  if (pagination) {
    const params = new URLSearchParams({
      limit: pagination.limit.toString(),
      page: pagination.page.toString(),
    });
    if (pagination.search) {
      params.append("search", pagination.search);
    }
    url += `?${params.toString()}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

export const getAvailableEmployees = async (token: string): Promise<EmployeeResponse[]> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  const response = await api.get("/employees/available");
  return response.data;
};

export const getAvailableEmployeesByDateRange = async (
  token: string, 
  startDate: string, 
  endDate: string,
  roleId: number,
  bookingId: number
): Promise<GetAllEmployeesResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  
  let url = `/employees/available?start_date=${startDate}&end_date=${endDate}&booking_id=${bookingId}&role_id=${roleId}`;
  const response = await api.get(url);
  return response.data;
};

export const getEmployeeById = async (token: string, id: number): Promise<EmployeeResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  const response = await api.get(`/employees/${id}`);
  return response.data;
};



export const createEmployee = async (token: string, payload: CreateEmployeeRequest): Promise<CreateEmployeeResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  const response = await api.post("/employees", payload);
  return response.data;
};

export const updateEmployee = async (token: string, id: number, payload: UpdateEmployeeRequest): Promise<UpdateEmployeeResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  const response = await api.patch(`/employees/${id}`, payload);
  return response.data;
};

export const deleteEmployee = async (token: string, id: number): Promise<DeleteEmployeeResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_EMPLOYEES_API_URL,
    token
  );
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};
