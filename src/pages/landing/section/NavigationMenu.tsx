import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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

export function NavigationMenuSection() {
    return (
        <NavigationMenu className="z-20">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link to="/home">
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                            Home
                        </NavigationMenuLink>
                    </Link>
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
                                            href={service.href}
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
                                            href={service.href}
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
                    <Link to="/location">
                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                            Location
                        </NavigationMenuLink>
                    </Link>
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
                                        href={faq.href}
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
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a"> & { icon: LucideIcon }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="font-semibold tracking-tight leading-none flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {title}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";