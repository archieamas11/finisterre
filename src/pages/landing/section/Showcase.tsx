import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Camera, Play, ChevronLeft, ChevronRight, Maximize2, Clock, Trees, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const galleryImages = [
  {
    id: 1,
    src: "https://picsum.photos/id/1015/800/600",
    alt: "Panoramic view of peaceful cemetery grounds with rolling hills",
    caption: "Panoramic view of our 150-acre grounds nestled in the rolling countryside",
    category: "panoramic",
  },
  {
    id: 2,
    src: "https://picsum.photos/id/1025/800/600",
    alt: "Spring blossoms throughout the cemetery pathways",
    caption: "Spring transformation with cherry blossoms lining memorial pathways",
    category: "seasonal",
  },
  {
    id: 3,
    src: "https://picsum.photos/id/1035/800/600",
    alt: "Aerial view showing the full expanse of the cemetery property",
    caption: "Aerial perspective showcasing the thoughtful layout and natural integration",
    category: "aerial",
  },
  {
    id: 4,
    src: "https://picsum.photos/id/1045/800/600",
    alt: "Historic monument with intricate architectural details",
    caption: "Historic memorial featuring 19th-century craftsmanship and artistry",
    category: "architecture",
  },
  {
    id: 5,
    src: "https://picsum.photos/id/1055/800/600",
    alt: "Golden sunset casting peaceful light across the grounds",
    caption: "Evening tranquility as golden hour illuminates the sacred grounds",
    category: "sunset",
  },
  {
    id: 6,
    src: "https://picsum.photos/id/1065/800/600",
    alt: "Carefully maintained memorial gardens with seasonal flowers",
    caption: "Memorial gardens featuring native plants and seasonal displays",
    category: "gardens",
  },
  {
    id: 7,
    src: "https://picsum.photos/id/1075/800/600",
    alt: "Carefully maintained memorial gardens with seasonal flowers",
    caption: "Memorial gardens featuring native plants and seasonal displays",
    category: "gardens",
  },
];

const locationFeatures = [
  {
    icon: MapPin,
    title: "Prime Location",
    description: "Situated on 150 acres of pristine countryside, just 15 minutes from downtown",
  },
  {
    icon: Trees,
    title: "Natural Setting",
    description: "Surrounded by mature oak trees and native wildlife preserves",
  },
  {
    icon: Mountain,
    title: "Scenic Views",
    description: "Overlooking the Blue Ridge Mountains with year-round natural beauty",
  },
  {
    icon: Clock,
    title: "Historic Heritage",
    description: "Established in 1847, featuring monuments of significant historical importance",
  },
];

