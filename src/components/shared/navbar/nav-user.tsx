'use client';

import {
  BadgeCheck,
  Bell,
  Car,
  ChevronsUpDown,
  CreditCard,
  Crown,
  LogOut,
  ShieldUser,
  Sparkles,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Employee } from '@/interfaces';
import { toast } from 'sonner';
import { useLogoutUser } from '@/hooks/employees.hook';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export function NavUser({ user }: { user: Employee }) {
  const { isMobile } = useSidebar();
  const handleLogout = async () => {
    const { message } = await useLogoutUser();
    toast.error(message);
    redirect('/');
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {user.role.id === 1 ? (
                    <Crown className="h-4 w-4 text-yellow-600" />
                  ) : user.role.id === 2 ? (
                    <ShieldUser className="h-4 w-4 text-green-600" />
                  ) : user.role.id === 3 ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Car className="h-4 w-4 text-red-600" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={'/images/logo.png'} alt={user.name} />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="h-4 w-full justify-start text-sm cursor-pointer"
              >
                <LogOut />
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
