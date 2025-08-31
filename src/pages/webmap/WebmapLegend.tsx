import { BiSolidChurch } from 'react-icons/bi'
import { FaToilet } from 'react-icons/fa'
import { GiOpenGate } from 'react-icons/gi'
import { MdLocalParking } from 'react-icons/md'

import { getCategoryBackgroundColor, getStatusColor } from '@/types/map.types'

export default function WebmapLegend() {
  const categories = [
    { key: 'serenity', label: 'Serenity Lawn', color: getCategoryBackgroundColor('Serenity Lawn') },
    { key: 'columbarium', label: 'Columbarium', color: getCategoryBackgroundColor('Columbarium') },
    { key: 'chambers', label: 'Memorial Chambers', color: getCategoryBackgroundColor('Chambers') },
  ]

  const statuses = [
    { key: 'available', label: 'Available', color: getStatusColor('available') },
    { key: 'occupied', label: 'Occupied', color: getStatusColor('occupied') },
    { key: 'reserved', label: 'Reserved', color: getStatusColor('reserved') },
    { key: 'your-plot', label: 'Your Plot', color: '#2563EB' },
  ]

  const facilities = [
    { key: 'comfort-room', label: 'Comfort Room', color: '#059669', icon: <FaToilet className="h-4 w-4" /> },
    { key: 'parking', label: 'Parking', color: '#2563EB', icon: <MdLocalParking className="h-4 w-4" /> },
    { key: 'main-entrance', label: 'Main Entrance', color: '#000000', icon: <GiOpenGate className="h-4 w-4" /> },
    { key: 'chapel', label: 'Chapel', color: '#FF9800', icon: <BiSolidChurch className="h-4 w-4" /> },
  ]

  return (
    <div className="hidden lg:block">
      <div className="bg-floating-card pointer-events-auto absolute top-4 right-4 z-[1000] w-50 rounded-lg">
        <div className="p-3">
          <h4 className="text-primary mb-2 text-sm font-semibold">Map legend</h4>

          <div className="mb-3">
            <div className="text-primary text-xs font-medium">Categories</div>
            <div className="mt-2 space-y-2">
              {categories.map((c) => (
                <div key={c.key} className="flex items-center">
                  <span className="mr-3 inline-block h-4 w-4 rounded-sm" style={{ background: c.color }} />
                  <span className="text-primary text-sm">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-primary text-xs font-medium">Status</div>
            <div className="mt-2 space-y-2">
              {statuses.map((s) => (
                <div key={s.key} className="flex items-center">
                  <span className="mr-3 inline-block h-3 w-8 rounded-md" style={{ background: s.color }} />
                  <span className="text-primary text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-primary text-xs font-medium">Facilities</div>
            <div className="mt-2 space-y-2">
              {facilities.map((f) => (
                <div key={f.key} className="flex items-center">
                  {f.icon ? (
                    <div className="mr-3 flex h-4 w-4 items-center justify-center rounded-sm text-white" style={{ background: f.color }}>
                      {f.icon}
                    </div>
                  ) : (
                    <span className="mr-3 inline-block h-4 w-4 rounded-sm" style={{ background: f.color }} />
                  )}
                  <span className="text-primary text-sm">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
