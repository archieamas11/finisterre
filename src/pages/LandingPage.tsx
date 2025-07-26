import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ThemeToggleAdvanced } from "@/components/ThemeToggleAdvanced";

export default function LandingPage() {
  const navigate = useNavigate();
  // Theme switcher component

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 bg-background border-b border-muted shadow-sm">
        <span
          className="font-bold text-xl text-foreground flex items-center"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <MapPin className="mr-2" /> Finisterre
        </span>
        <div className="flex gap-6">
          <Link to="/" className="text-foreground hover:underline">Home</Link>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggleAdvanced />
          <Link to="/login">
            <Button
              variant="outline"
              className="rounded-md border-muted text-foreground hover:bg-muted"
            >
              Login
            </Button>
          </Link>
        </div>
      </nav>
      <main className="flex flex-1 items-center justify-center">
        <div className="px-10 py-12 max-w-3xl w-full flex flex-col items-center bg-card border border-muted rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-center text-foreground">Not Your Usual Memorial Park</h1>
          <p className="mb-8 text-lg text-muted-foreground text-center">
            Inspired by Spain’s El Camino de Santiago, Finisterre Gardenz celebrates life and honors the pilgrimage we all make as we live life to the fullest.
          </p>
          <Link to="/map" className="w-full flex justify-center">
            <Button
              variant="default"
              className="w-40 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <MapPin /> Explore Map
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
