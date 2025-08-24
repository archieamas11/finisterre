import { motion, AnimatePresence } from "framer-motion";
import { Edit, MousePointer } from "lucide-react";
import { AiOutlineEnter } from "react-icons/ai";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EditMarkerInstructionsProps {
  isVisible: boolean;
  step: "select" | "edit";
}

export default function EditMarkerInstructions({ isVisible, step }: EditMarkerInstructionsProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-4 left-4 z-[1000] w-80"
          role="dialog"
          aria-modal="true"
          aria-label={step === "select" ? "Select marker to edit" : "Edit marker position"}
        >
          <Card
            className={cn(
              "from-background to-muted/80 relative overflow-hidden rounded-xl border-0 bg-gradient-to-br",
              "py-5 shadow-xl backdrop-blur-md",
              "before:absolute before:inset-0 before:z-[-1] before:rounded-xl before:bg-gradient-to-r",
              "before:from-primary/10 before:to-transparent",
            )}
          >
            <div className="relative flex flex-col items-center gap-4 px-6 text-center">
              {/* Icon Badge */}
              <div className="flex justify-center">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full shadow-md">
                  <Edit className="h-5 w-5" />
                </div>
              </div>

              {step === "select" ? (
                <>
                  <h3 className="text-base font-semibold">Edit Plot Marker</h3>
                  <p className="text-muted-foreground text-sm">Click on any marker to select it for editing.</p>
                  <div className="bg-muted/50 mx-auto flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs">
                    <MousePointer className="text-muted-foreground h-3 w-3" />
                    <span>Press Edit again or Esc to cancel</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-base font-semibold">Move Selected Marker</h3>
                    <p className="text-muted-foreground text-sm">Drag the marker to your desired location.</p>
                  </div>
                  <div className="bg-muted/50 mx-auto flex w-full flex-col gap-2 rounded-lg px-4 py-3 text-xs leading-tight">
                    <div className="flex items-center justify-center gap-2">
                      <kbd className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-sm font-mono text-xs">
                        <AiOutlineEnter className="h-3 w-3" />
                      </kbd>
                      <span>Press Enter to save</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <kbd className="bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5 font-mono text-xs">Esc</kbd>
                      <span>Press Escape to cancel</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
