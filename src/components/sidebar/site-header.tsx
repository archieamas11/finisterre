import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger, } from "@/components/ui/sidebar"
import { useDarkMode } from "@/hooks/useDarkMode"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import React from "react"
import { Sun, Moon } from "lucide-react"

export function SiteHeader({ activeItem }: { activeItem?: { title: string; url: string } }) {
  const { isDark, toggleDarkMode } = useDarkMode();
  // Add system theme support
  const [theme, setTheme] = React.useState<'system' | 'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'system' | 'light' | 'dark' || 'system';
    }
    return 'system';
  });

  const handleThemeChange = (value: 'system' | 'light' | 'dark') => {
    setTheme(value);
    localStorage.setItem('theme', value);
    if (value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark !== isDark) toggleDarkMode();
    } else if ((value === 'dark') !== isDark) {
      toggleDarkMode();
    }
  };

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
          <Button
            variant="default"
            size="sm"
            className="hidden sm:flex bg-foreground text-background dark:bg-primary dark:text-foreground"
            onClick={() =>
              handleThemeChange(theme === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header >
  );
}