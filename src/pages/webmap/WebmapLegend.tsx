import { memo, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp, Maximize2, X } from 'lucide-react'
import { BiSolidChurch } from 'react-icons/bi'
import { FaToilet } from 'react-icons/fa'
import { GiOpenGate } from 'react-icons/gi'
import { MdLocalParking } from 'react-icons/md'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getStatusColor } from '@/types/map.types'

interface LegendItem {
  key: string
  label: string
  color: string
  icon?: React.ReactNode
  shape?: 'circle' | 'square' | 'diamond'
}

const initialOpenSections = {
  categories: true,
  status: true,
  facilities: true,
} as const

// Animation variants
const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
}

const categories: LegendItem[] = [
  { key: 'serenity', label: 'Serenity Lawn', color: '#FFB800', shape: 'circle' },
  { key: 'columbarium', label: 'Columbarium', color: '#2563EB', shape: 'diamond' },
  { key: 'chambers', label: 'Memorial Chambers', color: '#A0816C', shape: 'square' },
]

const statuses: LegendItem[] = [
  { key: 'available', label: 'Available', color: getStatusColor('available') },
  { key: 'occupied', label: 'Occupied', color: getStatusColor('occupied') },
  { key: 'reserved', label: 'Reserved', color: getStatusColor('reserved') },
  { key: 'your-plot', label: 'Your Plot', color: '#2563EB' },
]

const facilities: LegendItem[] = [
  { key: 'restrooms', label: 'Restrooms', color: '#10B981', icon: <FaToilet className="h-3.5 w-3.5" /> },
  { key: 'parking', label: 'Parking', color: '#2563EB', icon: <MdLocalParking className="h-4 w-4" /> },
  { key: 'main-entrance', label: 'Main Entrance', color: '#374151', icon: <GiOpenGate className="h-3.5 w-3.5" /> },
  { key: 'chapel', label: 'Chapel', color: '#F97316', icon: <BiSolidChurch className="h-3.5 w-3.5" /> },
]

function WebmapLegendComponent() {
  const [openSections, setOpenSections] = useState(initialOpenSections)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSection = useCallback((section: keyof typeof initialOpenSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  if (isCollapsed) {
    return (
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 z-100"
        >
          <Button
            variant="secondary"
            size="sm"
            className="h-10 w-10 rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md hover:bg-black/80"
            onClick={toggleCollapse}
            aria-label="Show map legend"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="hidden lg:block">
      <AnimatePresence>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pointer-events-auto absolute top-4 right-4 z-10 w-56 sm:w-64 lg:w-72 max-h-[calc(100vh-2rem)] overflow-hidden rounded-xl sm:rounded-[2rem] border-0 bg-black/60 shadow-2xl backdrop-blur-2xl flex flex-col"
        >
          <Card className="border-0 bg-transparent shadow-none flex flex-col h-full">
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 px-4 pt-4 pb-2 sm:px-5 sm:pt-5 sm:pb-3 shrink-0">
              <div className="space-y-0.5">
                <CardTitle className="text-sm sm:text-base lg:text-lg font-bold leading-tight text-white">
                  Finisterre<br />Map Legend
                </CardTitle>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/10 p-0 text-white/70 hover:bg-white/20 hover:text-white"
                  onClick={toggleCollapse}
                  aria-label="Hide legend"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-4 pt-0 sm:px-5 sm:pb-5 overflow-y-auto custom-scrollbar">
              <div className="space-y-3 sm:space-y-4">
                {/* Categories Section */}
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={() => toggleSection('categories')}
                    className="flex w-full items-center justify-between text-white/90"
                  >
                    <span className="text-xs sm:text-sm font-bold">Categories</span>
                    <ChevronUp className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-transform duration-200", !openSections.categories && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {openSections.categories && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 sm:space-y-2.5 overflow-hidden"
                      >
                        {categories.map((item) => (
                          <div key={item.key} className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center">
                              {item.shape === 'circle' && (
                                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                              )}
                              {item.shape === 'diamond' && (
                                <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-45 shadow-lg" style={{ backgroundColor: item.color }} />
                              )}
                              {item.shape === 'square' && (
                                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-md shadow-lg" style={{ backgroundColor: item.color }} />
                              )}
                            </div>
                            <span className="text-[11px] sm:text-xs font-semibold text-white/80">{item.label}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-[1px] w-full bg-white/10" />

                {/* Status Section */}
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={() => toggleSection('status')}
                    className="flex w-full items-center justify-between text-white/90"
                  >
                    <span className="text-xs sm:text-sm font-bold">Status</span>
                    <ChevronUp className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-transform duration-200", !openSections.status && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {openSections.status && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="grid grid-cols-2 gap-1.5 overflow-hidden"
                      >
                        {statuses.map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-center rounded-full py-1 px-1.5 sm:py-1.5 sm:px-2 shadow-lg transition-transform hover:scale-105"
                            style={{ backgroundColor: item.color }}
                          >
                            <span className="text-[9px] sm:text-[10px] font-bold text-white whitespace-nowrap">{item.label}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-[1px] w-full bg-white/10" />

                {/* Facilities Section */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex w-full items-center justify-between text-white/90">
                    <span className="text-xs sm:text-sm font-bold">Facilities</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-2">
                    {facilities.map((item) => (
                      <div key={item.key} className="flex items-center gap-2 sm:gap-2.5">
                        <div
                          className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg shadow-lg"
                          style={{ backgroundColor: item.color }}
                        >
                          <div className="text-white scale-[0.8] sm:scale-[0.9]">
                            {item.icon}
                          </div>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold leading-tight text-white/80">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Imagery Date */}
                <div className="pt-1 text-center">
                  <p className="text-[9px] font-medium text-white/30">
                    Map Imagery dated December 12, 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export const WebmapLegend = memo(WebmapLegendComponent)

export default WebmapLegend
