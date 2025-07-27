import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger, } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { ThemeToggleAdvanced } from "../ThemeToggleAdvanced"
import { BellIcon } from "lucide-react"

export function SiteHeader({ activeItem }: { activeItem?: { title: string; url: string } }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              {activeItem ? (
                <>
                  <BreadcrumbLink href={activeItem.url}>{activeItem.title}</BreadcrumbLink>
                </>
              ) : (
                <BreadcrumbPage>Loading...</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggleAdvanced />
          <Button variant="ghost" size="sm" className="hidden sm:flex" aria-label="Notifications">
            <BellIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header >
  );
}