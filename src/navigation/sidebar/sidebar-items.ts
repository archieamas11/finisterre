import { type LucideIcon, LibraryBig, CalendarDays, MonitorCog, MapIcon, LayoutGrid, Newspaper } from 'lucide-react'

export interface NavMainItem {
  url: string
  title: string
  isNew?: boolean
  newTab?: boolean
  icon?: LucideIcon
  subItems?: NavSubItem[]
}

export interface NavSubItem {
  url: string
  title: string
  isNew?: boolean
  newTab?: boolean
  icon?: LucideIcon
}

export interface NavGroup {
  id: number
  label?: string
  items: NavMainItem[]
}

export type UserRole = 'admin' | 'staff' | 'user'

export const getSidebarItems = (role: UserRole): NavGroup[] => {
  const items: NavMainItem[] = [
    {
      title: 'Home',
      url: '/admin',
      icon: LayoutGrid,
    },
    {
      icon: LibraryBig,
      title: 'Interment Setup',
      url: '/admin/interment-setup',
      subItems: [
        {
          title: 'Customers',
          url: '/admin/interment-setup/customers',
        },
        {
          title: 'Lot Owners',
          url: '/admin/interment-setup/lot-owners',
        },
        {
          title: 'Deceased Records',
          url: '/admin/interment-setup/deceased-records',
        },
      ],
    },
    {
      title: 'Map',
      icon: MapIcon,
      url: '/admin/map',
    },
    {
      title: 'Event Calendar',
      icon: CalendarDays,
      url: '/admin/bookings',
    },
    ...(!import.meta.env.PROD
      ? [
          {
            title: 'News & Announcements',
            icon: Newspaper,
            url: '/admin/news',
          },
        ]
      : []),
  ]

  if (role === 'admin') {
    items.push({
      icon: MonitorCog,
      title: 'Control Panel',
      url: '/admin/control-panel',
    })
  }

  return [
    {
      id: 1,
      label: role === 'admin' ? 'Admin Dashboard' : role === 'staff' ? 'Staff Dashboard' : 'Dashboard',
      items,
    },
  ]
}

export function findSidebarItemByPath(
  pathname: string,
  role: UserRole,
): {
  mainItem: NavMainItem
  subItem?: NavSubItem
} | null {
  const groups = getSidebarItems(role)
  for (const group of groups) {
    for (const mainItem of group.items) {
      if (mainItem.url === pathname) {
        return { mainItem }
      }
      if (mainItem.subItems) {
        const subItem = mainItem.subItems.find((s) => s.url === pathname)
        if (subItem) {
          return { subItem, mainItem }
        }
      }
    }
  }
  return null
}
