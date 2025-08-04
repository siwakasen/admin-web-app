import { HeaderNavigation } from "@/components/shared/navbar/header";
import { useGetEmployee } from "@/hooks/employees.hook";
import { redirect } from "next/navigation";
import { ReactNode, cloneElement, isValidElement } from "react";
import { Employee } from "@/interfaces";

export default async function EmployeesLayout({ children }: { children: ReactNode }) {
  const { employee } = await useGetEmployee();

  // Pass employee data to children
  const childrenWithEmployee = isValidElement(children)
    ? cloneElement(children, { employee } as any)
    : children;

  return (
    <section>
      {childrenWithEmployee}
    </section>  
  );
}