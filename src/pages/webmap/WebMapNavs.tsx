import { Button } from "@/components/ui/button";
import { Search, Settings, Filter, RefreshCw, Locate, Layers } from "lucide-react";

export default function WebMapNavs() {
  return (
    <nav className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex flex-column gap-4">
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
    </nav>
  );
}
