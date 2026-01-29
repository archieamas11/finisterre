import { AnimatePresence, motion } from 'framer-motion'
import { BoxSelect, Edit3, MousePointer2 } from 'lucide-react'
import { AiOutlineEnter } from 'react-icons/ai'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MultiEditMarkerInstructionsProps {
  isVisible: boolean
  step: 'draw' | 'selected' | 'dragging'
  selectedCount: number
}

export default function MultiEditMarkerInstructions({ isVisible, step, selectedCount }: MultiEditMarkerInstructionsProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-4 left-4 z-[1000] w-80"
          role="dialog"
          aria-modal="true"
          aria-label="Bulk edit markers"
        >
          <Card
            className={cn(
              'from-background to-muted/80 relative overflow-hidden rounded-xl border-0 bg-gradient-to-br',
              'py-5 shadow-xl backdrop-blur-md',
              'before:absolute before:inset-0 before:z-[-1] before:rounded-xl before:bg-gradient-to-r',
              'before:from-blue-500/10 before:to-transparent',
            )}
          >
            <div className="relative flex flex-col items-center gap-4 px-6 text-center">
              {/* Icon Badge */}
              <div className="flex justify-center">
                <div className="bg-blue-500/10 text-blue-500 flex h-10 w-10 items-center justify-center rounded-full shadow-md">
                  {step === 'draw' ? <BoxSelect className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                </div>
              </div>

              {step === 'draw' ? (
                <>
                  <h3 className="text-base font-semibold">Draw Selection Polygon</h3>
                  <p className="text-muted-foreground text-sm">Click on the map to draw a polygon around markers you want to edit.</p>
                  <div className="bg-muted/50 mx-auto flex w-full flex-col gap-2 rounded-lg px-4 py-3 text-xs leading-tight">
                    <div className="flex items-center justify-center gap-2">
                      <MousePointer2 className="text-muted-foreground h-3 w-3" />
                      <span>Click to add points, double-click to finish</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <kbd className="bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5 font-mono text-xs">Esc</kbd>
                      <span>Press Escape to cancel</span>
                    </div>
                  </div>
                </>
              ) : step === 'selected' ? (
                <>
                  <div>
                    <h3 className="text-base font-semibold">
                      {selectedCount} Marker{selectedCount !== 1 ? 's' : ''} Selected
                    </h3>
                    <p className="text-muted-foreground text-sm">Click and drag any selected marker to move all together.</p>
                  </div>
                  <div className="bg-muted/50 mx-auto flex w-full flex-col gap-2 rounded-lg px-4 py-3 text-xs leading-tight">
                    <div className="flex items-center justify-center gap-2">
                      <MousePointer2 className="text-muted-foreground h-3 w-3" />
                      <span>Drag to reposition group</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <kbd className="bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5 font-mono text-xs">Esc</kbd>
                      <span>Press Escape to cancel</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-base font-semibold">Moving {selectedCount} Markers</h3>
                    <p className="text-muted-foreground text-sm">Release mouse to preview, then save or cancel.</p>
                  </div>
                  <div className="bg-muted/50 mx-auto flex w-full flex-col gap-2 rounded-lg px-4 py-3 text-xs leading-tight">
                    <div className="flex items-center justify-center gap-2">
                      <kbd className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-sm font-mono text-xs">
                        <AiOutlineEnter className="h-3 w-3" />
                      </kbd>
                      <span>Press Enter to save all</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <kbd className="bg-primary text-primary-foreground rounded-sm px-1.5 py-0.5 font-mono text-xs">Esc</kbd>
                      <span>Press Escape to revert</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
