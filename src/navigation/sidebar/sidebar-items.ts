// src/config/sidebar-items.ts
import {
  LayoutDashboard,
  type LucideIcon,
  CalendarDays,
  PaintBucket,
  MonitorCog,
  ChartBar,
  MapIcon,
  User,
  Home,
} from "lucide-react";

export interface NavMainItem {
  url: string;
  title: string;
  isNew?: boolean;
  newTab?: boolean;
  icon?: LucideIcon;
  comingSoon?: boolean;
  subItems?: NavSubItem[];
}

export interface NavSubItem {
  url: string;
  title: string;
  isNew?: boolean;
  newTab?: boolean;
  icon?: LucideIcon;
  comingSoon?: boolean;
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
        icon: ChartBar,
        title: "Interment Setup",
        url: "/admin/interment-setup",
        subItems: [
          {
            newTab: false,
            title: "Manage Customers",
            url: "/admin/interment-setup/customers",
          },
          {
            newTab: false,
            title: "Manage Lot Owners",
            url: "/admin/interment-setup/lot-owners",
          },
          {
            newTab: false,
            title: "Manage Deceased Records",
            url: "/admin/interment-setup/deceased-records",
          },
        ],
      },
      {
        title: "Map",
        icon: MapIcon,
        url: "/admin/map",
      },
      {
        title: "Bookings",
        icon: CalendarDays,
        url: "/admin/bookings",
      },
      {
        icon: MonitorCog,
        title: "Control Panel",
        url: "/admin/control-panel",
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
        icon: Home,
        url: "/user",
        title: "Home",
      },
      {
        icon: User,
        title: "My Profile",
        url: "/user/profile",
      },
      {
        icon: PaintBucket,
        title: "My Services",
        url: "/user/services",
      },
      {
        title: "Map",
        icon: MapIcon,
        url: "/user/map",
      },
    ],
  },
];

export const getSidebarItems = (isAdmin: boolean): NavGroup[] => {
  return isAdmin ? adminSidebarItems : userSidebarItems;
};

/**
 * Finds the main and sub sidebar item for a given pathname.
 * Returns { mainItem, subItem } or null if not found.
 * Used for Breadcrumbs that support subItems.
 */
export function findSidebarItemByPath(
  pathname: string,
  isAdmin: boolean,
): {
  mainItem: NavMainItem;
  subItem?: NavSubItem;
} | null {
  const groups = getSidebarItems(isAdmin);
  for (const group of groups) {
    for (const mainItem of group.items) {
      if (mainItem.url === pathname) {
        return { mainItem };
      }
      if (mainItem.subItems) {
        const subItem = mainItem.subItems.find((s) => s.url === pathname);
        if (subItem) {
          return { subItem, mainItem };
        }
      }
    }
  }
  return null;
}
