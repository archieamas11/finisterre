import { Button } from "@/components/ui/button";
import { Search, Settings, Filter, RefreshCw, Locate, Layers, Home } from "lucide-react";
import { useContext } from "react";
import { LocateContext } from "@/components/layout/WebMapLayout";
import { Link } from "react-router-dom";


export default function WebMapNavs() {
  // Use context to trigger locate
  const locateCtx = useContext(LocateContext);
  return (
    <nav
      className="fixed top-4 right-4 z-990 flex flex-col gap-3 sm:top-8 sm:right-8 sm:gap-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:flex-row md:gap-4 md:top-8"
    >
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-800/90 dark:border-stone-700">
        <Search className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-800/90 dark:border-stone-700">
        <Settings className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-800/90 dark:border-stone-700">
        <Filter className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-800/90 dark:border-stone-700">
        <RefreshCw className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>

      <Button
        size="icon"
        className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-800/90 dark:border-stone-700"
        onClick={() => locateCtx?.requestLocate()}
        aria-label="Locate me"
      >
        <Locate className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>

      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-800/90 dark:border-stone-700">
        <Layers className="w-6 h-6 text-stone-700 dark:text-stone-200" />
      </Button>
      <Link to="/">
        <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300 dark:bg-stone-800/80 dark:hover:bg-stone-800/90 dark:border-stone-700">
          <Home className="w-6 h-6 text-stone-700 dark:text-stone-200" />
        </Button>
      </Link>
    </nav>
  );
}
