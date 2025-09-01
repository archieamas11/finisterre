import React from 'react'

import { Badge } from '@/components/ui/badge'

type AnnouncementCardProps = {
  title: string
  description: string
  date?: string
  isNew?: boolean
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ title, description, date, isNew }) => (
  <div className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50">
    <div className="flex-1 space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {isNew && (
          <Badge variant="default" className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
            New
          </Badge>
        )}
      </div>
      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
      <p className="text-xs text-slate-500 dark:text-slate-500">{date}</p>
    </div>
  </div>
)
