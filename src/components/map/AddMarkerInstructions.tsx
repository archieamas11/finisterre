import { Card } from "@/components/ui/card";

interface AddMarkerInstructionsProps {
  isVisible: boolean;
}

export default function AddMarkerInstructions({ isVisible }: AddMarkerInstructionsProps) {
  if (!isVisible) return null;

  return (
    <Card className="bg-background/90 pointer-events-none absolute top-20 left-1/2 z-[1000] -translate-x-1/2 p-4 text-center shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-medium">
        🎯 <span>Click anywhere on the map to add a new plot marker</span>
      </div>
      <div className="text-muted-foreground mt-1 text-xs">Click the ➕ button again to cancel</div>
    </Card>
  );
}
