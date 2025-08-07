import { useTheme } from "../context/ThemeContext";
import { ThemeToggleButton, useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button";

// Toggle between light and dark themes only, auto-detect system theme on load
export function ThemeToggleAdvanced() {
  const { setTheme, resolvedTheme } = useTheme();
  const { startTransition } = useThemeTransition();

  // Toggle theme between light and dark
  const handleToggle = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    startTransition(() => {
      setTheme(newTheme);
    });
  };

  return (
    <ThemeToggleButton
      theme={resolvedTheme}
      onClick={handleToggle}
      className="border-0 hover:border bg-transparent hover:bg-transparent"
      showLabel={false}
      variant="circle-blur"
      start="top-right"
    />
  );
}
