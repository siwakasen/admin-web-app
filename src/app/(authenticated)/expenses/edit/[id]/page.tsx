'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/shared/navbar/header';
import { Card, CardContent } from '@/components/ui/card';
import { ExpensesForm } from '@/app/(authenticated)/expenses/_components/expenses-form';
import { useGetExpenseDetail, useUpdateExpense } from '@/hooks/expenses.hook';
import { toast } from 'sonner';
import { Check, Loader2 } from 'lucide-react';
import {
  ExpenseDetailResponse,
  Expense,
  ExpensesResponse,
} from '@/interfaces/expenses.interface';
import { CreateExpenseRequest } from '@/interfaces/expenses.interface';
import { useRouter } from 'next/navigation';

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const expenseId = Number(params.id);
  const [expenseData, setExpenseData] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  // Fetch expense data on component mount
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await useGetExpenseDetail(expenseId);
        if ('data' in response) {
          setExpenseData(response.data);
        } else {
          toast.error('Failed to fetch expense data');
        }
      } catch (error) {
        console.error('Error fetching expense data:', error);
        toast.error('Failed to fetch expense data');
      } finally {
        setIsLoading(false);
      }
    };

    if (expenseId) {
      fetchExpenseData();
    }
  }, [expenseId, refetch]);

  const handleExpenseSubmit = async (data: CreateExpenseRequest) => {
    try {
      const response: ExpensesResponse | { status?: number; errors?: any } =
        await useUpdateExpense(expenseId, data);
      if ('errors' in response) {
        if (response.status === 403) {
          toast.error('You are not authorized to update this expense');
        } else {
          toast.error(response.errors?.message || 'Failed to update expense');
        }
        return;
      } else if ('data' in response) {
        toast.success('Expense updated successfully!');
        router.push('/expenses');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense. Please try again.');
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Expense Details',
      description: 'Update expense information',
      icon: '1',
    },
  ];

  if (isLoading) {
    return (
      <section>
        <HeaderNavigation />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-4xl mx-auto w-full">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading expense data...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!expenseData) {
    return (
      <section>
        <HeaderNavigation />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-4xl mx-auto w-full">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Expense not found</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <HeaderNavigation />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="max-w-4xl mx-auto w-full">
          {/* Stepper */}
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${'bg-primary text-primary-foreground'}`}
                    >
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="mt-2 text-center">
                      <h3
                        className={`text-sm font-semibold ${'text-foreground'}`}
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
                      className={`flex-1 h-0.5 mx-4 transition-colors bg-primary`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card>
            <CardContent className="p-6">
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">Edit Expense</h1>
                  <p className="text-muted-foreground">
                    Update the details for your expense.
                  </p>
                </div>
                <ExpensesForm
                  onNext={handleExpenseSubmit}
                  initialData={expenseData}
                  isEditing={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
