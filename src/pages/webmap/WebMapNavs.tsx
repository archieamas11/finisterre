import { useContext } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Settings, Search, Filter, Locate, Layers, Home } from "lucide-react";

import { isAdmin } from '@/utils/Auth.utils';
import { Button } from "@/components/ui/button";
import { LocateContext } from "@/components/layout/WebMapLayout";


// Accept isAdmin as a prop
export default function WebMapNavs() {
  // Use context to trigger locate
  const locateCtx = useContext(LocateContext);
  return (
    <nav
      className="absolute top-4 right-4 z-[990] flex flex-col gap-3 sm:top-8 sm:right-8 sm:gap-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:flex-row md:gap-4 md:top-8 pointer-events-auto"
      style={{ pointerEvents: 'auto' }}
    >
      <Button className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-primary-foreground dark:hover:bg-stone-800/90 dark:border-stone-700" size="icon">
        <Search className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-primary-foreground dark:hover:bg-stone-800/90 dark:border-stone-700" size="icon">
        <Settings className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-primary-foreground dark:hover:bg-stone-800/90 dark:border-stone-700" size="icon">
        <Filter className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-primary-foreground dark:hover:bg-stone-800/90 dark:border-stone-700" size="icon">
        <RefreshCw className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      {!isAdmin() && (
        <Button
          className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-primary-foreground dark:hover:bg-stone-800/90 dark:border-stone-700"
          onClick={() => locateCtx?.requestLocate()}
          aria-label="Locate me"
          size="icon"
        >
          <Locate className="w-6 h-6 text-stone-700 dark:text-stone-200" />
        </Button>
      )}
      <Button className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-primary-foreground dark:hover:bg-stone-800/90 dark:border-stone-700" size="icon">
        <Layers className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      {!isAdmin() && (
        <Link to="/">
          <Button className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-primary-foreground dark:hover:bg-stone-800/90 dark:border-stone-700" size="icon">
            <Home className="w-6 h-6 text-stone-700 dark:text-stone-200" />
          </Button>
        </Link>
      )}
    </nav>
  );
}
