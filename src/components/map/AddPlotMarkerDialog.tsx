import { useState } from 'react'

import type { MarkerType } from '@/types/map.types'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { ColumbariumStep } from './add-plot-marker-dialog/ColumbariumStep'
import { MarkerTypeStep } from './add-plot-marker-dialog/MarkerTypeStep'
import { MemorialChambersStep } from './add-plot-marker-dialog/MemorialChambersStep'
import { SerenityLawnStep } from './add-plot-marker-dialog/SerenityLawnStep'

interface AddPlotMarkerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coordinates: [number, number] | null
  // Called when a plot is successfully created and we should resume add mode
  onDoneAdd?: () => void
  // Called when user cancels adding; should end the add session
  onCancelAdd?: () => void
}

export default function AddPlotMarkerDialog({ open, onOpenChange, coordinates, onDoneAdd, onCancelAdd }: AddPlotMarkerDialogProps) {
  const [selectedMarkerType, setSelectedMarkerType] = useState<MarkerType | null>(null)
  // Inner dialog controls the second step (type-specific form)
  const [innerOpen, setInnerOpen] = useState(false)

  // Reset all forms
  const resetAllForms = () => {
    setSelectedMarkerType(null)
    setInnerOpen(false)
  }

  // Handle marker type selection and move to next step
  const onMarkerTypeSelect = (type: MarkerType) => {
    setSelectedMarkerType(type)
    setInnerOpen(true)
  }

  // Handle cancel - clear forms and close
  const onCancel = () => {
    resetAllForms()
    // Notify parent that the add session was explicitly cancelled
    onCancelAdd?.()
    onOpenChange(false)
  }

  // Handle dialog close - reset forms and state
  const onDialogOpenChange = (nextOpen: boolean) => {
    if (nextOpen === open) return
    if (!nextOpen) {
      resetAllForms()
    }
    onOpenChange(nextOpen)
  }

  return (
    <>
      {/* First dialog: choose marker type */}
      <Dialog open={open} onOpenChange={onDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Marker Type</DialogTitle>
            <DialogDescription>Choose the type of plot marker to add.</DialogDescription>
          </DialogHeader>
          <MarkerTypeStep onCancel={onCancel} onContinue={onMarkerTypeSelect} />
        </DialogContent>
      </Dialog>

      {/* Second dialog (nested): type-specific form */}
      <Dialog open={innerOpen} onOpenChange={setInnerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMarkerType === 'Serenity Lawn' && 'Add Serenity Lawn Plot'}
              {selectedMarkerType === 'Memorial Chambers' && 'Add Memorial Chambers'}
              {selectedMarkerType === 'Columbarium' && 'Add Columbarium'}
              {!selectedMarkerType && 'Select Marker Type First'}
            </DialogTitle>
            <DialogDescription>
              {selectedMarkerType ? 'Provide the required details then save the plot.' : 'Go back and choose a marker type to proceed.'}
            </DialogDescription>
          </DialogHeader>
          {selectedMarkerType === 'Serenity Lawn' && (
            <SerenityLawnStep
              coordinates={coordinates}
              onBack={() => setInnerOpen(false)}
              onCancel={onCancel}
              onDone={() => {
                resetAllForms()
                // Inform parent to resume add mode after successful save
                onDoneAdd?.()
                onOpenChange(false)
              }}
            />
          )}

          {selectedMarkerType === 'Memorial Chambers' && (
            <MemorialChambersStep
              coordinates={coordinates}
              onBack={() => setInnerOpen(false)}
              onCancel={onCancel}
              onDone={() => {
                resetAllForms()
                onDoneAdd?.()
                onOpenChange(false)
              }}
            />
          )}

          {selectedMarkerType === 'Columbarium' && (
            <ColumbariumStep
              coordinates={coordinates}
              onBack={() => setInnerOpen(false)}
              onCancel={onCancel}
              onDone={() => {
                resetAllForms()
                onDoneAdd?.()
                onOpenChange(false)
              }}
            />
          )}

          {!selectedMarkerType && (
            <div className="text-muted-foreground py-8 text-center">
              <p>Please go back and select a marker type first.</p>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setInnerOpen(false)}>
                  Back
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
