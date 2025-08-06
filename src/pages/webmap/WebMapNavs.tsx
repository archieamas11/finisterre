import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Settings,
  Search,
  Filter,
  Locate,
  Layers,
  Home,
} from "lucide-react";

import { isAdmin } from "@/utils/Auth.utils";
import { Button } from "@/components/ui/button";
import { LocateContext } from "@/components/layout/WebMapLayout";

// Accept isAdmin as a prop
export default function WebMapNavs() {
  // Use context to trigger locate
  const locateCtx = useContext(LocateContext);
  return (
    <nav
      className="pointer-events-auto absolute top-4 right-4 z-[990] flex flex-col gap-3 sm:top-8 sm:right-8 sm:gap-4 md:top-8 md:right-auto md:left-1/2 md:-translate-x-1/2 md:flex-row md:gap-4"
      style={{ pointerEvents: "auto" }}
    >
      <Button
        className="dark:bg-primary-foreground rounded-full border border-stone-300 bg-white/80 shadow hover:bg-white/90 dark:border-stone-700 dark:hover:bg-stone-800/90"
        size="icon"
      >
        <Search className="h-6 w-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button
        className="dark:bg-primary-foreground rounded-full border border-stone-300 bg-white/80 shadow hover:bg-white/90 dark:border-stone-700 dark:hover:bg-stone-800/90"
        size="icon"
      >
        <Settings className="h-6 w-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button
        className="dark:bg-primary-foreground rounded-full border border-stone-300 bg-white/80 shadow hover:bg-white/90 dark:border-stone-700 dark:hover:bg-stone-800/90"
        size="icon"
      >
        <Filter className="h-6 w-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button
        className="dark:bg-primary-foreground rounded-full border border-stone-300 bg-white/80 shadow hover:bg-white/90 dark:border-stone-700 dark:hover:bg-stone-800/90"
        size="icon"
      >
        <RefreshCw className="h-6 w-6 text-stone-700 dark:text-stone-200" />
      </Button>
      {!isAdmin() && (
        <Button
          className="dark:bg-primary-foreground rounded-full border border-stone-300 bg-white/80 shadow hover:bg-white/90 dark:border-stone-700 dark:hover:bg-stone-800/90"
          onClick={() => locateCtx?.requestLocate()}
          aria-label="Locate me"
          size="icon"
        >
          <Locate className="h-6 w-6 text-stone-700 dark:text-stone-200" />
        </Button>
      )}
      <Button
        className="dark:bg-primary-foreground rounded-full border border-stone-300 bg-white/80 shadow hover:bg-white/90 dark:border-stone-700 dark:hover:bg-stone-800/90"
        size="icon"
      >
        <Layers className="h-6 w-6 text-stone-700 dark:text-stone-200" />
      </Button>
      {!isAdmin() && (
        <Link to="/">
          <Button
            className="dark:bg-primary-foreground rounded-full border border-stone-300 bg-white/80 shadow hover:bg-white/90 dark:border-stone-700 dark:hover:bg-stone-800/90"
            size="icon"
          >
            <Home className="h-6 w-6 text-stone-700 dark:text-stone-200" />
          </Button>
        </Link>
      )}
    </nav>
  );
}
