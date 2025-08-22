import { useQuery } from '@tanstack/react-query'
import { Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import { getChambersStats, getSerenityStats } from '@/api/map-stats.api'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MapStats() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Fetch real-time stats
  const {
    data: serenity,
    isLoading: isSerenityLoading,
    error: serenityError
  } = useQuery({
    queryKey: ['map-stats', 'serenity'],
    queryFn: getSerenityStats,
    staleTime: 60_000
  })

  const {
    data: chambers,
    isLoading: isChambersLoading,
    error: chambersError
  } = useQuery({
    queryKey: ['map-stats', 'chambers'],
    queryFn: getChambersStats,
    staleTime: 60_000
  })

  const isLoading = isSerenityLoading || isChambersLoading
  const hasError = Boolean(serenityError || chambersError)

  // Build location data from API responses (exclude Columbarium)
  const locationData = [
    {
      id: 'serenity',
      name: 'Serenity Lawn',
      stats: [
        {
          label: 'Available',
          value: serenity?.available ?? 0,
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/30'
        },
        {
          label: 'Occupied',
          value: serenity?.occupied ?? 0,
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900/30'
        },
        {
          label: 'Reserved',
          value: serenity?.reserved ?? 0,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
        }
      ],
      total:
        serenity?.total ??
        (serenity?.available ?? 0) +
          (serenity?.occupied ?? 0) +
          (serenity?.reserved ?? 0)
    },
    {
      id: 'chambers',
      name: 'Memorial Chambers',
      stats: [
        {
          label: 'Available',
          value: chambers?.available ?? 0,
          color: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/30'
        },
        {
          label: 'Occupied',
          value: chambers?.occupied ?? 0,
          color: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900/30'
        },
        {
          label: 'Reserved',
          value: chambers?.reserved ?? 0,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
        }
      ],
      total:
        chambers?.total ??
        (chambers?.available ?? 0) +
          (chambers?.occupied ?? 0) +
          (chambers?.reserved ?? 0)
    }
  ]

  // Calculate overall totals
  const totals = {
    available: locationData.reduce(
      (sum, loc) => sum + (loc.stats[0]?.value ?? 0),
      0
    ),
    occupied: locationData.reduce(
      (sum, loc) => sum + (loc.stats[1]?.value ?? 0),
      0
    ),
    reserved: locationData.reduce(
      (sum, loc) => sum + (loc.stats[2]?.value ?? 0),
      0
    )
  }

  const totalSpaces = totals.available + totals.occupied + totals.reserved

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Stats Card Component (reused in both desktop and panel)
  const StatsCard = () => (
    <Card className='w-full overflow-hidden border border-white/20 bg-[#f1eff5]/90 p-0 shadow-xl backdrop-blur-md dark:border-stone-700/50 dark:bg-[#16141e]/80'>
      {/* Header */}
      <div className='border-b border-gray-200 px-6 pt-5 pb-3 dark:border-stone-700'>
        <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100'>
          Location Statistics
        </h2>
        <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
          Real-time availability data
        </p>
      </div>

      {/* Summary Stats */}
      <div className='bg-gray-50 px-6 py-5 dark:bg-stone-800/50'>
        {/* Loading / Error States */}
        {isLoading && (
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            Loading statistics…
          </div>
        )}
        {hasError && !isLoading && (
          <div className='text-xs text-red-600 dark:text-red-400'>
            Failed to load some statistics.
          </div>
        )}

        {!isLoading && (
          <>
            <div className='mb-3 flex items-center justify-between'>
              <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                Total Spaces
              </span>
              <Badge
                variant='outline'
                className='px-3 py-1 text-xs font-semibold'
              >
                {totalSpaces}
              </Badge>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20'>
                <div className='text-lg font-bold text-green-600 dark:text-green-400'>
                  {totals.available}
                </div>
                <div className='text-xs text-green-700 dark:text-green-300'>
                  Available
                </div>
              </div>
              <div className='rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20'>
                <div className='text-lg font-bold text-red-600 dark:text-red-400'>
                  {totals.occupied}
                </div>
                <div className='text-xs text-red-700 dark:text-red-300'>
                  Occupied
                </div>
              </div>
              <div className='rounded-lg bg-yellow-50 p-3 text-center dark:bg-yellow-900/20'>
                <div className='text-lg font-bold text-yellow-600 dark:text-yellow-400'>
                  {totals.reserved}
                </div>
                <div className='text-xs text-yellow-700 dark:text-yellow-300'>
                  Reserved
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Location Tabs */}
      <div className='px-2 pt-2 pb-1'>
        <Tabs defaultValue='serenity' className='w-full'>
          <TabsList className='mb-2 grid h-auto w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-stone-800'>
            {locationData.map((location) => (
              <TabsTrigger
                key={location.id}
                value={location.id}
                className='rounded-md px-2 py-2 text-xs transition-colors data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-stone-700'
              >
                {location.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {locationData.map((location) => {
            const locationTotal =
              location.total ??
              location.stats.reduce((sum, stat) => sum + stat.value, 0)

            return (
              <TabsContent
                key={location.id}
                value={location.id}
                className='space-y-5 p-3 pt-1'
              >
                <div>
                  <h3 className='font-semibold text-gray-800 dark:text-gray-100'>
                    {location.name}
                  </h3>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {locationTotal} total spaces
                  </p>
                </div>

                <div className='space-y-4'>
                  {location.stats.map((stat) => {
                    const denominator = locationTotal > 0 ? locationTotal : 1
                    const percentage = Math.round(
                      (stat.value / denominator) * 100
                    )

                    return (
                      <div key={stat.label} className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            {stat.label}
                          </span>
                          <span className={`text-sm font-bold ${stat.color}`}>
                            {stat.value}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Progress value={percentage} className='h-2 flex-1' />
                          <span className='w-8 text-right text-xs text-gray-500 dark:text-gray-400'>
                            {Number.isFinite(percentage) ? percentage : 0}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className='pt-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>
                      Occupancy Rate
                    </span>
                    <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                      {(() => {
                        const denominator =
                          locationTotal > 0 ? locationTotal : 1
                        const occupied = location.stats[1]?.value ?? 0
                        return Math.round((occupied / denominator) * 100)
                      })()}
                      %
                    </span>
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </Card>
  )

  return (
    <>
      {/* Desktop View */}
      <div className='pointer-events-auto absolute top-6 right-6 z-999 hidden lg:block'>
        <StatsCard />
      </div>

      {/* Mobile/Tablet View */}
      <div className='pointer-events-auto absolute top-6 left-6 z-999 lg:hidden'>
        <div className='relative'>
          {/* Burger Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/90 shadow-lg backdrop-blur-md dark:border-stone-700/50 dark:bg-[#16141e]/80'
          >
            {open ? (
              <X className='h-6 w-6 text-gray-700 dark:text-gray-200' />
            ) : (
              <Menu className='h-6 w-6 text-gray-700 dark:text-gray-200' />
            )}
          </button>

          {/* Slide-out Panel */}
          <div
            ref={panelRef}
            className={`absolute top-0 left-0 w-[85vw] max-w-md transform transition-all duration-300 ease-in-out ${
              open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
          >
            <StatsCard />
          </div>
        </div>
      </div>
    </>
  )
}
