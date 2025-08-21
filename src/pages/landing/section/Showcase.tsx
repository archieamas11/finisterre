import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, Maximize2, Clock, Trees, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
// Removed unused bounds; using center + zoom instead to ensure the map fills its container.
const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1561816544-21ec9b39454b?q=80&w=2070&auto=format&fit=crop",
    alt: "Panoramic view of peaceful cemetery grounds with rolling hills",
    caption: "Panoramic view of our 150-acre grounds nestled in the rolling countryside",
    category: "panoramic",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1585224252629-729146a38f49?q=80&w=1932&auto=format&fit=crop",
    alt: "Spring blossoms throughout the cemetery pathways",
    caption: "Spring transformation with cherry blossoms lining memorial pathways",
    category: "seasonal",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1549903349-41402da3815c?q=80&w=2070&auto=format&fit=crop",
    alt: "Aerial view showing the full expanse of the cemetery property",
    caption: "Aerial perspective showcasing the thoughtful layout and natural integration",
    category: "aerial",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1600675494932-8527a7a1855a?q=80&w=1974&auto=format&fit=crop",
    alt: "Historic monument with intricate architectural details",
    caption: "Historic memorial featuring 19th-century craftsmanship and artistry",
    category: "architecture",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1506372023323-265a55b22235?q=80&w=2070&auto=format&fit=crop",
    alt: "Golden sunset casting peaceful light across the grounds",
    caption: "Evening tranquility as golden hour illuminates the sacred grounds",
    category: "sunset",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1522202845147-df37851b20e5?q=80&w=2070&auto=format&fit=crop",
    alt: "Carefully maintained memorial gardens with seasonal flowers",
    caption: "Memorial gardens featuring native plants and seasonal displays",
    category: "gardens",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1590339692245-509c96544993?q=80&w=1974&auto=format&fit=crop",
    alt: "A serene lake reflecting the sky within the memorial park",
    caption: "A serene lake reflecting the sky, offering a place for quiet contemplation",
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
  const [leafletMap, setLeafletMap] = useState<LeafletMap | null>(null);

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

  useEffect(() => {
    if (selectedImage >= visibleImages.length) {
      setSelectedImage(0);
    }
  }, [visibleImages, selectedImage]);

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

  // Ensure Leaflet redraws when the map instance becomes available or when the gallery expands
  useEffect(() => {
    if (!leafletMap) return;
    // give layout a tick then invalidate size
    const t = setTimeout(() => {
      try {
        leafletMap.invalidateSize();
      } catch (e) {
        // ignore
      }
    }, 0);
    return () => clearTimeout(t);
  }, [leafletMap, isExpanded]);

  // small internal component to access the map instance from within MapContainer
  function MapInitializer({ onMap }: { onMap: (m: LeafletMap) => void }) {
    const map = useMap();
    useEffect(() => {
      onMap(map);
      const t = setTimeout(() => {
        try {
          map.invalidateSize();
        } catch (e) {
          // ignore
        }
      }, 0);
      return () => clearTimeout(t);
    }, [map, onMap]);
    return null;
  }

  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  return (
    <section id="showcase-section" className="bg-background w-full py-24 sm:py-32" aria-labelledby="showcase-heading">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="showcase-heading" className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
            A Sacred Place of Natural Beauty
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            Discover the serene landscape and thoughtful design that makes our cemetery a peaceful sanctuary for remembrance and reflection.
          </p>
        </div>

        <div className="mt-16">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h3 className="text-foreground text-2xl font-semibold">Gallery</h3>
            <div className="no-scrollbar w-full overflow-x-auto sm:w-auto">
              <ToggleGroup
                type="single"
                value={activeFilter}
                onValueChange={(val) => {
                  if (val) setActiveFilter(val);
                }}
                className="justify-center sm:justify-end"
                aria-label="Gallery category filter"
              >
                {categories.map((category) => (
                  <ToggleGroupItem key={category.id} value={category.id} aria-label={`Filter by ${category.label}`} className="whitespace-nowrap">
                    {category.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="focus-visible:ring-primary focus-visible:ring-offset-background block w-full overflow-hidden rounded-xl shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <div className="relative aspect-[4/3]">
                    <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Maximize2 className="h-8 w-8 text-white" />
                      <span className="sr-only">View image</span>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-sm font-semibold text-white drop-shadow-md">{image.caption}</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {filteredImages.length > 6 && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-8">
          <div className="lg:max-w-lg">
            <h3 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Location Highlights</h3>
            <dl className="mt-10 space-y-8">
              {locationFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <dt className="text-foreground text-lg font-medium">{feature.title}</dt>
                    <dd className="text-muted-foreground mt-1 text-base">{feature.description}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Display cemetery map */}

          <div className="h-full w-full rounded-lg border p-2">
            <div className="relative z-1 h-full w-full">
              <MapContainer
                center={[10.249306880563585, 123.797848311330114]}
                maxZoom={25}
                zoom={18}
                scrollWheelZoom={true}
                zoomControl={false}
                className="h-full w-full rounded-lg"
              >
                <MapInitializer onMap={(m) => setLeafletMap(m)} />
                <TileLayer url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={18} maxZoom={25} />
                <Marker position={[10.249306880563585, 123.797848311330114]}>
                  <Popup>
                    Cemetery Location
                    <br /> Explore the grounds.
                  </Popup>
                </Marker>
              </MapContainer>
              {/* Floating location card */}
              <div className="pointer-events-none absolute bottom-2 left-1 z-999 w-full max-w-xs sm:max-w-sm">
                <div className="bg-card pointer-events-auto mx-2 rounded-lg p-4 shadow-lg backdrop-blur-sm">
                  <h4 className="text-foreground text-lg font-semibold">Finisterre Gardenz</h4>
                  <p className="text-muted-foreground mt-1 text-sm">6QXX+C4 Minglanilla, Cebu</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="default"
                      onClick={() => {
                        if (leafletMap) {
                          leafletMap.flyTo([10.249306880563585, 123.797848311330114], 18, { duration: 1.0 });
                          try {
                            leafletMap.invalidateSize();
                          } catch (e) {
                            // ignore
                          }
                        }
                      }}
                    >
                      Explore Map
                    </Button>
                    <Button variant="ghost" onClick={() => setIsExpanded((s) => !s)}>
                      View Gallery
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl border-none bg-transparent p-2 shadow-none" showCloseButton>
          {visibleImages.length > 0 && (
            <div className="relative">
              <motion.img
                key={visibleImages[selectedImage]?.src}
                src={visibleImages[selectedImage]?.src}
                alt={visibleImages[selectedImage]?.alt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-h-[90vh] w-auto rounded-xl object-contain shadow-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="ml-2 h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextImage} aria-label="Next image" className="mr-2 h-12 w-12 rounded-full bg-black/30 text-white hover:bg-black/50">
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-center text-white/90 backdrop-blur-sm">
                <p className="text-sm font-medium">{visibleImages[selectedImage]?.caption}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
