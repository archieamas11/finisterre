import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MapPin, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <main className="relative mb-16 flex min-h-[100vh] flex-1 items-center justify-center overflow-hidden pt-24">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="min-h-full min-w-full scale-105 object-cover"
            aria-label="Background video"
            playsInline
            autoPlay
            muted
            loop
            controls
            preload="metadata"
          >
            <source
              src="C:\Users\Administrator\Downloads\Finisterre-Masterplan-Actual-Development.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        {/* Modern gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        {/* Subtle animated overlay */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20" />
      </div>

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute top-1/4 left-1/4 h-2 w-2 animate-bounce rounded-full bg-white/30 delay-700"></div>
        <div className="absolute top-3/4 right-1/3 h-1 w-1 animate-bounce rounded-full bg-white/40 delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 h-1.5 w-1.5 animate-bounce rounded-full bg-white/20 delay-500"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto mb-20 w-full max-w-6xl px-6 sm:px-8">
        {/* Premium badge */}
        <div className="animate-fade-in mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-yellow-400" />A Sacred Journey
            Awaits
          </div>
        </div>

        {/* Main heading with modern typography */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl leading-tight font-bold text-white sm:text-6xl lg:text-7xl">
            <span className="block bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
              Not Your Usual
            </span>
            <span className="mt-2 block bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text font-extrabold text-transparent">
              Memorial Park
            </span>
          </h1>

          <p className="mx-auto max-w-4xl text-lg leading-relaxed font-light text-white/90 sm:text-xl lg:text-2xl">
            Inspired by Spain's{" "}
            <span className="font-semibold text-blue-200">
              El Camino de Santiago
            </span>
            ,
            <br className="hidden sm:block" />
            Finisterre Gardenz celebrates life and honors the pilgrimage we all
            make
            <br className="hidden sm:block" />
            as we live life to the fullest.
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          {/* Primary CTA */}
          <Button
            className="group from-chart-4 to-chart-5 hover:from-chart-4 hover:to-chart-5 text-foreground dark:text-accent relative overflow-hidden rounded-full border-0 bg-gradient-to-r px-8 py-4 font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
            size="lg"
            asChild
          >
            <Link
              className="flex items-center gap-3"
              aria-label="Explore Map"
              to="/map"
            >
              <MapPin className="h-5 w-5" />
              Explore Sacred Grounds
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            className="group from-chart-4 to-chart-5 hover:from-chart-4 hover:to-chart-5 text-foreground dark:text-accent relative overflow-hidden rounded-full border-0 bg-gradient-to-r px-8 py-4 font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
            size={"lg"}
          >
            <Link
              className="flex items-center gap-3"
              aria-label="Explore Map"
              to="/mapLibre"
            >
              <MapPin className="h-5 w-5" />
              Explore Map Libre
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Secondary CTA */}
          <Button
            className="group rounded-full border-white/30 bg-white/10 px-8 py-4 font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20"
            variant="outline"
            size="lg"
            asChild
          >
            <Link className="flex items-center gap-2" to="/about">
              <Heart className="h-4 w-4" />
              Our Story
            </Link>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-8 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
              <span>Sacred & Peaceful</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400 delay-300"></div>
              <span>Beautifully Designed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400 delay-700"></div>
              <span>Meaningful Journey</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="from-background via-background/60 absolute right-0 bottom-0 left-0 z-[5] h-48 bg-gradient-to-t to-transparent"></div>

      {/* Custom animations */}
      <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
            `}</style>
    </main>
  );
}
