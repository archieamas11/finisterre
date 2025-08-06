import * as React from "react";
import { Link } from "react-router-dom";
import {
    ChevronDownIcon,
    type LucideIcon,
    CalendarIcon,
    MapPinIcon,
    ShieldIcon,
    UsersIcon,
    PhoneIcon,
    ClockIcon,
    HeartIcon,
    LeafIcon,
    MenuIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SheetDescription, SheetContent, SheetTrigger, SheetHeader, SheetTitle, Sheet } from "@/components/ui/sheet";
import {
    navigationMenuTriggerStyle,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenu,
} from "@/components/ui/navigation-menu";

// Sample services data
const services: {
    description: string;
    icon: LucideIcon;
    title: string;
    href: string;
}[] = [
        {
            icon: LeafIcon,
            title: "Memorial Plots",
            href: "/services/memorial-plots",
            description: "Beautifully landscaped plots for honoring your loved ones in a serene environment.",
        },
        {
            icon: CalendarIcon,
            title: "Event Planning",
            href: "/services/event-planning",
            description: "Custom memorial services and celebrations of life tailored to your family's needs.",
        },
        {
            icon: LeafIcon,
            title: "Garden Maintenance",
            href: "/services/garden-maintenance",
            description: "Professional care for memorial gardens to keep them pristine year-round.",
        },
        {
            icon: UsersIcon,
            title: "Family Services",
            href: "/services/family-services",
            description: "Special packages for families with multiple memorial needs.",
        },
        {
            icon: HeartIcon,
            title: "Custom Memorials",
            href: "/services/custom-memorials",
            description: "Personalized monuments and markers to celebrate unique lives.",
        },
        {
            icon: MapPinIcon,
            title: "Virtual Tours",
            href: "/services/virtual-tours",
            description: "Explore our memorial park from anywhere with our 360° virtual tour.",
        },
    ];

// Sample FAQs data
const faqs: {
    description: string;
    icon: LucideIcon;
    title: string;
    href: string;
}[] = [
        {
            icon: ClockIcon,
            title: "Visiting Hours",
            href: "/faqs/visiting-hours",
            description: "What are the park's opening and closing times?",
        },
        {
            icon: CalendarIcon,
            title: "Reservation Process",
            href: "/faqs/reservation-process",
            description: "How to book a memorial plot or service?",
        },
        {
            icon: LeafIcon,
            title: "Maintenance Policy",
            href: "/faqs/maintenance-policy",
            description: "How is the garden maintained and cared for?",
        },
        {
            icon: UsersIcon,
            title: "Pet Policy",
            href: "/faqs/pet-policy",
            description: "Are pets allowed in the memorial park?",
        },
        {
            icon: PhoneIcon,
            title: "Contact Us",
            href: "/faqs/contact-us",
            description: "How to reach our customer service team?",
        },
        {
            icon: ShieldIcon,
            title: "Privacy & Security",
            href: "/faqs/privacy-security",
            description: "How do we protect visitor information?",
        },
    ];

