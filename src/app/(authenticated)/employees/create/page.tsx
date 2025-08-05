"use client";

import { HeaderNavigation } from "@/components/shared/navbar/header";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateEmployee } from "@/hooks/employees.hook";
import { toast } from "sonner";
import { CreateEmployeeResponse } from "@/interfaces";
import { CreateEmployeeSchemaType } from "@/lib/validations/employees.schemas";
import { useRouter } from "next/navigation";
import { CreateEmployeeForm } from "../_components/create-employee-form";

export default function CreateEmployeePage() {
  const router = useRouter();

  const handleEmployeeSubmit = async (data: CreateEmployeeSchemaType) => {
    try {
      const response: CreateEmployeeResponse | {status?: number, errors?: any} 
      = await useCreateEmployee(data);
      if('errors' in response) {
        if(response.status === 403) {
          toast.error("You are not authorized to create an employee");
        } else {
          toast.error(response.errors?.message || "Failed to create employee");
        }
        return;
      } else if('message' in response) {
        toast.success("Employee created successfully!");
        router.push("/employees");
      }        
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to create employee. Please try again.");
    }
  };

  return (
    <section>
      <HeaderNavigation />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="max-w-4xl mx-auto w-full">
          {/* Single Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground">
                  1
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-sm font-semibold text-foreground">
                    Employee Details
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Provide employee information
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <Card>
            <CardContent className="p-6">
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">
                    Create Employee
                  </h1>
                  <p className="text-muted-foreground">
                    Fill in the details for your new employee.
                  </p>
                </div>
                <CreateEmployeeForm onNext={handleEmployeeSubmit} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}