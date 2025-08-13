'use client';

import { useState } from 'react';
import { HeaderNavigation } from '@/components/shared/navbar/header';
import { Card, CardContent } from '@/components/ui/card';
import { ExpensesForm } from '../_components/expenses-form';
import { useCreateExpense } from '@/hooks/expenses.hook';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import { ExpensesResponse } from '@/interfaces/expenses.interface';
import { CreateExpenseRequest } from '@/interfaces/expenses.interface';
import { useRouter } from 'next/navigation';

export default function CreateExpensePage() {
  const currentStep = 1;
  const router = useRouter();

  const handleExpenseSubmit = async (data: CreateExpenseRequest) => {
    try {
      const response: ExpensesResponse | { status?: number; errors?: any } =
        await useCreateExpense(data);
      if ('errors' in response) {
        if (response.status === 403) {
          toast.error('You are not authorized to create an expense');
        } else {
          toast.error(response.errors?.message || 'Failed to create expense');
        }
        return;
      } else if ('data' in response) {
        toast.success('Expense created successfully!');
        router.push('/expenses');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense. Please try again.');
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Expense Details',
      description: 'Provide expense information',
      icon: '1',
    },
  ];

  return (
    <section>
      <HeaderNavigation />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="max-w-4xl mx-auto w-full">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex w-full">
              <div className="mx-auto flex items-center justify-center">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          currentStep >= step.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <h3
                          className={`text-sm font-semibold ${
                            currentStep >= step.id
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 transition-colors ${
                          currentStep > step.id ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <Card>
            <CardContent className="p-6">
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">
                    Create New Expense
                  </h1>
                  <p className="text-muted-foreground">
                    Fill in the details for your new expense.
                  </p>
                </div>
                <ExpensesForm onNext={handleExpenseSubmit} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
