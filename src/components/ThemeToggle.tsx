// src/components/ThemeToggle.tsx
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); }}
      aria-label="Toggle theme"
      variant="ghost"
      size="icon"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}