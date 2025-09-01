import { ChevronDown, ChevronUp, Megaphone, Calendar, Clock, Info } from 'lucide-react'
import React, { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AnnouncementType = 'general' | 'event' | 'maintenance' | 'important'

type AnnouncementCardProps = {
  title: string
  description: string
  fullDescription?: string
  date?: string
  isNew?: boolean
  type?: AnnouncementType
  onClick?: () => void
  className?: string
}

const typeConfig = {
  general: {
    icon: Megaphone,
    color: 'from-blue-500 to-purple-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  event: {
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  maintenance: {
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
  },
  important: {
    icon: Info,
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
  },
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ title, description, fullDescription, date, isNew = false, type = 'general', onClick, className }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = typeConfig[type]
  const Icon = config.icon

  const handleClick = () => {
    if (fullDescription) {
      setIsExpanded(!isExpanded)
    }
    onClick?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      className={cn(
        'group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50',
        fullDescription && 'cursor-pointer',
        isExpanded && 'ring-2 ring-blue-500/20',
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={fullDescription ? 0 : -1}
      role={fullDescription ? 'button' : undefined}
      aria-expanded={fullDescription ? isExpanded : undefined}
      aria-label={fullDescription ? `${title} - ${isExpanded ? 'Collapse' : 'Expand'} details` : title}
    >
      {/* Icon */}
      <div className={'flex-shrink-0 rounded-lg p-2'}>
        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg leading-tight font-semibold text-slate-900 dark:text-white">{title}</h3>
          <div className="ml-2 flex items-center gap-2">
            {isNew && (
              <Badge variant="default" className={cn('bg-gradient-to-r px-2 py-0.5 text-xs text-white shadow-lg', config.color)}>
                New
              </Badge>
            )}
            {fullDescription && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label={isExpanded ? 'Collapse announcement' : 'Expand announcement'}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        <p className={cn('text-sm leading-relaxed text-slate-600 dark:text-slate-400', !isExpanded && 'line-clamp-2')}>
          {isExpanded && fullDescription ? fullDescription : description}
        </p>

        <div className="flex items-center justify-between">
          {date && <p className="text-xs text-slate-500 dark:text-slate-500">{date}</p>}
          {fullDescription && !isExpanded && <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Click to read more</span>}
        </div>
      </div>
    </div>
  )
}
