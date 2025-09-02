import { Dialog as KonstaDialog, DialogButton } from 'konsta/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { isNativePlatform } from '@/utils/platform.utils'
import { getStatusColor } from '@/types/map.types'
import { MdLocalParking } from 'react-icons/md'
import { FaToilet } from 'react-icons/fa'
import { BiSolidChurch } from 'react-icons/bi'
import { GiOpenGate } from 'react-icons/gi'

interface LegendDialogProps {
  isOpen: boolean
  onClose: () => void
}

const categories = [
  { key: 'serenity', label: 'Serenity Lawn', color: '#90EE90', shape: 'circle' },
  { key: 'columbarium', label: 'Columbarium', color: '#FFD700', shape: 'diamond' },
  { key: 'chambers', label: 'Memorial Chambers', color: '#87CEEB', shape: 'square' },
]

const statuses = [
  { key: 'available', label: 'Available', color: getStatusColor('available') },
  { key: 'occupied', label: 'Occupied', color: getStatusColor('occupied') },
  { key: 'reserved', label: 'Reserved', color: getStatusColor('reserved') },
  { key: 'my-plots', label: 'Your Plots', color: '#2563EB' },
]

const facilities = [
  { key: 'comfort-room', label: 'Comfort Room', color: '#059669', icon: <FaToilet className="h-4 w-4" /> },
  { key: 'parking', label: 'Parking', color: '#2563EB', icon: <MdLocalParking className="h-4 w-4" /> },
  { key: 'main-entrance', label: 'Main Entrance', color: '#000000', icon: <GiOpenGate className="h-4 w-4" /> },
  { key: 'chapel', label: 'Chapel', color: '#FF9800', icon: <BiSolidChurch className="h-4 w-4" /> },
]

export default function LegendDialog({ isOpen, onClose }: LegendDialogProps) {
  const legendContent = (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-semibold">Categories</h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.key} className="flex items-center">
              <div className="mr-3 flex h-4 w-4 items-center justify-center">
                {c.shape === 'circle' && <div className="bg-primary h-3 w-3 rounded-full shadow-sm" />}
                {c.shape === 'diamond' && <div className="bg-primary h-3 w-3 rotate-45 shadow-sm" />}
                {c.shape === 'square' && <div className="bg-primary h-3 w-3 shadow-sm" />}
              </div>
              <span className="text-sm">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">Status</h4>
        <div className="space-y-2">
          {statuses.map((s) => (
            <div key={s.key} className="flex items-center">
              <span className="mr-3 inline-block h-3 w-8 rounded-md" style={{ background: s.color }} />
              <span className="text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">Facilities</h4>
        <div className="space-y-2">
          {facilities.map((f) => (
            <div key={f.key} className="flex items-center">
              {f.icon ? (
                <div className="mr-3 flex h-4 w-4 items-center justify-center rounded-sm text-white" style={{ background: f.color }}>
                  {f.icon}
                </div>
              ) : (
                <span className="mr-3 inline-block h-4 w-4 rounded-sm" style={{ background: f.color }} />
              )}
              <span className="text-sm">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {isNativePlatform() ? (
        <KonstaDialog
          opened={isOpen}
          onBackdropClick={onClose}
          title="Map Legend"
          content={legendContent}
          buttons={
            <DialogButton strongIos onClick={onClose} className="bg-black/20">
              Close
            </DialogButton>
          }
        />
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Map Legend</DialogTitle>
            </DialogHeader>
            {legendContent}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
