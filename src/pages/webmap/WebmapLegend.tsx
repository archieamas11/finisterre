import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp, Minimize2, Maximize2, X } from 'lucide-react'
import { useState, useCallback } from 'react'
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

interface LegendSection {
  title: string
  items: LegendItem[]
  key: keyof typeof initialOpenSections
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

const sectionVariants = {
  closed: {
    height: 0,
    opacity: 0,
  },
  open: {
    height: 'auto',
    opacity: 1,
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
}

const buttonVariants = {
  hover: {
    scale: 1.05,
  },
  tap: {
    scale: 0.95,
  },
}

export default function WebmapLegend() {
  const [openSections, setOpenSections] = useState(initialOpenSections)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const categories: LegendItem[] = [
    { key: 'serenity', label: 'Serenity Lawn', color: '#FFFF', shape: 'circle' },
    { key: 'columbarium', label: 'Columbarium', color: '#FFFF', shape: 'diamond' },
    { key: 'chambers', label: 'Memorial Chambers', color: '#FFFF', shape: 'square' },
  ]

  const statuses: LegendItem[] = [
    { key: 'available', label: 'Available', color: getStatusColor('available') },
    { key: 'occupied', label: 'Occupied', color: getStatusColor('occupied') },
    { key: 'reserved', label: 'Reserved', color: getStatusColor('reserved') },
    { key: 'your-plot', label: 'Your Plot', color: '#2563EB' },
  ]

  const facilities: LegendItem[] = [
    { key: 'comfort-room', label: 'Comfort Room', color: '#059669', icon: <FaToilet className="h-3.5 w-3.5" /> },
    { key: 'parking', label: 'Parking', color: '#2563EB', icon: <MdLocalParking className="h-3.5 w-3.5" /> },
    { key: 'main-entrance', label: 'Main Entrance', color: '#000000', icon: <GiOpenGate className="h-3.5 w-3.5" /> },
    { key: 'chapel', label: 'Chapel', color: '#FF9800', icon: <BiSolidChurch className="h-3.5 w-3.5" /> },
  ]

  const sections: LegendSection[] = [
    { title: 'Categories', items: categories, key: 'categories' },
    { title: 'Status', items: statuses, key: 'status' },
    { title: 'Facilities', items: facilities, key: 'facilities' },
  ]

  const toggleSection = useCallback((section: keyof typeof initialOpenSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev)
  }, [])

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  if (isCollapsed) {
    return (
      <div className="hidden lg:block">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}>
          <Button variant="secondary" size="sm" className="absolute top-4 right-4 z-100 h-8 w-8 rounded-full" onClick={toggleCollapse} aria-label="Show map legend" asChild>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.1 }}>
              <ChevronUp className="h-4 w-4" />
            </motion.button>
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
          className="border-border bg-floating-card pointer-events-auto absolute top-4 right-4 z-100 w-64 rounded-xl border shadow-2xl backdrop-blur-md"
        >
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
              <CardTitle className="text-foreground text-sm font-semibold">Map Legend</CardTitle>
              <div className="flex items-center gap-1">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted/50 h-6 w-6 p-0"
                    onClick={toggleMinimize}
                    aria-label={isMinimized ? 'Expand legend' : 'Minimize legend'}
                  >
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button variant="ghost" size="sm" className="hover:bg-muted/50 h-6 w-6 p-0" onClick={toggleCollapse} aria-label="Hide legend">
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              </div>
            </CardHeader>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <CardContent className="p-0">
                    {sections.map((section, index) => (
                      <motion.div
                        key={section.key}
                        className={cn('border-border', { 'border-b': index < sections.length - 1 })}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' }}
                      >
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <Button
                            variant="ghost"
                            className="hover:bg-muted/50 flex h-auto w-full items-center justify-between px-4 py-3 text-xs font-medium transition-colors duration-150"
                            onClick={() => toggleSection(section.key)}
                            aria-expanded={openSections[section.key]}
                            aria-controls={`${section.key}-content`}
                          >
                            <span className="text-foreground">{section.title}</span>
                            <motion.div animate={{ rotate: openSections[section.key] ? 0 : 180 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
                              <ChevronUp className="text-muted-foreground h-4 w-4" />
                            </motion.div>
                          </Button>
                        </motion.div>

                        <AnimatePresence>
                          {openSections[section.key] && (
                            <motion.div
                              variants={sectionVariants}
                              initial="closed"
                              animate="open"
                              exit="closed"
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2 px-4 pb-4">
                                {section.items.map((item, itemIndex) => (
                                  <motion.div
                                    key={item.key}
                                    className="-m-1 flex items-center rounded-md p-1"
                                    title={item.label}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: itemIndex * 0.05, duration: 0.2, ease: 'easeOut' }}
                                  >
                                    {item.icon ? (
                                      <motion.div
                                        className="mr-3 flex h-6 w-6 items-center justify-center rounded-md text-white shadow-sm"
                                        style={{ background: item.color }}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.1 }}
                                      >
                                        {item.icon}
                                      </motion.div>
                                    ) : section.key === 'categories' && item.shape ? (
                                      <motion.div className="mr-3 flex h-6 w-6 items-center justify-center" whileHover={{ scale: 1.1 }} transition={{ duration: 0.1 }}>
                                        {item.shape === 'circle' && <div className="bg-primary h-3 w-3 rounded-full shadow-sm" />}
                                        {item.shape === 'diamond' && <div className="bg-primary h-3 w-3 rotate-45 shadow-sm" />}
                                        {item.shape === 'square' && <div className="bg-primary h-3 w-3 shadow-sm" />}
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        className={cn('mr-3 h-3 rounded-md shadow-sm', {
                                          'w-6': section.key === 'status',
                                          'w-3': section.key !== 'status',
                                        })}
                                        style={{ background: item.color }}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.1 }}
                                      />
                                    )}
                                    <span className="text-muted-foreground text-xs font-medium">{item.label}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
