import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDER_IMAGES = [
  "https://picsum.photos/id/1015/600/400",
  "https://picsum.photos/id/1025/600/400",
  "https://picsum.photos/id/1035/600/400",
  "https://picsum.photos/id/1045/600/400",
  "https://picsum.photos/id/1055/600/400",
];

export function AboutSection() {
  const [current, setCurrent] = useState(0);
  const images = useMemo(() => SLIDER_IMAGES, []);

  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      className="w-full py-16 bg-background"
      aria-labelledby="about-section-heading"
      id="about-section"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="flex-1">
            <span className="inline-block mb-3 px-4 py-1 rounded-full bg-muted text-xs font-semibold tracking-wide text-muted-foreground">
              ABOUT FINISTERRE GARDENS
            </span>
            <h2
              id="about-section-heading"
              className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight"
            >
              Preserving Memories with Modern Technology
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Finisterre Gardens revolutionizes cemetery management by seamlessly blending time-honored traditions with cutting-edge technology, creating a dignified and accessible experience for families during their most important moments.
            </p>
            <p className="text-base text-muted-foreground mb-4">
              We understand that honoring and remembering loved ones requires both compassion and convenience. Our comprehensive platform transforms how families interact with cemetery services, making navigation intuitive, care coordination effortless, and memorialization deeply meaningful.
            </p>
            <p className="text-base text-muted-foreground">
              Founded on the principles of respect, innovation, and accessibility, we serve families across generations with tools that preserve legacies while simplifying complex processes.
            </p>
          </div>
          
          {/* Right: Image Slider */}
          <div className="flex-1 flex flex-col items-center w-full">
            <div className="relative w-full max-w-md">
              <Card className="w-full aspect-[3/2] overflow-hidden rounded-2xl shadow-lg relative">
                <div className="absolute inset-0">
                  <img
                    src={images[current]}
                    alt={`Finisterre Gardens view ${current + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                
                {/* Slider Controls */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 shadow-md z-10"
                  aria-label="Previous image"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 shadow-md z-10"
                  aria-label="Next image"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Card>
              
              {/* Dots Indicator */}
              <div className="flex gap-2 mt-4 justify-center" role="tablist" aria-label="Image slides">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      idx === current ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-selected={idx === current}
                    onClick={() => setCurrent(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}