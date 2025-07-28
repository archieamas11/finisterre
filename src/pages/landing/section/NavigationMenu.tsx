import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    LeafIcon,
    MapPinIcon,
    CalendarIcon,
    UsersIcon,
    PhoneIcon,
    ClockIcon,
    ShieldIcon,
    HeartIcon,
    MenuIcon,
    ChevronDownIcon,
    type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import * as React from "react";

// Sample services data
const services: {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon;
}[] = [
        {
            title: "Memorial Plots",
            href: "/services/memorial-plots",
            description: "Beautifully landscaped plots for honoring your loved ones in a serene environment.",
            icon: LeafIcon,
        },
        {
            title: "Event Planning",
            href: "/services/event-planning",
            description: "Custom memorial services and celebrations of life tailored to your family's needs.",
            icon: CalendarIcon,
        },
        {
            title: "Garden Maintenance",
            href: "/services/garden-maintenance",
            description: "Professional care for memorial gardens to keep them pristine year-round.",
            icon: LeafIcon,
        },
        {
            title: "Family Services",
            href: "/services/family-services",
            description: "Special packages for families with multiple memorial needs.",
            icon: UsersIcon,
        },
        {
            title: "Custom Memorials",
            href: "/services/custom-memorials",
            description: "Personalized monuments and markers to celebrate unique lives.",
            icon: HeartIcon,
        },
        {
            title: "Virtual Tours",
            href: "/services/virtual-tours",
            description: "Explore our memorial park from anywhere with our 360° virtual tour.",
            icon: MapPinIcon,
        },
    ];

// Sample FAQs data
const faqs: {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon;
}[] = [
        {
            title: "Visiting Hours",
            href: "/faqs/visiting-hours",
            description: "What are the park's opening and closing times?",
            icon: ClockIcon,
        },
        {
            title: "Reservation Process",
            href: "/faqs/reservation-process",
            description: "How to book a memorial plot or service?",
            icon: CalendarIcon,
        },
        {
            title: "Maintenance Policy",
            href: "/faqs/maintenance-policy",
            description: "How is the garden maintained and cared for?",
            icon: LeafIcon,
        },
        {
            title: "Pet Policy",
            href: "/faqs/pet-policy",
            description: "Are pets allowed in the memorial park?",
            icon: UsersIcon,
        },
        {
            title: "Contact Us",
            href: "/faqs/contact-us",
            description: "How to reach our customer service team?",
            icon: PhoneIcon,
        },
        {
            title: "Privacy & Security",
            href: "/faqs/privacy-security",
            description: "How do we protect visitor information?",
            icon: ShieldIcon,
        },
    ];

// Mobile menu item component
const MobileMenuItem = ({
    title,
    href,
    children,
    icon: Icon,
    onSelect
}: {
    title: string;
    href: string;
    children?: React.ReactNode;
    icon?: LucideIcon;
    onSelect?: () => void;
}) => {
    if (children) {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
            <div className="border-b border-gray-200">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
            to={href}
            onClick={onSelect}
            className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 hover:bg-accent hover:text-accent-foreground focus:bg-background focus:text-foreground"
        >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="font-medium">{title}</span>
        </Link>
    );
};

// Mobile submenu item
const MobileSubMenuItem = ({
    title,
    href,
    description,
    icon: Icon,
    onSelect
}: {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon;
    onSelect?: () => void;
}) => {
    return (
        <Link
            to={href}
            onClick={onSelect}
            className="flex items-start gap-3 px-6 py-2 hover:bg-accent hover:text-foreground focus:bg-background focus:text-foreground"
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
                        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
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
                                                key={service.title}
                                                title={service.title}
                                                to={service.href}
                                                icon={service.icon}
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
                                                key={service.title}
                                                title={service.title}
                                                to={service.href}
                                                icon={service.icon}
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
                        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                            <Link to="/about">About</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
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
                                            key={faq.title}
                                            title={faq.title}
                                            to={faq.href}
                                            icon={faq.icon}
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
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                <MenuIcon className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                            {/* Accessibility: Add DialogTitle and Description for SheetContent using shadcn primitives */}
                            <SheetHeader className="border-b">
                                <SheetTitle>Menu</SheetTitle>
                                <SheetDescription className="sr-only">Main navigation menu for mobile users</SheetDescription>
                            </SheetHeader>
                            <div className="flex-1 overflow-y-auto flex flex-col">
                                <nav className="py-2">
                                    <MobileMenuItem
                                        title="Home"
                                        href="/home"
                                        onSelect={handleMobileMenuClose}
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
                                                    key={service.title}
                                                    title={service.title}
                                                    href={service.href}
                                                    description={service.description}
                                                    icon={service.icon}
                                                    onSelect={handleMobileMenuClose}
                                                />
                                            ))}
                                        </div>
                                    </MobileMenuItem>
                                    <MobileMenuItem
                                        title="About"
                                        href="/about"
                                        onSelect={handleMobileMenuClose}
                                    />
                                    <MobileMenuItem
                                        title="Location"
                                        href="/location"
                                        onSelect={handleMobileMenuClose}
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
                                                    key={faq.title}
                                                    title={faq.title}
                                                    href={faq.href}
                                                    description={faq.description}
                                                    icon={faq.icon}
                                                    onSelect={handleMobileMenuClose}
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
    Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> & { icon: LucideIcon; title: string; children?: React.ReactNode; to: string }
>(({ className, title, children, icon: Icon, to, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref as any}
                    to={to}
                    className={cn(
                        "flex select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground items-start gap-3",
                        className
                    )}
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