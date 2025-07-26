// src/config/sidebar-items.ts
import {
  LayoutDashboard,
  ChartBar,
  type LucideIcon,
  MapIcon,
  Users,
  PaintBucket,
  User,
  Home
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

// Admin sidebar items
export const adminSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Admin Dashboard",
    items: [
      {
        title: "Home",
        url: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Interment Setup",
        url: "/admin/interment-setup",
        icon: ChartBar,
      },
      {
        title: "Map",
        url: "/admin/map",
        icon: MapIcon,
      },
      {
        title: "Services",
        url: "/admin/services",
        icon: PaintBucket,
      },
      {
        title: "Manage Accounts",
        url: "/admin/manage-accounts",
        icon: Users,
      },
    ],
  },
];

// User sidebar items
export const userSidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "User Dashboard",
    items: [
      {
        title: "Home",
        url: "/user",
        icon: Home,
      },
      {
        title: "My Profile",
        url: "/user/profile",
        icon: User,
      },
      {
        title: "My Services",
        url: "/user/services",
        icon: PaintBucket,
      },
      {
        title: "Map",
        url: "/user/map",
        icon: MapIcon,
      },
    ],
  },
];

// Function to get sidebar items based on role
export const getSidebarItems = (isAdmin: boolean): NavGroup[] => {
  return isAdmin ? adminSidebarItems : userSidebarItems;
};