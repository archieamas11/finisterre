import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, Suspense, useState, lazy } from "react";

import { Button } from "@/components/ui/button";
import { NavigationMenuSection } from "@/pages/landing/section/NavigationMenu";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { cn } from "@/lib/utils";

const HeroSection = lazy(() => import("@/pages/landing/section/HeroSection"));
const FAQs = lazy(() => import("@/pages/landing/section/FAQs"));
const Showcase = lazy(() => import("@/pages/landing/section/Showcase"));
const Footer = lazy(() => import("@/pages/landing/section/Footer"));
const FeatureSection = lazy(() => import("@/components/mvpblocks/FeatureSection"));
const Testimonials = lazy(() => import("@/components/mvpblocks/Testimonials"));

export default function LandingLayout() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header
        className={cn("fixed top-2 right-0 left-0 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-xl px-4 py-2 sm:px-6", "w-[85vw] sm:w-[90vw] md:w-[80vw]", {
          "border-border bg-background/80 text-foreground shadow-lg backdrop-blur-lg": scrolled,
          "border-transparent bg-transparent text-white": !scrolled,
        })}
        aria-label="Main Navigation"
      >
        <Link to="/" className="focus:ring-primary flex items-center gap-2 rounded-md font-bold focus:ring-2 focus:ring-offset-2 focus:outline-none" aria-label="Go to homepage">
          <MapPin className="h-5 w-5" aria-hidden="true" />
          <span className="hidden md:inline">Finisterre</span>
        </Link>
        <NavigationMenuSection />
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggleButton start="top-right" variant="circle-blur" />
          <Button asChild type="button" className="hover:bg-primary/10 rounded-full border transition-colors" aria-label="Login" variant="secondary">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <Suspense fallback={<div className="bg-background h-screen w-full" />}>
          <HeroSection />
          <FeatureSection />
          <Showcase />
          <Testimonials />
          <FAQs />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
