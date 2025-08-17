import FinisterreMarkers from "@/components/ui/popup-content";

const playgrounds = [
  {
    id: "Serinity",
    lat: 10.249306880563585,
    lng: 123.797848311330114,
    title: "Serinity Lawn Center",
    description: "Center view of serinity lawn",
    imageSrc: "https://res.cloudinary.com/djrkvgfvo/image/upload/v1755253760/Finisterre-Gardenz-columbarium_ewopci.png",
  },
];

export default function CenterSerenityMarkers() {
  return <FinisterreMarkers playgrounds={playgrounds} />;
}
