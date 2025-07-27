import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import WebMapNavs from "@/pages/webmap/WebMapNavs";

export default function MapPage() {
  return (
    <div className="fixed inset-0 w-full h-full bg-white dark:bg-stone-900">
      <WebMapNavs />
      <Link to="/" className="absolute bottom-6 left-6 z-20 text-base shadow">
        <Button variant="link">
          ← Back to Landing Page
        </Button>
      </Link>
      {/* Map content placeholder */}
      <div className="absolute inset-0 flex items-center justify-center w-full h-full p-0">
        <img
          src="https://picsum.photos/1200/800?grayscale&blur=1"
          alt="Sample map preview"
          className="w-full h-full object-cover"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
      {/* Footer floating bottom right */}
      <div className="absolute bottom-6 right-6 z-20 text-xs text-stone-400">
        © 2025 Finisterre Cemetery
      </div>
    </div>
  );
}