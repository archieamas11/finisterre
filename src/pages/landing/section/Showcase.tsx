import { useState } from 'react';
import { MapPin, Camera, Play, ChevronLeft, ChevronRight, Maximize2, Clock, Trees, Mountain, X } from 'lucide-react';

const galleryImages = [
    {
        id: 1,
        src: "https://picsum.photos/id/1015/800/600",
        alt: "Panoramic view of peaceful cemetery grounds with rolling hills",
        caption: "Panoramic view of our 150-acre grounds nestled in the rolling countryside",
        category: "panoramic"
    },
    {
        id: 2,
        src: "https://picsum.photos/id/1025/800/600",
        alt: "Spring blossoms throughout the cemetery pathways",
        caption: "Spring transformation with cherry blossoms lining memorial pathways",
        category: "seasonal"
    },
    {
        id: 3,
        src: "https://picsum.photos/id/1035/800/600",
        alt: "Aerial view showing the full expanse of the cemetery property",
        caption: "Aerial perspective showcasing the thoughtful layout and natural integration",
        category: "aerial"
    },
    {
        id: 4,
        src: "https://picsum.photos/id/1045/800/600",
        alt: "Historic monument with intricate architectural details",
        caption: "Historic memorial featuring 19th-century craftsmanship and artistry",
        category: "architecture"
    },
    {
        id: 5,
        src: "https://picsum.photos/id/1055/800/600",
        alt: "Golden sunset casting peaceful light across the grounds",
        caption: "Evening tranquility as golden hour illuminates the sacred grounds",
        category: "sunset"
    },
    {
        id: 6,
        src: "https://picsum.photos/id/1065/800/600",
        alt: "Carefully maintained memorial gardens with seasonal flowers",
        caption: "Memorial gardens featuring native plants and seasonal displays",
        category: "gardens"
    }
];

const locationFeatures = [
    {
        icon: MapPin,
        title: "Prime Location",
        description: "Situated on 150 acres of pristine countryside, just 15 minutes from downtown"
    },
    {
        icon: Trees,
        title: "Natural Setting",
        description: "Surrounded by mature oak trees and native wildlife preserves"
    },
    {
        icon: Mountain,
        title: "Scenic Views",
        description: "Overlooking the Blue Ridge Mountains with year-round natural beauty"
    },
    {
        icon: Clock,
        title: "Historic Heritage",
        description: "Established in 1847, featuring monuments of significant historical importance"
    }
];

export default function CemeteryShowcase() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    const categories = [
        { id: 'all', label: 'All Views' },
        { id: 'panoramic', label: 'Panoramic' },
        { id: 'seasonal', label: 'Seasonal' },
        { id: 'aerial', label: 'Aerial' },
        { id: 'architecture', label: 'Architecture' },
        { id: 'sunset', label: 'Golden Hour' },
        { id: 'gardens', label: 'Gardens' }
    ];

    const filteredImages = activeFilter === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === activeFilter);

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % filteredImages.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    };

    const openLightbox = (index: number) => {
        setSelectedImage(index);
        setIsLightboxOpen(true);
    };

    return (
        <section
            id="showcase-section"
            className="py-20 bg-card w-full"
            aria-labelledby="showcase-heading"
        >
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                        A Sacred Place of Natural Beauty
                    </h2>
                    <p className="text-xl max-w-3xl mx-auto text-muted-foreground">
                        Discover the serene landscape and thoughtful design that makes our cemetery
                        a peaceful sanctuary for remembrance and reflection
                    </p>
                </div>

                {/* Photo Gallery */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-semibold text-foreground">
                            Gallery
                        </h3>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeFilter === category.id
                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                        : 'bg-background text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredImages.map((image, index) => (
                            <div
                                key={image.id}
                                className="group relative overflow-hidden rounded-xl cursor-pointer"
                                onClick={() => openLightbox(index)}
                            >
                                <div className="aspect-w-16 aspect-h-12 bg-muted">
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Maximize2 size={32} className="text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 object-cover">
                                    <p className="text-white text-sm font-medium">{image.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location Highlights */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Interactive Map Section */}
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-background border border-muted">
                        <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-200 relative">
                            {/* Mock Interactive Map */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full opacity-30 bg-muted"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                                    }} />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-card rounded-lg p-6 shadow-lg text-center">
                                        <MapPin size={32} className="text-primary mx-auto mb-2" />
                                        <h4 className="font-semibold text-foreground mb-1">Interactive Map</h4>
                                        <p className="text-sm text-muted-foreground">Explore our grounds</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4">
                                <button className="bg-card text-foreground px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2">
                                    <Camera size={16} />
                                    <span className="text-sm font-medium">Virtual Tour</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                Peaceful Valley Cemetery
                            </h3>
                            <p className="text-sm mb-4 text-muted-foreground">
                                123 Memorial Drive, Springfield Valley, IL 62701
                            </p>
                            <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                                <Play size={18} />
                                <span>Take Virtual Tour</span>
                            </button>
                        </div>
                    </div>

                    {/* Location Features */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-foreground">
                            Location Highlights
                        </h3>

                        <div className="space-y-6">
                            {locationFeatures.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-muted">
                                            <IconComponent size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1 text-foreground">
                                                {feature.title}
                                            </h4>
                                            <p className="text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 p-6 rounded-xl bg-background border border-muted">
                            <h4 className="font-semibold mb-3 text-foreground">
                                Accessibility & Amenities
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
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

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 text-white hover:text-primary z-10"
                        >
                            <X size={32} />
                        </button>

                        <div className="relative">
                            <img
                                src={filteredImages[selectedImage]?.src}
                                alt={filteredImages[selectedImage]?.alt}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg bg-background border border-muted"
                            />

                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary bg-black bg-opacity-50 rounded-full p-2"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary bg-black bg-opacity-50 rounded-full p-2"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-foreground text-lg font-medium">
                                {filteredImages[selectedImage]?.caption}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}