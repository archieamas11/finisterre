import type { CustomMarkerData } from "@/components/ui/popup-content";

import CustomMarkers from "@/components/ui/popup-content";

interface Props {
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

const centerSerenityMarkersData: CustomMarkerData[] = [
  {
    id: "Serinity",
    lat: 10.249306880563585,
    lng: 123.797848311330114,
    title: "Serenity Lawn - Central Landmark",
    description: "A tranquil centerpiece of Finisterre, ideal for reflection and gatherings. Enjoy panoramic views and peaceful surroundings.",
    marker: {
      type: "image",
      source: "https://res.cloudinary.com/djrkvgfvo/image/upload/v1755253760/Finisterre-Gardenz-columbarium_ewopci.png",
    },
    popupType: "image",
  },
];

export default function CenterSerenityMarkers({ onDirectionClick, isDirectionLoading = false }: Props) {
  return <CustomMarkers items={centerSerenityMarkersData} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />;
}
