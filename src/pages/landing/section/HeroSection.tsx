import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Sparkles, Heart } from 'lucide-react';

export default function HeroSection() {
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
                        className="min-h-full min-w-full object-cover scale-105"
                        aria-label="Background video"
                    >
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                {/* Modern gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                {/* Subtle animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 animate-pulse" />
            </div>

            {/* Floating decorative elements */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-700"></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce delay-500"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8">
                {/* Premium badge */}
                <div className="flex justify-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        A Sacred Journey Awaits
                    </div>
                </div>

                {/* Main heading with modern typography */}
                <div className="text-center space-y-6 mb-12">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                        <span className="block bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                            Not Your Usual
                        </span>
                        <span className="block bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent font-extrabold mt-2">
                            Memorial Park
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
                        Inspired by Spain's <span className="font-semibold text-blue-200">El Camino de Santiago</span>,
                        <br className="hidden sm:block" />
                        Finisterre Gardenz celebrates life and honors the pilgrimage we all make
                        <br className="hidden sm:block" />
                        as we live life to the fullest.
                    </p>
                </div>

                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {/* Primary CTA */}
                    <Button
                        asChild
                        size="lg"
                        className="group relative overflow-hidden bg-gradient-to-r from-chart-4 to-chart-5 hover:from-chart-4 hover:to-chart-5 text-foreground dark:text-accent font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 border-0"
                    >
                        <Link to="/map" aria-label="Explore Map" className="flex items-center gap-3">
                            <MapPin className="h-5 w-5" />
                            Explore Sacred Grounds
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </Button>
                    <Button>
                        <Link to="/mapLibre" aria-label="Explore Map" className="flex items-center gap-3">
                            <MapPin className="h-5 w-5" />
                            Explore Map Libre
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </Button>

                    {/* Secondary CTA */}
                    <Button
                        variant="outline"
                        size="lg"
                        className="group bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 font-medium px-8 py-4 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
                        asChild
                    >
                        <Link to="/about" className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Our Story
                        </Link>
                    </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex justify-center mt-16">
                    <div className="flex items-center gap-8 text-white/60 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Sacred & Peaceful</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                            <span>Beautifully Designed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                            <span>Meaningful Journey</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent z-[5]"></div>

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