import {
  ChevronDownIcon,
  type LucideIcon,
  MapPinIcon,
  ClockIcon,
  MenuIcon,
  BoneIcon,
  LayersIcon,
  TreesIcon,
  Building2Icon,
  ArrowLeftRightIcon,
} from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type NavItem = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

// Products (Our Products)
const products: NavItem[] = [
  {
    icon: TreesIcon,
    title: 'Serenity Lawn',
    href: '/#products',
    description: 'Double-depth in-ground burial plot with marble marker and well-manicured grass.',
  },
  {
    icon: LayersIcon,
    title: 'Columbarium (Niche)',
    href: '/#products',
    description: 'Best-in-class burial unit crafted with premium concrete and marble markers.',
  },
  {
    icon: BoneIcon,
    title: 'Bone Chamber & Ash Vault',
    href: '/#productsn',
    description: 'Concrete repository for bone and ash remains at the upper park level with garden views.',
  },
  {
    icon: Building2Icon,
    title: 'Family Estate',
    href: '/#products',
    description: 'A sacred way to honor family—an estate of your own.',
  },
]

// Services (Our Services)
const coreServices: NavItem[] = [
  {
    icon: MapPinIcon,
    title: 'Interment',
    href: '/#products',
    description: 'Complete interment services with modern equipment and dignified care.',
  },
  {
    icon: ArrowLeftRightIcon,
    title: 'Transfer & Reburial',
    href: '/#products',
    description: 'Careful relocation of remains including documentation and coordination.',
  },
  {
    icon: ClockIcon,
    title: 'Exhumation & Reburial',
    href: '/#products',
    description: 'For fresh, skeletal, and cinerary remains handled with utmost respect.',
  },
]

