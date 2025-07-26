import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"



export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
  }[]
    activeItem?: {
    title: string
    url: string
    icon: LucideIcon
  }
}) {
  const location = useLocation();
  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = location.pathname === item.url;
  
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={
                isActive
                  ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground transition-colors duration-300"
                  :  "p-4"
              }
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}