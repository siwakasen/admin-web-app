'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExpenseSchema } from '@/lib/validations/expenses.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState, useEffect } from 'react';
import { Expense } from '@/interfaces/expenses.interface';
import { CreateExpenseRequest } from '@/interfaces/expenses.interface';
import { z } from 'zod';

type ExpenseFormData = z.infer<typeof createExpenseSchema>;

interface ExpensesFormProps {
  onNext: (data: CreateExpenseRequest) => void;
  initialData?: Expense;
  isEditing?: boolean;
}

export function ExpensesForm({
  onNext,
  initialData,
  isEditing = false,
}: ExpensesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      expense_name: '',
      expense_amount: 0,
      expense_date: '',
    },
    mode: 'onChange',
  });

  // Set initial values when editing
  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        expense_name: initialData.expense_name,
        expense_amount: initialData.expense_amount,
        expense_date: initialData.expense_date.split('T')[0], // Convert to YYYY-MM-DD format
      });
      setIsLoading(false);
    } else if (!isEditing) {
      setIsLoading(false);
    }
  }, [initialData, isEditing, form]);

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      // Convert number to proper format
      const formattedData: CreateExpenseRequest = {
        ...data,
        expense_amount: Number(data.expense_amount),
      };

      onNext(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading expense data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Name */}
            <FormField
              control={form.control}
              name="expense_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter expense name"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expense Amount */}
            <FormField
              control={form.control}
              name="expense_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (IDR) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Expense Date */}
          <FormField
            control={form.control}
            name="expense_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expense Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditing ? 'Update Expense' : 'Create Expense'}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
