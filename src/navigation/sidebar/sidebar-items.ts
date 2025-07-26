import {
  LayoutDashboard,
  ChartBar,
  type LucideIcon,
  MapIcon,
  Users,
  PaintBucket
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

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Home",
        url: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Interment",
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
        title: "Users",
        url: "/admin/manage-accounts",
        icon: Users,
      },
    ],
  },
];
