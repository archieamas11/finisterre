import { motion } from 'framer-motion'
import { MapPin, Award, Ruler, Info } from 'lucide-react'
import { BiXCircle } from 'react-icons/bi'
import { BiCheckCircle } from 'react-icons/bi'
import { FaDirections } from 'react-icons/fa'
import { FaHourglassStart } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { type ConvertedMarker } from '@/types/map.types'
interface PlotLocationsProps {
  marker: ConvertedMarker
  backgroundColor?: string
  onDirectionClick?: () => void
  isDirectionLoading?: boolean
}

export default function PlotLocations({
  marker,
  backgroundColor,
  onDirectionClick,
  isDirectionLoading = false
}: PlotLocationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='mt-5'
    >
      <div
        className='bg-background dark:bg-muted rounded-t-lg p-3 transition-colors'
        style={backgroundColor ? { background: backgroundColor } : {}}
      >
        <CardDescription className='text-primary-background'>
          Finisterre
        </CardDescription>
        <CardTitle className='text-primary-background'>
          Plot Information
        </CardTitle>
      </div>
      <div className='bg-accent/60 dark:bg-accent/80 mb-3 rounded-b-lg p-2 transition-colors'>
        <div className='flex items-center justify-between gap-1'>
          <div className='flex items-center gap-1'>
            <MapPin className='text-primary/80 dark:text-primary' size={16} />
            <span className='text-foreground text-sm leading-none font-medium'>
              {marker.location}
            </span>
          </div>
          <Button
            className='flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-colors'
            style={backgroundColor ? { background: backgroundColor } : {}}
            onClick={onDirectionClick}
            disabled={isDirectionLoading}
            aria-busy={isDirectionLoading}
            type='button'
            variant='secondary'
          >
            {isDirectionLoading ? (
              <Spinner className='h-4 w-4 text-white' />
            ) : (
              <FaDirections className='text-white' />
            )}
          </Button>
        </div>
      </div>
      {/* Plot Status */}
      <div className='bg-accent/40 dark:bg-accent/60 mb-3 flex items-center justify-between gap-2 rounded-lg p-2 shadow-sm transition-colors'>
        <div className='flex items-center gap-1'>
          <Info
            className='text-primary/80 dark:text-primary leading-none'
            size={16}
          />
          <span className='text-foreground text-sm leading-none'>
            Plot Status
          </span>
        </div>
        <span
          className={cn(
            'flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-semibold',
            marker.plotStatus === 'reserved' && 'bg-yellow-100 text-yellow-800',
            marker.plotStatus === 'occupied' && 'bg-red-100 text-red-800',
            marker.plotStatus !== 'reserved' &&
              marker.plotStatus !== 'occupied' &&
              'bg-green-100 text-green-800'
          )}
        >
          {/* 🟢 Show only the relevant icon for each plotStatus */}
          {marker.plotStatus === 'reserved' && <FaHourglassStart size={10} />}
          {marker.plotStatus === 'occupied' && <BiXCircle size={14} />}
          {marker.plotStatus === 'available' && <BiCheckCircle size={14} />}
          {!['reserved', 'occupied', 'available'].includes(marker.plotStatus)}
          <span className='text-xs capitalize'>{marker.plotStatus}</span>
        </span>
      </div>
      {/* Plot Dimension */}
      <div className='mb-3 flex gap-2'>
        <div className='bg-accent/40 dark:bg-accent/60 flex-1 rounded-lg p-2 shadow-sm transition-colors'>
          <div className='mb-1 flex items-center gap-1'>
            <Ruler className='text-blue-600 dark:text-blue-300' size={16} />
            <span className='text-xs font-semibold text-blue-700 dark:text-blue-200'>
              Dimension
            </span>
          </div>
          <div className='flex flex-col items-center'>
            <div className='text-foreground text-xs font-bold'>
              {marker.dimensions.length} m × {marker.dimensions.width} m<br />
            </div>
            <span className='text-muted-foreground text-xs'>
              {marker.dimensions.area.toLocaleString()} m²
            </span>
          </div>
        </div>
        <div className='bg-accent/40 dark:bg-accent/60 flex-1 rounded-lg p-2 shadow-sm transition-colors'>
          <div className='mb-1 flex items-center gap-1'>
            <Info className='text-primary/80 dark:text-primary' size={16} />
            <span className='text-foreground text-xs font-semibold'>
              Details
            </span>
          </div>
          <span
            className={cn(
              'flex items-center justify-center rounded-full py-1 text-xs font-semibold',
              marker.category === 'bronze' &&
                'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200',
              marker.category === 'silver' &&
                'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
              marker.category !== 'bronze' &&
                marker.category !== 'silver' &&
                'bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200'
            )}
          >
            <Award className='inline' size={14} />
            {marker.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
