import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-300 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-stone-200 shadow-sm">
        <span className="font-bold text-xl text-stone-700 flex items-center"><MapPin className="mr-2"/> Finisterre</span>
        <div className="flex gap-6">
          <Link to="/" className="text-stone-700 hover:underline">Home</Link>
        </div>
        <Link to="/login">
          <Button variant="outline" className="rounded-md border-stone-400 text-stone-700 hover:bg-stone-100">Login</Button>
        </Link>
      </nav>
      <main className="flex flex-1 items-center justify-center">
        <div className="px-10 py-12 max-w-3xl w-full flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4 text-center text-stone-800">Not Your Usual Memorial Park</h1>
          <p className="mb-8 text-lg text-stone-700 text-center">
            Inspired by Spain’s El Camino de Santiago, Finisterre Gardenz celebrates life and honors the pilgrimage we all make as we live life to the fullest.
          </p>
          <Link to="/map" className="w-full flex justify-center">
            <Button variant="default" className="w-40 rounded-md bg-stone-700 text-white hover:bg-stone-800"> <MapPin /> Explore Map</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
