import { ChevronUp, Minimize2, Maximize2, X } from 'lucide-react'
import { useState, useCallback } from 'react'
import { BiSolidChurch } from 'react-icons/bi'
import { FaToilet } from 'react-icons/fa'
import { GiOpenGate } from 'react-icons/gi'
import { MdLocalParking } from 'react-icons/md'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCategoryBackgroundColor, getStatusColor } from '@/types/map.types'

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

export default function WebmapLegend() {
  const [openSections, setOpenSections] = useState(initialOpenSections)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const categories: LegendItem[] = [
    { key: 'serenity', label: 'Serenity Lawn', color: getCategoryBackgroundColor('Serenity Lawn'), shape: 'circle' },
    { key: 'columbarium', label: 'Columbarium', color: getCategoryBackgroundColor('Columbarium'), shape: 'diamond' },
    { key: 'chambers', label: 'Memorial Chambers', color: getCategoryBackgroundColor('Chambers'), shape: 'square' },
  ]

  const statuses: LegendItem[] = [
    { key: 'available', label: 'Available', color: getStatusColor('available') },
    { key: 'occupied', label: 'Occupied', color: getStatusColor('occupied') },
    { key: 'reserved', label: 'Reserved', color: getStatusColor('reserved') },
    { key: 'your-plot', label: 'Your Plot', color: '#2563EB' },
  ]

  const facilities: LegendItem[] = [
    { key: 'comfort-room', label: 'Comfort Room', color: '#059669', icon: <FaToilet className="h-3 w-3" /> },
    { key: 'parking', label: 'Parking', color: '#2563EB', icon: <MdLocalParking className="h-3 w-3" /> },
    { key: 'main-entrance', label: 'Main Entrance', color: '#000000', icon: <GiOpenGate className="h-3 w-3" /> },
    { key: 'chapel', label: 'Chapel', color: '#FF9800', icon: <BiSolidChurch className="h-3 w-3" /> },
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
        <Button variant="secondary" size="sm" className="absolute top-4 right-4 z-100 h-8 w-8 rounded-full" onClick={toggleCollapse} aria-label="Show map legend">
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="hidden lg:block">
      <Card className="border-border bg-floating-card pointer-events-auto absolute top-4 right-4 z-100 w-64 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
          <CardTitle className="text-foreground text-sm font-semibold">Map Legend</CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="hover:bg-muted/50 h-6 w-6 p-0" onClick={toggleMinimize} aria-label={isMinimized ? 'Expand legend' : 'Minimize legend'}>
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted/50 h-6 w-6 p-0" onClick={toggleCollapse} aria-label="Hide legend">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {sections.map((section, index) => (
              <div key={section.key} className={`border-border ${index < sections.length - 1 ? 'border-b' : ''}`}>
                <Button
                  variant="ghost"
                  className="hover:bg-muted/50 flex h-auto w-full items-center justify-between px-4 py-3 text-xs font-medium transition-colors duration-150"
                  onClick={() => toggleSection(section.key)}
                  aria-expanded={openSections[section.key]}
                  aria-controls={`${section.key}-content`}
                >
                  <span className="text-foreground">{section.title}</span>
                  <ChevronUp className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${openSections[section.key] ? 'rotate-0' : 'rotate-180'}`} />
                </Button>

                <div
                  id={`${section.key}-content`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections[section.key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="space-y-2 px-4 pb-4">
                    {section.items.map((item) => (
                      <div key={item.key} className="group hover:bg-muted/30 -m-1 flex items-center rounded-md p-1 transition-colors duration-150" title={item.label}>
                        {item.icon ? (
                          <div
                            className="mr-3 flex h-6 w-6 items-center justify-center rounded-md text-white shadow-sm transition-transform duration-150 group-hover:scale-105"
                            style={{ background: item.color }}
                          >
                            {item.icon}
                          </div>
                        ) : section.key === 'categories' && item.shape ? (
                          <div className="mr-3 flex h-6 w-6 items-center justify-center">
                            {item.shape === 'circle' && (
                              <div className="h-3 w-3 rounded-full shadow-sm transition-transform duration-150 group-hover:scale-105" style={{ background: item.color }} />
                            )}
                            {item.shape === 'square' && (
                              <div className="h-3 w-3 rounded-none shadow-sm transition-transform duration-150 group-hover:scale-105" style={{ background: item.color }} />
                            )}
                            {item.shape === 'diamond' && (
                              <div
                                className="h-3 w-3 shadow-sm transition-transform duration-150 group-hover:scale-105"
                                style={{ background: item.color, transform: 'rotate(45deg)' }}
                              />
                            )}
                          </div>
                        ) : (
                          <div
                            className={`mr-3 h-3 w-6 rounded-md shadow-sm transition-transform duration-150 group-hover:scale-105 ${section.key === 'status' ? 'w-6' : 'w-3'}`}
                            style={{ background: item.color }}
                          />
                        )}
                        <span className="text-muted-foreground group-hover:text-foreground text-xs font-medium transition-colors duration-150">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
