import { Dialog as KonstaDialog, DialogButton } from 'konsta/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { isNativePlatform } from '@/utils/platform.utils'

interface LegendDialogProps {
  isOpen: boolean
  onClose: () => void
  categories: Array<{ key: string; label: string; color: string }>
  statuses: Array<{ key: string; label: string; color: string }>
  facilities: Array<{ key: string; label: string; color: string; icon?: React.ReactNode }>
}

export default function LegendDialog({ isOpen, onClose, categories, statuses, facilities }: LegendDialogProps) {
  const legendContent = (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-semibold">Categories</h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.key} className="flex items-center">
              <span className="mr-3 inline-block h-4 w-4 rounded-sm" style={{ background: c.color }} />
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
