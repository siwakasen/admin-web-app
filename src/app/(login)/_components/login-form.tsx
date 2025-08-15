'use client';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoginFormSchema, LoginFormSchemaType } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginUser } from '@/hooks/employees.hook';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormSchemaType) {
    try {
      const response = await useLoginUser(values);
      if (response.status && response.status !== 200) {
        switch (true) {
          case !!response.errors?.email:
            form.setFocus('email');
            form.setError('email', { message: response.errors.email });
            break;

          case !!response.errors?.password:
            form.setFocus('password');
            form.setError('password', { message: response.errors.password });
            break;

          case !!response.errors?.message:
            toast.error(response.errors.message);
            break;
        }
        return;
      }
      if (response.message) {
        toast.success(response.message);

        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to dashboard</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your administrator account below here
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
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
                      placeholder="Enter your email..."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forget-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forget your password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Password"
                        className="w-full pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
