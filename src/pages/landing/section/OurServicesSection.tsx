import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const services = [
    {
        title: "Interment Services",
        description:
            "Professional and compassionate burial services tailored to your needs.",
        icon: "🕊️",
    },
    {
        title: "Memorial Planning",
        description: "Personalized memorial events to honor your loved ones.",
        icon: "📅",
    },
    {
        title: "Landscaping & Care",
        description:
            "Beautifully maintained gardens and spaces for reflection.",
        icon: "🌳",
    },
    {
        title: "Digital Map Access",
        description:
            "Easily locate plots and navigate the park with our interactive map.",
        icon: "🗺️",
    },
];

export function OurServicesSection() {
    return (
        <section
            className="w-full py-16"
            aria-labelledby="our-services-heading"
            id="our-services-section"
        >
            <div className="max-w-5xl mx-auto px-6">
                <h2
                    id="about-section-heading"
                    className="text-4xl font-extrabold text-center text-foreground mb-2 tracking-tight"
                >
                    Our Services
                </h2>
                <p className="text-lg text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
                    Discover the range of services we offer to support you and your
                    family.
                </p>
                <Separator className="my-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service) => (
                        <Card
                            key={service.title}
                            className="flex flex-col items-center p-8 bg-card border border-muted rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 group"
                            tabIndex={0}
                            aria-label={service.title}
                        >
                            <span
                                className="text-6xl mb-5 group-hover:scale-110 transition-transform"
                                aria-label={service.title + " icon"}
                                role="img"
                            >
                                {service.icon}
                            </span>
                            <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
                                {service.title}
                            </h3>
                            <p className="text-muted-foreground text-center mb-6">
                                {service.description}
                            </p>
                            <Button
                                variant="outline"
                                className="px-4 py-1 rounded-full text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label={`Learn more about ${service.title}`}
                            >
                                Learn More
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
