"use server";
import { ChangePasswordRequest, CreateEmployeeRequest, CreateEmployeeResponse, DeleteEmployeeResponse, Employee, EmployeeResponse, GetAllEmployeesResponse, Pagination, UpdateEmployeeRequest, UpdateEmployeeResponse } from "@/interfaces";
import { createSession, deleteSession, getToken } from "@/lib/user-provider";
import {
  ForgetPasswordFormSchemaType,
  LoginFormSchemaType,
} from "@/lib/validations";
import { changePassword, createEmployee, deleteEmployee, forgetPassword, getAllEmployees, getAvailableEmployees, getAvailableEmployeesByDateRange, getEmployee, getEmployeeById, login, updateEmployee } from "@/services";
import { redirect, RedirectType } from "next/navigation";
import { revalidateTag } from "next/cache";
import { AxiosError } from "axios";

export async function useLoginUser(formData: LoginFormSchemaType) {
  try {
    const response = await login(formData);
    await createSession(response.data.token);
    
    revalidateTag('employee-middleware');
    
    return {
      message: response.data.message || "Login successful!",
    };
  } catch (error: any) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    if (error.code == "ECONNREFUSED") {
      return {
        status: 500,
        errors: {
          message: "Server are not available",
        },
      };
    }
    return {
      status: error.response?.status,
      errors: error.response?.data,
    };
  }
}

export async function useGetEmployee() {

  try {
    const token = (await getToken()) || "";
    if (!token) {
      return { employee: undefined };
    }
    const { data } = await getEmployee(token);

    if(!data){
      redirect("/redirect/reset-cookie", RedirectType.replace);
    }

    return { employee: data };
  } catch (error: any) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    const message: string = error.message;
    if (
      message.includes("Invalid token") ||
      error.code == "ERR_BAD_REQUEST" ||
      error.code == "ECONNREFUSED" ||
      error.code == "ERR_NETWORK" ||
      error.response?.data.message.includes("Invalid token")
    ) {
      redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    return { employee: undefined };
  }
}

export async function useGetEmployeeFromMiddleware() {
  try {
    const token = (await getToken()) || "";
    if (!token) {
      return { employee: undefined };
    }
    const { data } = await getEmployee(token);
    return { employee: data };
    
  } catch (error: any ) {
    if(error instanceof AxiosError) {
      console.error('Axios response message:', error.response?.data.message);
    } else {
      console.error('Error message:', error.message);
    }
    return { employee: undefined };
  }
}

export async function useGetAvailableEmployees(): Promise<EmployeeResponse[] | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || "";
    const response = await getAvailableEmployees(token);
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

export async function useGetAvailableEmployeesByDateRange(
  startDate: string,
  endDate: string,
  roleId?: number
): Promise<GetAllEmployeesResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || "";
    const response = await getAvailableEmployeesByDateRange(token, startDate, endDate, roleId);
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

export async function useLogoutUser() {
  try {
  await deleteSession();
  
  revalidateTag('employee-middleware');
  
    return {
      message: "Logout successful!",
    };
  } catch (error: any) {
    console.error('Error message:', `Error on delete session | ${error.message}`);
    return {
      message: "Logout failed!",
    };
  }
}
export async function useForgetPasswordUser(
  formData: ForgetPasswordFormSchemaType
) {
  try {
    const { message } = await forgetPassword(formData);

    return {
      message: message || "Email to reset password sent!",
    };
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

export async function useChangePasswordUser(
  formData: ChangePasswordRequest
): Promise<{ message?: string; status?: number; errors?: any }> {
  try {
    const { message } = await changePassword(formData);
    return { message };
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

export async function useGetAllEmployees(pagination?: Pagination): Promise<GetAllEmployeesResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || "";
    const response = await getAllEmployees(token, pagination);
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

export async function useGetEmployeeById(id: number): Promise<EmployeeResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || "";
    const response = await getEmployeeById(token, id);
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

export async function useCreateEmployee(payload: CreateEmployeeRequest): Promise<CreateEmployeeResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || "";
    const response = await createEmployee(token, payload);
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

export async function useUpdateEmployee(id: number, payload: UpdateEmployeeRequest): Promise<UpdateEmployeeResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || "";
    const response = await updateEmployee(token, id, payload);
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

export async function useDeleteEmployee(id: number): Promise<DeleteEmployeeResponse | { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || "";
    const response = await deleteEmployee(token, id);
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