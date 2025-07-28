import { Card } from "@/components/ui/card";

export default function AdminMap() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card className="p-2 shadow-lg w-full h-full">
        <img
          src="https://picsum.photos/400/200"
          alt="Sample map"
          className="rounded-md object-cover"
        />
      </Card>
    </div>
  );
}
