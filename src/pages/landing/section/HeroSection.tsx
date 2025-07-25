import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin } from 'lucide-react';
import { Card } from "@/components/ui/card";

export function HeroSection() {
    return (
        <main className="relative flex flex-1 items-center justify-center overflow-hidden pt-24 mb-16 min-h-[100vh]">
            {/* Video Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="min-h-full min-w-full object-cover"
                        aria-label="Background video"
                    >
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                {/* Gradient overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-transparent dark:from-background/80 dark:via-background/60" />
                <div className="absolute inset-0 bg-background/40 dark:bg-background/50" />
            </div>

            {/* Content Card */}
            <Card className="relative z-10 w-full max-w-3xl border border-muted bg-background/80 p-6 shadow-lg backdrop-blur-md sm:p-10 dark:bg-background/70">
                <h1 className="mb-4 text-center text-3xl font-bold drop-shadow-sm sm:text-4xl">
                    Not Your Usual Memorial Park
                </h1>
                <p className="mb-8 text-center text-base text-muted-foreground sm:text-lg">
                    Inspired by Spain's El Camino de Santiago, Finisterre Gardenz celebrates life and honors the pilgrimage we all make as we live life to the fullest.
                </p>
                <div className="flex justify-center">
                    <Button asChild className="flex w-40 items-center gap-2 rounded-md transition">
                        <Link to="/map" aria-label="Explore Map">
                            <MapPin className="h-4 w-4" /> Explore Map
                        </Link>
                    </Button>
                </div>
            </Card>
        </main>
    );
}