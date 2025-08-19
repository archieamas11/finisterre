import FinisterreMarkers from "@/components/ui/popup-content";

interface Props {
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

const playgrounds = [
  {
    id: "Serinity",
    lat: 10.249306880563585,
    lng: 123.797848311330114,
    title: "Serinity Lawn",
    description: "Center view of serinity lawn",
    imageSrc: "https://res.cloudinary.com/djrkvgfvo/image/upload/v1755253760/Finisterre-Gardenz-columbarium_ewopci.png",
  },
];

export default function CenterSerenityMarkers({ onDirectionClick, isDirectionLoading = false }: Props) {
  return <FinisterreMarkers playgrounds={playgrounds} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />;
}
