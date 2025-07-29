// src/config/sidebar-items.ts
import {
  LayoutDashboard,
  ChartBar,
  type LucideIcon,
  MapIcon,
  Users,
  PaintBucket,
  User,
  Home,
  ToggleLeft
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
        subItems: [
          {
            title: "Manage Customers",
            url: "/admin/interment-setup/customers",
            newTab: false,
          },
          {
            title: "Manage Lot Owners",
            url: "/admin/interment-setup/lot-owners",
            newTab: false,
          },
          {
            title: "Manage Deceased Records",
            url: "/admin/interment-setup/deceased-records",
            newTab: false,
          },
        ],
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
      {
        title: "Control Panel",
        url: "/admin/control-panel",
        icon: ToggleLeft,
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
  isAdmin: boolean
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
          return { mainItem, subItem };
        }
      }
    }
  }
  return null;
}
