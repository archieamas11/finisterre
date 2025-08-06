import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const services = [
  {
    icon: "🕊️",
    title: "Interment Services",
    description:
      "Professional and compassionate burial services tailored to your needs.",
  },
  {
    icon: "📅",
    title: "Memorial Planning",
    description: "Personalized memorial events to honor your loved ones.",
  },
  {
    icon: "🌳",
    title: "Landscaping & Care",
    description: "Beautifully maintained gardens and spaces for reflection.",
  },
  {
    icon: "🗺️",
    title: "Digital Map Access",
    description:
      "Easily locate plots and navigate the park with our interactive map.",
  },
];

export default function OurServicesSection() {
  return (
    <section
      aria-labelledby="our-services-heading"
      id="our-services-section"
      className="w-full py-16"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2
          className="text-foreground mb-2 text-center text-4xl font-extrabold tracking-tight"
          id="about-section-heading"
        >
          Our Services
        </h2>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-center text-lg">
          Discover the range of services we offer to support you and your
          family.
        </p>
        <Separator className="my-8" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              className="bg-card border-muted group flex flex-col items-center rounded-2xl border p-8 shadow-md transition-all duration-200 hover:shadow-lg"
              aria-label={service.title}
              key={service.title}
              tabIndex={0}
            >
              <span
                className="mb-5 text-6xl transition-transform group-hover:scale-110"
                aria-label={service.title + " icon"}
                role="img"
              >
                {service.icon}
              </span>
              <h3 className="text-foreground mb-2 text-center text-xl font-semibold">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 text-center">
                {service.description}
              </p>
              <Button
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground rounded-full px-4 py-1 transition-colors"
                aria-label={`Learn more about ${service.title}`}
                variant="outline"
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
