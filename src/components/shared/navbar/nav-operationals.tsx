import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavOperationals({
  operationals,
}: {
  operationals: {
    name: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon: LucideIcon;
    }[];
  }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Operationals</SidebarGroupLabel>
      <SidebarMenu>
        {operationals.map((item) => (
          <div key={item.name}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {item.items?.map((subItem) => (
              <SidebarMenuItem key={subItem.title}>
                <SidebarMenuButton asChild className="pl-2">
                  <Link href={subItem.url} className="flex items-center">
                    <div className="w-1 h-px bg-muted-foreground/30 mr-2 flex-shrink-0" />
                    {subItem.icon && <subItem.icon className="w-4 h-4" />}
                    <span className="ml-2">{subItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
