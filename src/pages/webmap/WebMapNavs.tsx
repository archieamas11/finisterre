import { Button } from "@/components/ui/button";
import { Search, Settings, Filter, RefreshCw, Locate, Layers, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function WebMapNavs() {
  return (
    <nav
      className="fixed top-4 right-4 z-30 flex flex-col gap-3 sm:top-8 sm:right-8 sm:gap-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:flex-row md:gap-4 md:top-8"
    >
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300">
        <Search className="w-6 h-6 text-stone-700" />
      </Button>
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300">
        <Settings className="w-6 h-6 text-stone-700" />
      </Button>
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300">
        <Filter className="w-6 h-6 text-stone-700" />
      </Button>
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300">
        <RefreshCw className="w-6 h-6 text-stone-700" />
      </Button>
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300">
        <Locate className="w-6 h-6 text-stone-700" />
      </Button>
      <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300">
        <Layers className="w-6 h-6 text-stone-700" />
      </Button>
      <Link to="/">
        <Button size="icon" className="rounded-full shadow bg-white/80 hover:bg-white/90 border border-stone-300">
          <Home className="w-6 h-6 text-stone-700" />
        </Button>
      </Link>
    </nav>
  );
}
