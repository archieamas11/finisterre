import { Card } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AddMarkerInstructionsProps {
  isVisible: boolean;
}

export default function AddMarkerInstructions({ isVisible }: AddMarkerInstructionsProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-4 left-4 z-[1000]"
        >
          <Card
            className={cn(
              "from-background to-muted/80 relative w-80 overflow-hidden rounded-xl border-0 bg-gradient-to-br p-4 shadow-xl backdrop-blur-md",
              "before:from-primary/10 py-10 before:absolute before:inset-0 before:z-[-1] before:rounded-xl before:bg-gradient-to-r before:to-transparent",
            )}
          >
            <div className="relative flex flex-col items-center gap-3">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full shadow-md">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>

              <div className="pt-8 text-center">
                <h3 className="mb-1 text-base font-semibold">Add Plot Marker</h3>
                <p className="text-muted-foreground mb-3 text-sm">Click anywhere on the map to place a new marker</p>
                <div className="bg-muted/50 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs">
                  <Plus className="text-muted-foreground h-3 w-3" />
                  <span>Click plus button again to cancel</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
