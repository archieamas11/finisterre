import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

// Toggle between light and dark themes only, auto-detect system theme on load
export function ThemeToggleAdvanced() {
  const { setTheme, resolvedTheme } = useTheme();

  // Toggle theme between light and dark
  const handleToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={handleToggle}
      className='border border-transparent hover:border-accent-foreground hover:bg-transparent focus:bg-transparent cursor-pointer'
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}