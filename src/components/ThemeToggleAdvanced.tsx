import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";

import { useTheme } from "../context/ThemeContext";

// Toggle between light and dark themes only, auto-detect system theme on load
export function ThemeToggleAdvanced() {
  const { setTheme, resolvedTheme } = useTheme();

  // Toggle theme between light and dark
  const handleToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="group hover:border-muted hover:bg-muted-foreground dark:hover:border-accent-foreground focus-visible:ring-accent-foreground rounded-full border border-transparent transition-colors focus-visible:ring-2"
            aria-label="Toggle theme"
            onClick={handleToggle}
            variant="ghost"
            size="icon"
          >
            {resolvedTheme === "dark" ? (
              <Moon
                className="h-5 w-5 scale-100 rotate-0 transition-transform duration-300"
                key="moon"
              />
            ) : (
              <Sun
                className="h-5 w-5 scale-100 rotate-0 transition-transform duration-300 group-hover:text-white"
                key="sun"
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center" side="bottom">
          {resolvedTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
