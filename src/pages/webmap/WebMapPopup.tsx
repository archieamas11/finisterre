import { motion } from 'framer-motion'
import { Info, Star } from 'lucide-react'
import { BiCheckCircle, BiXCircle } from 'react-icons/bi'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { FaCross, FaHourglassStart } from 'react-icons/fa'

import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/useAuth'
import { useDeceasedForPlot } from '@/hooks/useDeceasedForPlot'
import { cn } from '@/lib/utils'
import GetDirectionButton from '@/pages/webmap/components/get-direction-button'
import { ShareButton } from '@/pages/webmap/components/share-button'
import { type DeceasedData } from '@/types/deceased.types'
import { type ConvertedMarker } from '@/types/map.types'

interface PlotLocationsProps {
  marker: ConvertedMarker
  colors?: { background: string; text: string }
  onDirectionClick?: () => void
  isDirectionLoading?: boolean
}

export default function PlotLocations({ marker, colors, onDirectionClick, isDirectionLoading = false }: PlotLocationsProps) {
  const { isAuthenticated } = useAuth()
  const { data: deceasedData, isLoading: isDeceasedLoading } = useDeceasedForPlot(marker.plot_id)

  // Friendly, consistent date formatter across sections
  const dateFmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' })

  // Visual + icon mapping for plot status
  const getStatusProps = (status: string) => {
    switch (status) {
      case 'reserved':
        return {
          className: 'bg-amber-100 text-amber-900',
          Icon: FaHourglassStart,
          label: 'Reserved',
        }
      case 'occupied':
        return {
          className: 'bg-red-100 text-red-800',
          Icon: BiXCircle,
          label: 'Occupied',
        }
      case 'available':
        return {
          className: 'bg-emerald-100 text-emerald-800',
          Icon: BiCheckCircle,
          label: 'Available',
        }
      default:
        return {
          className: 'bg-muted text-foreground/80',
          Icon: Info,
          label: status,
        }
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-4.5">
      <div className="bg-accent mb-2 rounded-lg p-3 shadow-sm transition-colors">
        <div className="flex justify-between">
          <div className="space-y-1">
            <div className="text-foreground font-bold text-lg leading-none">Plot Information</div>
            <div className="text-foreground/80 text-sm leading-none">{marker.location}</div>
          </div>
          <div className="flex gap-1">
            <GetDirectionButton
              className="rounded-full shadow-md"
              size={'icon'}
              variant={'default'}
              isLoading={isDirectionLoading}
              onClick={onDirectionClick}
            />
            <ShareButton
              className="rounded-full shadow-md"
              size={'icon'}
              variant={'default'}
              coords={[marker.position[0], marker.position[1]]}
              location={marker.location}
            />
          </div>
        </div>
      </div>

      {/* Plot status */}
      <div className="bg-accent mb-2 flex items-center justify-between gap-2 rounded-lg p-2 px-4 shadow-sm transition-colors">
        <span className="text-foreground flex leading-none">
          <BsFillInfoCircleFill className="text-accent-foreground mr-1" />
          Plot Status
        </span>
        {(() => {
          const { className, Icon, label } = getStatusProps(marker.plotStatus)
          return (
            <div
              className={cn('flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold', className)}
              aria-label={`Plot status: ${label}`}
              title={`Plot status: ${label}`}
            >
              <Icon size={12} />
              <span className="text-xs capitalize">{label}</span>
            </div>
          )
        })()}
      </div>

      {/* Deceased information */}
      {isAuthenticated && (
        <div className="bg-accent mb-2 rounded-lg p-3 shadow-sm transition-colors">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-foreground flex leading-none">
              <FaCross className="text-accent-foreground mr-1" />
              Deceased Information
            </span>
          </div>
          {isDeceasedLoading ? (
            <div className="flex items-center justify-center py-4" aria-live="polite" aria-busy>
              <Spinner className="h-5 w-5" />
            </div>
          ) : deceasedData && deceasedData.length > 0 ? (
            <ul className="space-y-3">
              {deceasedData.map((deceased: DeceasedData) => (
                <li key={deceased.deceased_id} className="border-accent-foreground/50 border-b last:border-0">
                  <div className="border p-2 text-center rounded-md border-muted-foreground/50">
                    <div className="text-foreground mb-2 flex gap-2 text-sm font-semibold text-center justify-center">
                      <span>{deceased.dead_fullname}</span>
                    </div>
                    <dl className="text-muted-foreground text-xs">
                      <dd>
                        {dateFmt.format(new Date(deceased.dead_birth_date))} - {dateFmt.format(new Date(deceased.dead_date_death))}
                      </dd>
                      {/* 
                      <dt className="font-medium">Interment Date:</dt>
                      <dd className="sm:col-start-2 whitespace-nowrap">{dateFmt.format(new Date(deceased.dead_interment))}</dd> */}
                      {/* 
                      <dt className="font-medium">Years Buried:</dt>
                      <dd className="sm:col-start-2 whitespace-nowrap">{calculateYearsBuried(deceased.dead_interment)}</dd> */}
                    </dl>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground py-4 text-center text-sm">This plot is empty</div>
          )}
        </div>
      )}

      {/* Plot classification */}
      <div className="w-full mb-2">
        <div className="w-full">
          <span
            className={cn('w-full px-3 py-2 rounded min-h-[32px] flex justify-center items-center gap-1 text-center')}
            style={colors ? { background: colors.background, color: colors.text } : {}}
          >
            <Star className="h-4" />
            <span className="capitalize font-medium">{marker.category} Plot</span>
          </span>
        </div>
      </div>

      {/* Dimension */}
      <div className="bg-accent mb-4 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-1">
            <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Dimensions</div>
            <div className="text-foreground text-base font-semibold">
              {marker.dimensions.length} × {marker.dimensions.width} m
            </div>
          </div>
          <div className="text-center space-y-1 border-l border-border">
            <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Total Area</div>
            <div className="text-foreground text-base font-semibold">{marker.dimensions.area.toLocaleString()} m²</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
