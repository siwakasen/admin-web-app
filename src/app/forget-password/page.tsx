"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgetPasswordUser } from "@/hooks";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgetPasswordFormSchema,
  ForgetPasswordFormSchemaType,
} from "@/lib/validations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ForgetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgetPasswordFormSchemaType>({
    resolver: zodResolver(ForgetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgetPasswordFormSchemaType) {
    setIsSubmitting(true);
    try {
      const response = await useForgetPasswordUser(values);
      if (response.status && response.status !== 200) {
        form.setFocus("email");
        form.setError("email", { message: response.errors.email });
        return;
      }
      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-6 p-8 shadow-lg rounded-lg bg-white">
        <div className="flex flex-col items-center mb-4">
          <img
            src="/images/logo.png"
            alt="Ride Bali Explore Logo"
            className="h-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Forget Password
          </h1>
          <p className="text-gray-500 text-sm text-center">
            Enter your email to receive a password reset link
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 /> : "Send Email"}
            </Button>
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-blue-500 hover:text-blue-600 underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
