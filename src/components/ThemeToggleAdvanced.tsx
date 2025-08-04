import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Moon, Sun } from 'lucide-react';

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
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={handleToggle}
            className="rounded-full group border border-transparent hover:border-muted hover:bg-muted-foreground dark:hover:border-accent-foreground focus-visible:ring-2 focus-visible:ring-accent-foreground transition-colors"
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
        <TooltipContent side="bottom" align="center">
          {resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}