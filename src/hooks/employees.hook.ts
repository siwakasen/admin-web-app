"use server";
import { ChangePasswordRequest, Employee, EmployeeResponse } from "@/interfaces";
import { createSession, deleteSession, getToken } from "@/lib/user-provider";
import {
  ChangePasswordFormSchemaType,
  ForgetPasswordFormSchemaType,
  LoginFormSchemaType,
} from "@/lib/validations";
import { changePassword, forgetPassword, getALlEmployees, getEmployee, login } from "@/services";
import { redirect, RedirectType } from "next/navigation";

export async function useLoginUser(formData: LoginFormSchemaType) {
  try {
    const response = await login(formData);
    await createSession(response.data.token);
    return {
      message: response.data.message || "Login successful!",
    };
  } catch (error: any) {
    if (error.code == "ECONNREFUSED") {
      return {
        status: 500,
        errors: {
          message: "Server are not available",
        },
      };
    }
    return {
      status: error.response.status,
      errors: error.response.data,
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

    return { employee: data };
  } catch (error: any) {
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

export async function useLogoutUser() {
  await deleteSession();
  return {
    message: "Logout successful!",
  };
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
    console.log(error.response);
    return {
      status: error.response.status,
      errors: error.response.data,
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
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useGetAllEmployees(): Promise< EmployeeResponse| { status?: number; errors?: any }> {
  try {
    const token = (await getToken()) || "";
    const response = await getALlEmployees(token);
    return response;
  } catch (error: any) {
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}