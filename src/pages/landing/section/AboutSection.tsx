import { useEffect, useState, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SLIDER_IMAGES = [
  "https://picsum.photos/id/1015/600/400",
  "https://picsum.photos/id/1025/600/400",
  "https://picsum.photos/id/1035/600/400",
  "https://picsum.photos/id/1045/600/400",
  "https://picsum.photos/id/1055/600/400",
];

export default function AboutSection() {
  const [current, setCurrent] = useState(0);
  const images = useMemo(() => SLIDER_IMAGES, []);

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  // Auto-advance slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [current]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <section
      aria-labelledby="about-section-heading"
      className="bg-background w-full py-16"
      id="about-section"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Left: Text */}
          <div className="flex-1">
            <span className="bg-muted text-muted-foreground mb-3 inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-wide">
              ABOUT FINISTERRE GARDENS
            </span>
            <h2
              className="text-foreground mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl"
              id="about-section-heading"
            >
              Preserving Memories with Modern Technology
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Finisterre Gardens revolutionizes cemetery management by
              seamlessly blending time-honored traditions with cutting-edge
              technology, creating a dignified and accessible experience for
              families during their most important moments.
            </p>
            <p className="text-muted-foreground mb-4 text-base">
              We understand that honoring and remembering loved ones requires
              both compassion and convenience. Our comprehensive platform
              transforms how families interact with cemetery services, making
              navigation intuitive, care coordination effortless, and
              memorialization deeply meaningful.
            </p>
            <p className="text-muted-foreground text-base">
              Founded on the principles of respect, innovation, and
              accessibility, we serve families across generations with tools
              that preserve legacies while simplifying complex processes.
            </p>
          </div>

          {/* Right: Image Slider */}
          <div className="flex w-full flex-1 flex-col items-center">
            <div className="relative w-full max-w-md">
              <Card className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-lg">
                <div className="absolute inset-0">
                  <img
                    className="h-full w-full object-cover transition-all duration-500"
                    alt={`Finisterre Gardens view ${current + 1}`}
                    src={images[current]}
                    draggable={false}
                    loading="lazy"
                  />
                </div>

                {/* Slider Controls */}
                <Button
                  className="absolute top-1/2 left-4 z-10 h-10 w-10 -translate-y-1/2 rounded-full shadow-md"
                  aria-label="Previous image"
                  variant="secondary"
                  onClick={prevImage}
                  size="icon"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  className="absolute top-1/2 right-4 z-10 h-10 w-10 -translate-y-1/2 rounded-full shadow-md"
                  aria-label="Next image"
                  variant="secondary"
                  onClick={nextImage}
                  size="icon"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </Card>

              {/* Dots Indicator */}
              <div
                className="mt-4 flex justify-center gap-2"
                aria-label="Image slides"
                role="tablist"
              >
                {images.map((_, idx) => (
                  <button
                    className={`focus:ring-primary h-3 w-3 rounded-full transition-colors focus:ring-2 focus:outline-none ${
                      idx === current ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => {
                      setCurrent(idx);
                    }}
                    aria-selected={idx === current}
                    key={idx}
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
