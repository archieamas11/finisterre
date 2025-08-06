import { MapPin } from 'lucide-react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, Suspense, useState, lazy } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggleAdvanced } from "@/components/ThemeToggleAdvanced";
import { NavigationMenuSection } from "@/pages/landing/section/NavigationMenu";

const HeroSection = lazy(() => import("@/pages/landing/section/HeroSection"));
const OurServicesSection = lazy(() => import("@/pages/landing/section/OurServicesSection"));
const AboutSection = lazy(() => import("@/pages/landing/section/AboutSection"));

export default function LandingLayout() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // 🟢 Only show navbar border/background/shadow when scrolled
        const handleScroll = () => { setScrolled(window.scrollY > 0); };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => { window.removeEventListener("scroll", handleScroll); };
    }, []);

    return (
        <div className="min-h-full bg-background flex flex-col">
            <nav
                className={[
                    "fixed top-2 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-8 py-4 rounded-xl mx-auto w-[80vw] sm:w-[90vw] max-w-6xl text-background dark:text-accent-foreground",
                    scrolled
                        ? "border bg-background/40 dark:bg-background/50 shadow-lg backdrop-blur-md text-foreground dark:text-accent-foreground"
                        : "border-transparent bg-transparent shadow-none backdrop-blur-none"
                ].join(" ")}
                aria-label="Main Navigation"
            >
                <span
                    className={[
                        "font-bold text-md flex items-center cursor-pointer",
                        scrolled
                            ? "text-foreground dark:text-accent-foreground"
                            : "text-background dark:text-accent-foreground"
                    ].join(" ")}
                    onClick={() => navigate("/")}
                    aria-label="Go to homepage"
                >
                    <MapPin className="mr-2" size={20} />
                    <span className="hidden md:inline text-md">Finisterre</span>
                </span>
                <NavigationMenuSection />
                <div className="flex gap-2 sm:gap-4 items-center">
                    <ThemeToggleAdvanced />
                    <Link to="/login">
                        <Button
                            className="rounded-full text-foreground hover:bg-muted transition"
                            aria-label="Login"
                            variant="default"
                        >
                            Login
                        </Button>
                    </Link>
                </div>
            </nav>
            <Suspense fallback={null}>
                <HeroSection />
                <OurServicesSection />
                <AboutSection />
            </Suspense>
        </div>
    );
}