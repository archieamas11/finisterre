import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from '@/components/ui/tooltip';

import { useTheme } from '../context/ThemeContext';

// Toggle between light and dark themes only, auto-detect system theme on load
export function ThemeToggleAdvanced() {
  const { setTheme, resolvedTheme } = useTheme();

  // Toggle theme between light and dark
  const handleToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="rounded-full group border border-transparent hover:border-muted hover:bg-muted-foreground dark:hover:border-accent-foreground focus-visible:ring-2 focus-visible:ring-accent-foreground transition-colors"
            aria-label="Toggle theme"
            onClick={handleToggle}
            variant="ghost"
            size="icon"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="h-5 w-5 transition-transform duration-300 rotate-0 scale-100" key="moon" />
            ) : (
              <Sun
                className="h-5 w-5 transition-transform duration-300 rotate-0 scale-100 group-hover:text-white"
                key="sun"
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center" side="bottom">
          {resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}