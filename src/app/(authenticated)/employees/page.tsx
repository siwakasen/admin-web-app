"use client";
import { HeaderNavigation } from "@/components/shared/navbar/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteEmployee, useGetAllEmployees } from "@/hooks/employees.hook";
import { EmployeesTable } from "./_components/employees-table";
import { Employee } from "@/interfaces";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { ToastApi } from "@/lib/helper/toast-api";
import { toast } from "sonner";

interface EmployeesPageProps {
  employee?: Employee;
}

export default function EmployeesPage({ employee }: EmployeesPageProps) {
  console.log(employee);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateEmployee = () => {
    redirect("/employees/create");
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await useGetAllEmployees({
        limit: 10,
        page: currentPage,
      });
      if ('data' in response) {
        setEmployees(response.data);
        setMeta(response.meta);
      }
      // ToastApi(response);
      setLoading(false);
    };
    fetchData();
  }, [currentPage, refetch]);

  return (
    <section>
      <HeaderNavigation />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <div className="flex gap-2 justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Employees
                </CardTitle>
                <p className="text-muted-foreground">
                  Manage and view all employees
                </p>
              </div>
              <div>
                <Button 
                 onClick={handleCreateEmployee} disabled={employee?.role.id === 2} className="flex items-center gap-2 bg-green-600 hover:bg-green-700" variant="default">
                  <PlusSquare className="h-4 w-4" />
                  <span className="hidden md:block">Create New Employee</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <EmployeesTable
              employees={employees}
              meta={meta}
              loading={loading}
              onPageChange={handlePageChange}
              onRefetch={() => setRefetch(!refetch)}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
