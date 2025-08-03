import { Link } from "react-router-dom";
import { MapPin } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import { Button } from "@/components/ui/button";
import { NavigationMenuSection } from "@/pages/landing/section/NavigationMenu";
import { ThemeToggleAdvanced } from "@/components/ThemeToggleAdvanced";

const HeroSection = lazy(() => import("@/pages/landing/section/HeroSection"));
const OurServicesSection = lazy(() => import("@/pages/landing/section/OurServicesSection"));
const AboutSection = lazy(() => import("@/pages/landing/section/AboutSection"));

export default function LandingLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-full bg-background flex flex-col">
            <nav
                className="fixed top-2 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-8 py-4 rounded-xl mx-auto w-[80vw] sm:w-[90vw] max-w-6xl border shadow-lg backdrop-blur-lg text-accent-foreground bg-background/40 dark:bg-background/50 transition-all duration-300"
                aria-label="Main Navigation"
            >
                <span
                    className="font-bold text-xl flex items-center cursor-pointer text-accent-foreground transition-all duration-300"
                    onClick={() => navigate("/")}
                    aria-label="Go to homepage"
                >
                    <MapPin className="mr-2" />
                    <span className="hidden md:inline">Finisterre</span>
                </span>
                <NavigationMenuSection />
                <div className="flex gap-2 sm:gap-4 items-center">
                    <ThemeToggleAdvanced />
                    <Link to="/login">
                        <Button
                            variant="outline"
                            className="rounded-md border-muted text-foreground hover:bg-muted transition"
                            aria-label="Login"
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