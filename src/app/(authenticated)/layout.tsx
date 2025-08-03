"use server";
import { AppSidebar } from "@/components/shared/navbar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useGetEmployee } from "@/hooks/employees.hook";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { employee } = await useGetEmployee();

  if (!employee) {
    redirect("/redirect/reset-cookie");
  }
  return (
    <SidebarProvider>
      <AppSidebar employee={employee} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
