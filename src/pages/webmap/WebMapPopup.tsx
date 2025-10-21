import { motion } from 'framer-motion'
import { Award, Info, MapPin, Ruler } from 'lucide-react'
import { BiCheckCircle, BiXCircle } from 'react-icons/bi'
import { BsPersonHeart } from 'react-icons/bs'
import { FaHourglassStart } from 'react-icons/fa'

import { CardDescription, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/useAuth'
import { useDeceasedForPlot } from '@/hooks/useDeceasedForPlot'
import { cn } from '@/lib/utils'
import GetDirectionButton from '@/pages/webmap/components/get-direction-button'
import { ShareButton } from '@/pages/webmap/components/share-button'
import { type DeceasedData } from '@/types/deceased.types'
import { type ConvertedMarker } from '@/types/map.types'
import { calculateYearsBuried } from '@/utils/date.utils'

interface PlotLocationsProps {
  marker: ConvertedMarker
  backgroundColor?: string
  onDirectionClick?: () => void
  isDirectionLoading?: boolean
}

export default function PlotLocations({ marker, backgroundColor, onDirectionClick, isDirectionLoading = false }: PlotLocationsProps) {
  const { isAuthenticated } = useAuth()
  const { data: deceasedData, isLoading: isDeceasedLoading } = useDeceasedForPlot(marker.plot_id)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-5">
      <div className="bg-background dark:bg-muted rounded-t-lg p-3 transition-colors" style={backgroundColor ? { background: backgroundColor } : {}}>
        <CardDescription className="text-primary-background font-medium">Finisterre</CardDescription>
        <CardTitle className="text-primary-background font-bold">Plot Information</CardTitle>
      </div>
      <div className="bg-accent mb-3 rounded-b-lg p-2 transition-colors">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <MapPin className="text-accent-foreground" size={16} />
            <span className="text-accent-foreground text-sm leading-none font-medium">{marker.location}</span>
          </div>
          <div className="flex gap-2">
            <GetDirectionButton
              className="h-8 w-8 rounded-full text-white"
              isLoading={isDirectionLoading}
              onClick={onDirectionClick}
              style={backgroundColor ? { background: backgroundColor } : {}}
            />
            <ShareButton
              coords={[marker.position[0], marker.position[1]]}
              location={marker.location}
              className="h-8 w-8 rounded-full"
              variant={'default'}
              size={'icon'}
            />
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="bg-accent mb-3 rounded-lg p-3 shadow-sm transition-colors">
          <div className="mb-3 flex items-center gap-2">
            <BsPersonHeart className="text-accent-foreground" size={18} />
            <span className="text-foreground text-sm font-semibold">Deceased Information</span>
          </div>
          {isDeceasedLoading ? (
            <div className="flex items-center justify-center py-4">
              <Spinner className="h-5 w-5" />
            </div>
          ) : deceasedData && deceasedData.length > 0 ? (
            <div className="space-y-3">
              {deceasedData.map((deceased: DeceasedData) => (
                <div key={deceased.deceased_id} className="border-accent-foreground border-b p-3 last:border-0">
                  <div className="text-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
                    <BsPersonHeart size={14} className="text-muted-foreground" />
                    {deceased.dead_fullname}
                  </div>
                  <div className="text-muted-foreground space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Death Date:</span>
                      <span>{new Date(deceased.dead_date_death).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Interment Date:</span>
                      <span>{new Date(deceased.dead_interment).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Burial Years:</span>
                      <span>{calculateYearsBuried(deceased.dead_interment)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-4 text-center text-sm">No deceased information in this plot yet</div>
          )}
        </div>
      )}

      <div className="bg-accent mb-3 flex items-center justify-between gap-2 rounded-lg p-2 shadow-sm transition-colors">
        <div className="flex items-center gap-1">
          <Info className="text-primary/80 dark:text-primary leading-none" size={16} />
          <span className="text-foreground text-sm leading-none">Plot Status</span>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold',
            marker.plotStatus === 'reserved' && 'bg-yellow-100 text-yellow-800',
            marker.plotStatus === 'occupied' && 'bg-red-100 text-red-800',
            marker.plotStatus !== 'reserved' && marker.plotStatus !== 'occupied' && 'bg-green-100 text-green-800',
          )}
        >
          {marker.plotStatus === 'reserved' && <FaHourglassStart size={10} />}
          {marker.plotStatus === 'occupied' && <BiXCircle size={14} />}
          {marker.plotStatus === 'available' && <BiCheckCircle size={14} />}
          {!['reserved', 'occupied', 'available'].includes(marker.plotStatus)}
          <span className="text-xs capitalize">{marker.plotStatus}</span>
        </div>
      </div>
      <div className="mb-3 flex gap-2">
        <div className="bg-accent flex-1 rounded-lg p-2 shadow-sm transition-colors">
          <div className="text-accent-foreground mb-1 flex items-center gap-1">
            <Ruler size={16} />
            <span className="text-xs font-semibold">Dimension</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-foreground text-xs font-bold">
              {marker.dimensions.length} m × {marker.dimensions.width} m<br />
            </div>
            <span className="text-muted-foreground text-xs">{marker.dimensions.area.toLocaleString()} m²</span>
          </div>
        </div>
        <div className="bg-accent flex-1 rounded-lg p-2 shadow-sm transition-colors">
          <div className="mb-1 flex items-center gap-1">
            <Info className="text-primary/80 dark:text-primary" size={16} />
            <span className="text-foreground text-xs font-semibold">Details</span>
          </div>
          <span
            className={cn(
              'flex items-center justify-center rounded-full py-1 text-xs font-semibold',
              marker.category === 'bronze' && 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200',
              marker.category === 'silver' && 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
              marker.category !== 'bronze' && marker.category !== 'silver' && 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200',
            )}
          >
            <Award className="inline" size={14} />
            {marker.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
