import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, MoonStar, SunIcon, EclipseIcon } from 'lucide-react';
import { ThemeProvider, useTheme } from "@/components/theme-provide";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

export default function LandingPage() {
  const navigate = useNavigate();
  // Theme switcher component
  const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    let icon = <EclipseIcon className="w-5 h-5" />;
    if (theme === "light") icon = <SunIcon className="w-5 h-5 text-yellow-500" />;
    if (theme === "dark") icon = <MoonStar className="w-5 h-5 text-blue-500" />;
    return (
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-15 h-10 p-0 border-none bg-transparent shadow-none focus:ring-0 focus:outline-none appearance-none flex items-center justify-center data-[state=open]:after:hidden after:hidden">
          <span className="flex items-center justify-center w-full">{icon}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light"><SunIcon className="w-4 h-4 mr-2 text-yellow-500" /> Light</SelectItem>
          <SelectItem value="dark"><MoonStar className="w-4 h-4 mr-2 text-blue-500" /> Dark</SelectItem>
          <SelectItem value="system"><EclipseIcon className="w-4 h-4 mr-2" /> System</SelectItem>
        </SelectContent>
      </Select>
    );
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-300 dark:from-stone-900 dark:to-stone-800 flex flex-col">
        <nav className="flex items-center justify-between px-8 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 shadow-sm">
          <span className="font-bold text-xl text-stone-700 dark:text-stone-100 flex items-center" onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}><MapPin className="mr-2"
            /> Finisterre</span>
          <div className="flex gap-6">
            <Link to="/" className="text-stone-700 dark:text-stone-100 hover:underline">Home</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login">
              <Button variant="outline" className="rounded-md border-stone-400 dark:border-stone-600 text-stone-700 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800">Login</Button>
            </Link>
            <ThemeSwitcher />
          </div>
        </nav>
        <main className="flex flex-1 items-center justify-center">
          <div className="px-10 py-12 max-w-3xl w-full flex flex-col items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-center text-stone-800 dark:text-stone-100">Not Your Usual Memorial Park</h1>
            <p className="mb-8 text-lg text-stone-700 dark:text-stone-300 text-center">
              Inspired by Spain’s El Camino de Santiago, Finisterre Gardenz celebrates life and honors the pilgrimage we all make as we live life to the fullest.
            </p>
            <Link to="/map" className="w-full flex justify-center">
              <Button variant="default" className="w-40 rounded-md bg-stone-700 dark:bg-stone-800 text-white hover:bg-stone-800 dark:hover:bg-stone-700"> <MapPin /> Explore Map</Button>
            </Link>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
