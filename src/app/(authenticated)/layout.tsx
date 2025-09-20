'use server';
import { AppSidebar } from '@/components/shared/navbar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useGetEmployee } from '@/hooks/employees.hook';
import { redirect } from 'next/navigation';
import GlobalChatProvider from '@/components/shared/global-chat-provider';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { employee } = await useGetEmployee();
  console.log(employee);

  if (!employee) {
    redirect('/redirect/reset-cookie');
  }
  return (
    <SidebarProvider>
      <AppSidebar employee={employee} />
      <SidebarInset>
        {children}
        <GlobalChatProvider employeeId={employee.id} />
      </SidebarInset>
    </SidebarProvider>
  );
}