// Mobile menu item component
const MobileMenuItem = ({
    href,
    title,
    children,
    onSelect,
    icon: Icon
}: {
    children?: React.ReactNode;
    onSelect?: () => void;
    icon?: LucideIcon;
    title: string;
    href: string;
}) => {
    if (children) {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
            <div className="border-b border-gray-200">
                <button
                    className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={() => { setIsOpen(!isOpen); }}
                >
                    <span className="font-medium">{title}</span>
                    <ChevronDownIcon
                        className={cn(
                            "h-4 w-4 transition-transform",
                            isOpen && "rotate-180"
                        )}
                    />
                </button>
                {isOpen && (
                    <div className="pb-2 bg-background">
                        {children}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 hover:bg-accent hover:text-accent-foreground focus:bg-background focus:text-foreground"
            onClick={onSelect}
            to={href}
        >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="font-medium">{title}</span>
        </Link>
    );
};

// Mobile submenu item
const MobileSubMenuItem = ({
    href,
    title,
    onSelect,
    icon: Icon,
    description
}: {
    onSelect?: () => void;
    description: string;
    icon: LucideIcon;
    title: string;
    href: string;
}) => {
    return (
        <Link
            className="flex items-start gap-3 px-6 py-2 hover:bg-accent hover:text-foreground focus:bg-background focus:text-foreground"
            onClick={onSelect}
            to={href}
        >
            <Icon className="h-4 w-4 mt-1 flex-shrink-0" />
            <div>
                <div className="font-medium text-sm">{title}</div>
                <div className="text-xs text-gray-600 mt-1">{description}</div>
            </div>
        </Link>
    );
};

export function NavigationMenuSection() {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleMobileMenuClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Desktop Navigation */}
            <NavigationMenu className="z-20 hidden md:flex">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")} asChild>
                            <Link to="/home">Home</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent">Services</NavigationMenuTrigger>
                        <NavigationMenuContent className="p-4">
                            <div className="grid grid-cols-3 gap-3 p-4 w-[900px] divide-x">
                                <div className="col-span-2">
                                    <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                                        Our Services
                                    </h6>
                                    <ul className="mt-2.5 grid grid-cols-2 gap-3">
                                        {services.map((service) => (
                                            <ListItem
                                                title={service.title}
                                                key={service.title}
                                                icon={service.icon}
                                                to={service.href}
                                            >
                                                {service.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pl-4">
                                    <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                                        Special Features
                                    </h6>
                                    <ul className="mt-2.5 grid gap-3">
                                        {services.slice(0, 3).map((service) => (
                                            <ListItem
                                                title={service.title}
                                                key={service.title}
                                                icon={service.icon}
                                                to={service.href}
                                            >
                                                {service.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")} asChild>
                            <Link to="/about">About</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")} asChild>
                            <Link to="/location">Location</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent">FAQs</NavigationMenuTrigger>
                        <NavigationMenuContent className="px-4 py-6">
                            <div className="pl-4">
                                <h6 className="pl-2.5 font-semibold uppercase text-sm text-muted-foreground">
                                    Frequently Asked Questions
                                </h6>
                                <ul className="mt-2.5 grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    {faqs.map((faq) => (
                                        <ListItem
                                            title={faq.title}
                                            key={faq.title}
                                            icon={faq.icon}
                                            to={faq.href}
                                        >
                                            {faq.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Navigation */}
            <div className="md:hidden w-full">
                <div className="flex items-center justify-end gap-2 p-2">
                    <Sheet onOpenChange={setIsOpen} open={isOpen}>
                        <SheetTrigger asChild>
                            <Button className="h-10 w-10" variant="ghost" size="icon">
                                <MenuIcon className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-80 p-0" side="left">
                            {/* Accessibility: Add DialogTitle and Description for SheetContent using shadcn primitives */}
                            <SheetHeader className="border-b">
                                <SheetTitle>Menu</SheetTitle>
                                <SheetDescription className="sr-only">Main navigation menu for mobile users</SheetDescription>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto flex flex-col">
                                <nav className="py-2">
                                    <MobileMenuItem
                                        onSelect={handleMobileMenuClose}
                                        title="Home"
                                        href="/home"
                                    />
                                    <MobileMenuItem title="Services" href="#">
                                        <div className="py-2 bg-background">
                                            <div className="px-6 py-2">
                                                <h6 className="font-semibold uppercase text-xs text-gray-500">
                                                    Our Services
                                                </h6>
                                            </div>
                                            {services.map((service) => (
                                                <MobileSubMenuItem
                                                    description={service.description}
                                                    onSelect={handleMobileMenuClose}
                                                    title={service.title}
                                                    key={service.title}
                                                    href={service.href}
                                                    icon={service.icon}
                                                />
                                            ))}
                                        </div>
                                    </MobileMenuItem>
                                    <MobileMenuItem
                                        onSelect={handleMobileMenuClose}
                                        title="About"
                                        href="/about"
                                    />
                                    <MobileMenuItem
                                        onSelect={handleMobileMenuClose}
                                        title="Location"
                                        href="/location"
                                    />
                                    <MobileMenuItem title="FAQs" href="#">
                                        <div className="py-2">
                                            <div className="px-6 py-2">
                                                <h6 className="font-semibold uppercase text-xs text-gray-500">
                                                    Frequently Asked Questions
                                                </h6>
                                            </div>
                                            {faqs.map((faq) => (
                                                <MobileSubMenuItem
                                                    onSelect={handleMobileMenuClose}
                                                    description={faq.description}
                                                    title={faq.title}
                                                    key={faq.title}
                                                    href={faq.href}
                                                    icon={faq.icon}
                                                />
                                            ))}
                                        </div>
                                    </MobileMenuItem>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<typeof Link>,
    { children?: React.ReactNode; icon: LucideIcon; title: string; to: string } & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'>
>(({ to, title, children, className, icon: Icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    className={cn(
                        "flex select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground items-start gap-3",
                        className
                    )}
                    ref={ref as any}
                    to={to}
                    {...props}
                >
                    {Icon && <Icon className="h-5 w-5 mt-1 flex-shrink-0" />}
                    <div>
                        <div className="font-medium text-sm">{title}</div>
                        {children && <div className="text-xs text-muted-foreground mt-1">{children}</div>}
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";