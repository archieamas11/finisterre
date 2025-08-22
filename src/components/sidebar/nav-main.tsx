// src/components/sidebar/nav-main.tsx
'use client'

import { ChevronRight } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'

import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible
} from '@/components/ui/collapsible'
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenu
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenuSubButton,
  SidebarGroupContent,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenu,
  useSidebar
} from '@/components/ui/sidebar'
import { type NavMainItem } from '@/navigation/sidebar/sidebar-items'

interface NavMainProps {
  readonly items: readonly NavMainItem[]
}

const NavItemExpanded = ({
  item,
  isActive,
  isSubmenuOpen
}: {
  isActive: (url: string, subItems?: NavMainItem['subItems']) => boolean
  isSubmenuOpen: (subItems?: NavMainItem['subItems']) => boolean
  item: NavMainItem
}) => {
  return (
    <Collapsible
      defaultOpen={isSubmenuOpen(item.subItems)}
      className='group/collapsible'
      key={item.title}
      asChild
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {item.subItems ? (
            <SidebarMenuButton
              isActive={isActive(item.url, item.subItems)}
              disabled={item.comingSoon}
              tooltip={item.title}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              aria-disabled={item.comingSoon}
              isActive={isActive(item.url)}
              tooltip={item.title}
              asChild
            >
              <Link target={item.newTab ? '_blank' : undefined} to={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </CollapsibleTrigger>
        {item.subItems && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subItems.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    aria-disabled={subItem.comingSoon}
                    isActive={isActive(subItem.url)}
                    asChild
                  >
                    <Link
                      target={subItem.newTab ? '_blank' : undefined}
                      to={subItem.url}
                    >
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  )
}

const NavItemCollapsed = ({
  item,
  isActive
}: {
  isActive: (url: string, subItems?: NavMainItem['subItems']) => boolean
  item: NavMainItem
}) => {
  return (
    <SidebarMenuItem key={item.title}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            isActive={isActive(item.url, item.subItems)}
            disabled={item.comingSoon}
            tooltip={item.title}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-50 space-y-1'
          align='start'
          side='right'
        >
          {item.subItems?.map((subItem) => (
            <DropdownMenuItem key={subItem.title} asChild>
              <SidebarMenuSubButton
                aria-disabled={subItem.comingSoon}
                className='focus-visible:ring-0'
                isActive={isActive(subItem.url)}
                key={subItem.title}
                asChild
              >
                <Link
                  target={subItem.newTab ? '_blank' : undefined}
                  to={subItem.url}
                >
                  {subItem.icon && (
                    <subItem.icon className='[&>svg]:text-sidebar-foreground' />
                  )}
                  <span>{subItem.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export function NavMain({ items }: NavMainProps) {
  const location = useLocation()
  const path = location.pathname
  const { state, isMobile } = useSidebar()

  const isItemActive = (url: string, subItems?: NavMainItem['subItems']) => {
    if (subItems?.length) {
      return subItems.some((sub) => path.startsWith(sub.url))
    }
    return path === url
  }

  const isSubmenuOpen = (subItems?: NavMainItem['subItems']) => {
    return subItems?.some((sub) => path.startsWith(sub.url)) ?? false
  }

  return (
    <SidebarGroupContent className='flex flex-col gap-2'>
      <SidebarMenu>
        {items.map((item) => {
          if (state === 'collapsed' && !isMobile) {
            // If no subItems, just render the button as a link
            if (!item.subItems) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isItemActive(item.url)}
                    aria-disabled={item.comingSoon}
                    tooltip={item.title}
                    asChild
                  >
                    <Link
                      target={item.newTab ? '_blank' : undefined}
                      to={item.url}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }
            // Otherwise, render the dropdown as before
            return (
              <NavItemCollapsed
                isActive={isItemActive}
                key={item.title}
                item={item}
              />
            )
          }
          // Expanded view
          return (
            <NavItemExpanded
              isSubmenuOpen={isSubmenuOpen}
              isActive={isItemActive}
              key={item.title}
              item={item}
            />
          )
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  )
}
