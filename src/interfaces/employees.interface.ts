import { Meta } from "./common.interface";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    message: string;
    token: string;
  };
}

export interface EmployeeResponse {
  data: Employee;
  message: string;
}

export interface GetAllEmployeesResponse {
  data: Employee[];
  meta: Meta
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
  role_id: number;
  salary: number;
}

export interface CreateEmployeeResponse {
  message: string;
}
export interface DeleteEmployeeResponse {
  message: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  salary: number;
  last_update_password: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  role: Role;
}

export interface Role {
  id: number;
  role_name: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  role_id: number;
  salary: number;
}

export interface UpdateEmployeeResponse {
  message: string;
}