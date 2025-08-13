import { BellIcon } from "lucide-react";

import type {
  NavMainItem,
  NavSubItem,
} from "@/navigation/sidebar/sidebar-items";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  Breadcrumb,
} from "@/components/ui/breadcrumb";

import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";

interface SiteHeaderProps {
  breadcrumbItem?: {
    mainItem: NavMainItem;
    subItem?: NavSubItem;
  } | null;
}

export function SiteHeader({ breadcrumbItem }: SiteHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b gap-2 pr-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href={
                  breadcrumbItem?.mainItem
                    ? breadcrumbItem.mainItem.url
                    : "/admin"
                }
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            {breadcrumbItem ? (
              breadcrumbItem.subItem ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={breadcrumbItem.mainItem.url}>
                      {breadcrumbItem.mainItem.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {breadcrumbItem.subItem.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumbItem.mainItem.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>Loading...</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggleButton start="top-right" variant="circle-blur" />
          <Button
            className="hover:border-accent-foreground hidden cursor-pointer border border-transparent hover:bg-transparent focus:bg-transparent sm:flex"
            aria-label="Notifications"
            variant="ghost"
            size="sm"
          >
            <BellIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
