import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldCheck, TrendingUp, Medal, Wrench, MapIcon, Leaf, ArrowRight } from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  image: string;
  imagePosition: "bottom" | "top" | "right";
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Lifetime Memorial Rights",
    description: "Secure your family's legacy for generations.",
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    imagePosition: "bottom",
  },
  {
    icon: TrendingUp,
    title: "Growing Value",
    description: "Watch your investment appreciate over time.",
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    imagePosition: "top",
  },
  {
    icon: Medal,
    title: "Premier Grounds",
    description: "World-class spaces of dignity and comfort.",
    color: "from-amber-500 to-orange-600",
    image: "https://picsum.photos/200/300",
    imagePosition: "top",
  },
  {
    icon: Wrench,
    title: "Complete Services",
    description: "Modern equipment and expert care.",
    color: "from-rose-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    imagePosition: "top",
  },
  {
    icon: MapIcon,
    title: "Digital Map",
    description: "Find memorials easily online.",
    color: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    imagePosition: "right",
  },
  {
    icon: Leaf,
    title: "Serene Gardens",
    description: "Peaceful, beautifully maintained spaces.",
    color: "from-lime-500 to-green-600",
    image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    imagePosition: "top",
  },
];

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "border border-gray-200 backdrop-blur-sm dark:border-gray-700",
        "flex h-full flex-col",
      )}
    >
      {/* Image overlay with position based on imagePosition */}
      <div
        className={cn(
          "absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20",
          "bg-cover bg-center",
          feature.imagePosition === "bottom" && "bg-bottom",
          feature.imagePosition === "top" && "bg-top",
          feature.imagePosition === "right" && "bg-right",
        )}
        style={{ backgroundImage: `url(${feature.image})` }}
      />

      <CardHeader className="relative z-10 pb-2">
        <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-lg", "bg-gradient-to-br text-white shadow-md", feature.color)}>
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-grow flex-col">
        <CardDescription className="mb-4 flex-grow text-gray-600 dark:text-gray-300">{feature.description}</CardDescription>

        <Button
          variant="ghost"
          className={cn(
            "h-auto justify-start p-0 transition-transform duration-300 group-hover:translate-x-1",
            "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
          )}
        >
          Learn more <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

const FeatureSection = () => {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-[85%]">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 rounded-full border-gray-200 bg-white px-4 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800">
            Our Promise
          </Badge>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-white">Why Choose Finisterre</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            A sacred place inspired by El Camino de Santiago, providing peace, dignity, and beauty for generations to come.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
