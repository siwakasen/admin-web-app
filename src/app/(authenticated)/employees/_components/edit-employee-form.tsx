'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UpdateEmployeeSchema,
  UpdateEmployeeSchemaType,
} from '@/lib/validations/employees.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Employee } from '@/interfaces';

interface EditEmployeeFormProps {
  onNext: (data: any) => void;
  initialData?: Employee;
}

const roles = [
  {
    id: 1,
    name: 'Owner',
  },
  {
    id: 2,
    name: 'Admin',
  },
  {
    id: 3,
    name: 'Tour Guide',
  },
  {
    id: 4,
    name: 'Driver',
  },
];

export function EditEmployeeForm({
  onNext,
  initialData,
}: EditEmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(UpdateEmployeeSchema),
    defaultValues: {
      name: '',
      role_id: 0,
      salary: 0,
    },
    mode: 'onChange',
  });

  // Set initial values when editing
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        role_id: initialData.role.id,
        salary: initialData.salary,
      });
    }
  }, [initialData, form]);

  const handleRoleChange = (value: string) => {
    form.setValue('role_id', Number(value));
  };

  const onSubmit = async (data: UpdateEmployeeSchemaType) => {
    setIsSubmitting(true);
    try {
      onNext(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter employee full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={handleRoleChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>
                        {roles.find(
                          (role) =>
                            role.id.toString() === field.value?.toString()
                        )?.name || 'Select employee role'}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter employee salary"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting ? 'Updating...' : 'Update Employee'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