export default function CemeteryShowcase() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { id: "all", label: "All Views" },
    { id: "panoramic", label: "Panoramic" },
    { id: "seasonal", label: "Seasonal" },
    { id: "aerial", label: "Aerial" },
    { id: "architecture", label: "Architecture" },
    { id: "sunset", label: "Golden Hour" },
    { id: "gardens", label: "Gardens" },
  ];

  const filteredImages = useMemo(() => {
    return activeFilter === "all" ? galleryImages : galleryImages.filter((img) => img.category === activeFilter);
  }, [activeFilter]);

  const visibleImages = useMemo(() => {
    return isExpanded ? filteredImages : filteredImages.slice(0, 6);
  }, [filteredImages, isExpanded]);

  // ✅ keep selected index in range when visible set changes (filter or expand/collapse)
  useEffect(() => {
    if (selectedImage > visibleImages.length - 1) setSelectedImage(0);
  }, [visibleImages.length, selectedImage]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % visibleImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + visibleImages.length) % visibleImages.length);
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  // ✅ keyboard navigation when lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLightboxOpen, visibleImages.length]);

  return (
    <section id="showcase-section" className="w-full py-20" aria-labelledby="showcase-heading">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">A Sacred Place of Natural Beauty</h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Discover the serene landscape and thoughtful design that makes our cemetery a peaceful sanctuary for remembrance and reflection
          </p>
        </div>

        {/* Photo Gallery */}
        <div className="mb-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-foreground text-2xl font-semibold">Gallery</h3>
            <div className="no-scrollbar w-full overflow-x-auto sm:w-auto">
              <ToggleGroup
                type="single"
                value={activeFilter}
                onValueChange={(val) => {
                  if (!val) return;
                  setActiveFilter(val);
                  setIsExpanded(false);
                }}
                className="bg-muted/50 flex min-h-10 gap-2 rounded-lg p-1"
                aria-label="Gallery category filter"
              >
                {categories.map((category) => (
                  <ToggleGroupItem
                    key={category.id}
                    value={category.id}
                    aria-label={`Filter by ${category.label}`}
                    className="data-[state=on]:bg-background rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors data-[state=on]:shadow-sm"
                  >
                    {category.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="group relative overflow-hidden rounded-xl"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  className={cn("focus-visible:ring-primary/30 block w-full rounded-xl focus-visible:ring-4 focus-visible:outline-none")}
                >
                  <div className="bg-muted relative aspect-[4/3] sm:aspect-[16/10]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-sm font-medium text-white">{image.caption}</p>
                    </div>
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Maximize2 className="text-white" aria-hidden="true" />
                      <span className="sr-only">Open image in lightbox</span>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* View more / less toggle */}
          {filteredImages.length > 6 ? (
            <div className="mt-4 sm:mt-6">
              <Button type="button" variant="outline" className="w-full" onClick={() => setIsExpanded((v) => !v)} aria-expanded={isExpanded}>
                {isExpanded ? "View less" : "View more"}
              </Button>
            </div>
          ) : null}
        </div>

        {/* Location Highlights */}
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Interactive Map Section */}
          <Card className="overflow-hidden rounded-2xl shadow-xl">
            <CardHeader className="p-0">
              <div className="relative h-80 bg-gradient-to-br from-blue-100 to-blue-200">
                {/* Mock Interactive Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="bg-muted h-full w-full opacity-30"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-card rounded-lg p-6 text-center shadow-lg">
                      <MapPin className="text-primary mx-auto mb-2" aria-hidden="true" />
                      <h4 className="text-foreground mb-1 font-semibold">Interactive Map</h4>
                      <p className="text-muted-foreground text-sm">Explore our grounds</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <Button variant="outline" size="sm" type="button" className="shadow-lg">
                    <Camera aria-hidden="true" />
                    <span className="text-sm font-medium">Virtual Tour</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="mb-1 text-xl">Peaceful Valley Cemetery</CardTitle>
              <CardDescription className="mb-4">123 Memorial Drive, Springfield Valley, IL 62701</CardDescription>
              <Button type="button" className="w-full">
                <Play aria-hidden="true" />
                <span>Take Virtual Tour</span>
              </Button>
            </CardContent>
          </Card>

          {/* Location Features */}
          <div>
            <h3 className="text-foreground mb-6 text-2xl font-semibold">Location Highlights</h3>

            <div className="space-y-6">
              {locationFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                      <IconComponent className="text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-foreground mb-1 font-semibold">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-background border-muted mt-8 rounded-xl border p-6">
              <h4 className="text-foreground mb-3 font-semibold">Accessibility & Amenities</h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>• Paved pathways throughout the grounds</li>
                <li>• Wheelchair accessible facilities</li>
                <li>• On-site chapel and gathering spaces</li>
                <li>• Ample parking with designated areas</li>
                <li>• Restroom facilities and water fountains</li>
                <li>• Seasonal flower displays and maintenance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal - shadcn Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl p-2 sm:p-4" showCloseButton>
          <div className="relative">
            {visibleImages.length > 0 ? (
              <>
                <img
                  src={visibleImages[selectedImage]?.src}
                  alt={visibleImages[selectedImage]?.alt}
                  className="bg-background border-muted h-auto max-h-[80vh] w-full rounded-lg border object-contain"
                />

                <div className="absolute inset-y-0 right-0 left-0 flex items-center justify-between px-1 sm:px-3">
                  <Button variant="ghost" size="icon" type="button" onClick={prevImage} aria-label="Previous image" className="bg-black/40 text-white hover:bg-black/60">
                    <ChevronLeft aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" size="icon" type="button" onClick={nextImage} aria-label="Next image" className="bg-black/40 text-white hover:bg-black/60">
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </div>

                <div className="mt-3 px-2 text-center">
                  <p className="text-foreground text-sm font-medium sm:text-base">{visibleImages[selectedImage]?.caption}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground p-6 text-center">No images available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
