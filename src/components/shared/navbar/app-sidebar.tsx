"use client";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LucideLayoutDashboard,
  TreePalm,
  Car,
  IdCardLanyardIcon,
  CalendarSyncIcon,
  CalendarCheck,
  BanknoteArrowDown,
  BanknoteArrowUp,
} from "lucide-react";

import { NavDataMasters } from "@/components/shared/navbar/nav-data-masters";
import { NavOperationals } from "@/components/shared/navbar/nav-operationals";
import { NavUser } from "@/components/shared/navbar/nav-user";
import { TeamSwitcher } from "@/components/shared/navbar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Employee } from "@/interfaces";

const adminData = {
  teams: [
    {
      name: "Ride Bali Explore",
      plan: "",
    },
  ],
  masters: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LucideLayoutDashboard,
      isActive: true,
    },
    {
      title: "Travel Packages",
      url: "/travel-packages",
      icon: TreePalm,
    },
    {
      title: "Cars",
      url: "/cars",
      icon: Car,
    },
  ],
  operationals: [
    {
      name: "Bookings",
      url: "/bookings",
      icon: CalendarCheck,
    },
    {
      name: "Rescheduling",
      url: "/rescheduling",
      icon: CalendarSyncIcon,
    },
    { name: "Payments", url: "/payments", icon: BanknoteArrowUp },
    {
      name: "Refunds",
      url: "/refunds",
      icon: BanknoteArrowDown,
    },
  ],
};

const ownerData = {
  teams: [
    {
      name: "Ride Bali Explore",
      plan: "",
    },
  ],
  operationals: [
    {
      name: "Bookings",
      url: "/bookings",
      icon: CalendarCheck,
    },
  ],
  masters: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: CalendarCheck,
    },
    {
      title: "Employees",
      url: "/employees",
      icon: IdCardLanyardIcon,
    },
  ],
};

export function AppSidebar({
  employee,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  employee: Employee;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={employee.role.id === 1 ? ownerData.teams : adminData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavDataMasters items={employee.role.id === 1 ? ownerData.masters : adminData.masters} />
        <NavOperationals operationals={employee.role.id === 1 ? ownerData.operationals : adminData.operationals} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={employee} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
