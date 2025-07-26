import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ThemeToggleAdvanced } from "@/components/ThemeToggleAdvanced";
import { OurServicesSection } from "@/pages/landing/section/OurServicesSection";
import { HeroSection } from "@/pages/landing/section/HeroSection";
import { NavigationMenuSection } from "@/pages/landing/section/NavigationMenu";

export default function LandingLayout() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <nav
                className="fixed top-2 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-8 py-4 rounded-xl mx-auto w-[95vw] sm:w-[80vw] max-w-4xl border shadow-lg backdrop-blur-lg"
                aria-label="Main Navigation"
            >
                <span
                    className="font-bold text-xl text-foreground flex items-center cursor-pointer transition hover:text-primary"
                    onClick={() => navigate("/")}
                    aria-label="Go to homepage"
                >
                    <MapPin className="mr-2" /> Finisterre
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
            <HeroSection />
            <OurServicesSection />
        </div>
    );
}