// Mobile menu item component
const MobileMenuItem = ({
  href,
  title,
  children,
  onSelect,
  icon: Icon,
}: {
  children?: React.ReactNode
  onSelect?: () => void
  icon?: LucideIcon
  title: string
  href: string
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (children) {
    return (
      <div className="border-b border-gray-200">
        <button
          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex w-full items-center justify-between px-4 py-3 text-left"
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        >
          <span className="font-medium">{title}</span>
          <ChevronDownIcon className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </button>
        {isOpen && <div className="bg-background pb-2">{children}</div>}
      </div>
    )
  }

  return (
    <Link
      className="hover:bg-accent hover:text-accent-foreground focus:bg-background focus:text-foreground flex items-center gap-3 border-b border-gray-200 px-4 py-3"
      onClick={onSelect}
      to={href}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span className="font-medium">{title}</span>
    </Link>
  )
}

// Mobile submenu item
const MobileSubMenuItem = ({
  href,
  title,
  onSelect,
  icon: Icon,
  description,
}: {
  onSelect?: () => void
  description: string
  icon: LucideIcon
  title: string
  href: string
}) => {
  return (
    <Link
      className="hover:bg-accent hover:text-foreground focus:bg-background focus:text-foreground flex items-start gap-3 px-6 py-2"
      onClick={onSelect}
      to={href}
    >
      <Icon className="mt-1 h-4 w-4 flex-shrink-0" />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="mt-1 text-xs text-gray-600">{description}</div>
      </div>
    </Link>
  )
}

export function NavigationMenuSection() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMobileMenuClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <NavigationMenu className="z-20 hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), 'bg-transparent', {
                'text-[var(--brand-primary)]': scrolled,
                'text-white': !scrolled,
              })}
              asChild
            >
              <Link to="/#hero">Home</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(navigationMenuTriggerStyle(), 'bg-transparent', {
                'text-[var(--brand-primary)]': scrolled,
                'text-white': !scrolled,
              })}
            >
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-4">
              <div className="grid w-[900px] grid-cols-3 gap-3 divide-x p-4">
                <div className="col-span-2">
                  <h6 className="text-muted-foreground pl-2.5 text-sm font-semibold uppercase">Our Products</h6>
                  <ul className="mt-2.5 grid grid-cols-2 gap-3">
                    {products.map((product) => (
                      <ListItem title={product.title} key={product.title} icon={product.icon} to={product.href}>
                        {product.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>
                <div className="pl-4">
                  <h6 className="text-muted-foreground pl-2.5 text-sm font-semibold uppercase">Highlights</h6>
                  <ul className="mt-2.5 grid gap-3">
                    {products.slice(0, 3).map((product) => (
                      <ListItem title={product.title} key={product.title} icon={product.icon} to={product.href}>
                        {product.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(navigationMenuTriggerStyle(), 'bg-transparent', {
                'text-[var(--brand-primary)]': scrolled,
                'text-white': !scrolled,
              })}
            >
              Services
            </NavigationMenuTrigger>
            <NavigationMenuContent className="px-4 py-6">
              <div className="pl-4">
                <h6 className="text-muted-foreground pl-2.5 text-sm font-semibold uppercase">Our Services</h6>
                <ul className="mt-2.5 grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {coreServices.map((svc) => (
                    <ListItem title={svc.title} key={svc.title} icon={svc.icon} to={svc.href}>
                      {svc.description}
                    </ListItem>
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), 'bg-transparent', {
                'text-[var(--brand-primary)]': scrolled,
                'text-white': !scrolled,
              })}
              asChild
            >
              <Link to="/about">About</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={cn(navigationMenuTriggerStyle(), 'bg-transparent', {
                'text-[var(--brand-primary)]': scrolled,
                'text-white': !scrolled,
              })}
              asChild
            >
              <Link to="/#contact">Contact</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <div className="w-full md:hidden">
        <div className="flex items-center gap-2 p-2 py-8 lg:py-0">
          <Sheet onOpenChange={setIsOpen} open={isOpen}>
            <SheetTrigger asChild>
              <Button className="absolute left-12" variant="ghost" size="icon" type="button">
                <MenuIcon
                  className={cn('h-6 w-6', {
                    'text-[var(--brand-primary)]': scrolled,
                    'text-white': !scrolled,
                  })}
                />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80 p-0" side="left">
              {/* Accessibility: Add DialogTitle and Description for SheetContent using shadcn primitives */}
              <SheetHeader className="border-b">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu for mobile users</SheetDescription>
              </SheetHeader>
              <div className="flex flex-1 flex-col overflow-y-auto">
                <nav className="py-2">
                  <MobileMenuItem onSelect={handleMobileMenuClose} title="Home" href="/#hero" />
                  <MobileMenuItem title="Products" href="#">
                    <div className="bg-background py-2">
                      <div className="px-6 py-2">
                        <h6 className="text-xs font-semibold text-gray-500 uppercase">Our Products</h6>
                      </div>
                      {products.map((product) => (
                        <MobileSubMenuItem
                          description={product.description}
                          onSelect={handleMobileMenuClose}
                          title={product.title}
                          key={product.title}
                          href={product.href}
                          icon={product.icon}
                        />
                      ))}
                    </div>
                  </MobileMenuItem>
                  <MobileMenuItem title="Services" href="#">
                    <div className="py-2">
                      <div className="px-6 py-2">
                        <h6 className="text-xs font-semibold text-gray-500 uppercase">Our Services</h6>
                      </div>
                      {coreServices.map((svc) => (
                        <MobileSubMenuItem
                          onSelect={handleMobileMenuClose}
                          description={svc.description}
                          title={svc.title}
                          key={svc.title}
                          href={svc.href}
                          icon={svc.icon}
                        />
                      ))}
                    </div>
                  </MobileMenuItem>
                  <MobileMenuItem onSelect={handleMobileMenuClose} title="About" href="/about" />
                  <MobileMenuItem onSelect={handleMobileMenuClose} title="Contact" href="/#contact" />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  {
    children?: React.ReactNode
    icon: LucideIcon
    title: string
    to: string
  } & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'>
>(({ to, title, children, className, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-start gap-3 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none',
            className,
          )}
          ref={ref}
          to={to}
          {...props}
        >
          {Icon && <Icon className="mt-1 h-5 w-5 flex-shrink-0" />}
          <div>
            <div className="text-sm font-medium">{title}</div>
            {children && <div className="text-muted-foreground mt-1 text-xs">{children}</div>}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
