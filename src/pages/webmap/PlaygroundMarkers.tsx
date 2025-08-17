import FinisterreMarkers from "@/components/ui/popup-content";

interface Props {
  onDirectionClick?: (dest: [number, number]) => void;
  isDirectionLoading?: boolean;
}

const playgrounds = [
  {
    id: "playground-1",
    lat: 10.248972753171127,
    lng: 123.79755735707532,
    title: "Playground 1",
    description: "Fun for all ages",
    imageSrc: "https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg",
  },
  {
    id: "playground-2",
    lat: 10.249180343704229,
    lng: 123.798238818160755,
    title: "Playground 2",
    description: "Newly built playground",
    imageSrc: "https://res.cloudinary.com/djrkvgfvo/image/upload/v1753206700/playground_mxeqep.jpg",
  },
];

export default function PlaygroundMarkers({ onDirectionClick, isDirectionLoading }: Props) {
  return <FinisterreMarkers playgrounds={playgrounds} onDirectionClick={onDirectionClick} isDirectionLoading={isDirectionLoading} />;
}
