"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HeaderNavigation } from "@/components/shared/navbar/header";
import { Card, CardContent } from "@/components/ui/card";
import { EditEmployeeForm } from "@/app/(authenticated)/employees/_components/edit-employee-form";
import { useGetAllEmployees, useGetEmployeeById, useUpdateEmployee } from "@/hooks/employees.hook";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { UpdateEmployeeResponse, Employee } from "@/interfaces";
import { UpdateEmployeeSchemaType } from "@/lib/validations/employees.schemas";
import { useRouter } from "next/navigation";



export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = Number(params.id);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await useGetEmployeeById(employeeId);
        if ('data' in response) {
          setEmployeeData(response.data);
        } else {
          toast.error("Failed to fetch employee data");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Failed to fetch employee data");
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const handleEmployeeSubmit = async (data: UpdateEmployeeSchemaType) => {
    console.log(data);
    try {
      const response: UpdateEmployeeResponse | {status?: number, errors?: any} = await useUpdateEmployee(employeeId, data);
      if('errors' in response) {
        if(response.status === 403) {
          toast.error("You are not authorized to update this employee");
        } else {
          toast.error(response.errors?.message || "Failed to update employee");
        }
        return;
      } else if('message' in response) {
        toast.success("Employee updated successfully!");
        router.push("/employees");
      }        
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee. Please try again.");
    }
  };

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
                  <span className="ml-2">Loading employee data...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!employeeData) {
    return (
      <section>
        <HeaderNavigation />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="max-w-4xl mx-auto w-full">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Employee not found</p>
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
                    Update employee information
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
                    Edit Employee
                  </h1>
                  <p className="text-muted-foreground">
                    Update the details for employee: {employeeData.name}
                  </p>
                </div>
                <EditEmployeeForm 
                  onNext={handleEmployeeSubmit} 
                  initialData={employeeData}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
