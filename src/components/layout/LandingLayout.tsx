import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, Suspense, useState, lazy } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggleAdvanced } from "@/components/ThemeToggleAdvanced";
import { NavigationMenuSection } from "@/pages/landing/section/NavigationMenu";

const HeroSection = lazy(() => import("@/pages/landing/section/HeroSection"));
const OurServicesSection = lazy(() => import("@/pages/landing/section/OurServicesSection"));
const AboutSection = lazy(() => import("@/pages/landing/section/AboutSection"));
const FAQs = lazy(() => import("@/pages/landing/section/FAQs"));
const Showcase = lazy(() => import("@/pages/landing/section/Showcase"));
const Footer = lazy(() => import("@/pages/landing/section/Footer"));

export default function LandingLayout() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-background flex min-h-full flex-col">
      <nav
        className={[
          "text-background dark:text-accent-foreground fixed top-2 right-0 left-0 z-30 mx-auto flex w-[80vw] max-w-6xl items-center justify-between rounded-xl px-6 py-0 sm:w-[90vw] sm:px-8 sm:py-0 md:py-4",
          scrolled
            ? "bg-background/40 dark:bg-background/50 text-foreground dark:text-accent-foreground border shadow-lg backdrop-blur-md"
            : "border-transparent bg-transparent shadow-none backdrop-blur-none",
        ].join(" ")}
        aria-label="Main Navigation"
      >
        <span
          className={[
            "text-md flex cursor-pointer items-center font-bold",
            scrolled
              ? "text-foreground dark:text-accent-foreground"
              : "text-background dark:text-accent-foreground",
          ].join(" ")}
          onClick={() => navigate("/")}
          aria-label="Go to homepage"
        >
          <MapPin className="mr-2" size={20} />
          <span className="text-md hidden md:inline">Finisterre</span>
        </span>
        <NavigationMenuSection />
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggleAdvanced />
          <Link to="/login">
            <Button
              className="text-foreground hover:bg-muted rounded-full transition"
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
        <Showcase />
        <FAQs />
        <Footer />
      </Suspense>
    </div>
  );
}
