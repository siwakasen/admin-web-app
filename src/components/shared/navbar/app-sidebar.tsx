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
import { toast } from "sonner";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
    {
      title: "Employees",
      url: "/employees",
      icon: IdCardLanyardIcon,
    },
  ],
  projects: [
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

export function AppSidebar({
  employee,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  employee: Employee;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavDataMasters items={data.masters} />
        <NavOperationals projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={employee} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
