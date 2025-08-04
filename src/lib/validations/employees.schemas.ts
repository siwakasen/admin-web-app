import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email must be provided" })
    .email({ message: "Please enter a valid email." })
    .trim(),
  password: z.string().min(1, { message: "Password must be provided" }).trim(),
});

export const ForgetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
});

export const ChangePasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character.",
      })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password must be provided" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must be match",
    path: ["confirmPassword"],
  });

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
export type ForgetPasswordFormSchemaType = z.infer<
  typeof ForgetPasswordFormSchema
>;
export const CreateEmployeeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email." })
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
  role_id: z.number().min(1, { message: "Role is required" }),
  salary: z.number().min(1, { message: "Salary must be greater than 0" }),
});

export const UpdateEmployeeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  role_id: z.number().min(1, { message: "Role is required" }),
  salary: z.number().min(1, { message: "Salary must be greater than 0" }),
});

export type ChangePasswordFormSchemaType = z.infer<
  typeof ChangePasswordFormSchema
>;
export type CreateEmployeeSchemaType = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeSchemaType = z.infer<typeof UpdateEmployeeSchema>;

