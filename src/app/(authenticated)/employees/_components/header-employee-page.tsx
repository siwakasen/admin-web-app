'use client';

import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { PlusSquare } from 'lucide-react';
import { redirect } from 'next/navigation';

export function HeaderEmployeePage() {
  const handleCreateEmployee = () => {
    redirect('/employees/create');
  };
  return (
    <div className="flex gap-2 justify-between items-center">
      <div>
        <CardTitle className="text-2xl font-bold">Employees</CardTitle>
        <p className="text-muted-foreground">Manage and view all employees</p>
      </div>
      <div>
        <Button
          onClick={handleCreateEmployee}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer"
          variant="default"
        >
          <PlusSquare className="h-4 w-4" />
          <span className="hidden md:block">Create New Employee</span>
        </Button>
      </div>
    </div>
  );
}
