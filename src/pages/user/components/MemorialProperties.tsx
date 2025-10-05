import { MapPin } from 'lucide-react'
import React from 'react'
import { BsPersonHeart } from 'react-icons/bs'
import { HiLibrary } from 'react-icons/hi'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { calculateYearsBuried, formatDate } from '@/utils/date.utils'

import type { Lot, Deceased, Coordinates } from './types'
type Props = {
  lot: Lot
  records: Deceased[]
  onNavigate: (coordinates?: Coordinates | null) => void
}
export const MemorialProperties: React.FC<Props> = ({ lot, records, onNavigate }) => {
  const plotTitle = `Block ${lot.block ?? '—'}`
  const graveInfo = lot.category ? lot.category : lot.niche_number ? `Niche ${lot.niche_number}` : '—'
  return (
    <div className="lg:bg-accent/30 lg:rounded-xl lg:border lg:border-dashed lg:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full sm:w-auto">
          <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="text-base" aria-hidden="true">
                <HiLibrary />
              </span>
              Property Information
            </span>
          </h4>
          <div className="mt-2">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{plotTitle}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{graveInfo}</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="mt-1 w-full shadow sm:w-auto" onClick={() => onNavigate(lot.coordinates)}>
          <MapPin className="mr-1 h-4 w-4" /> Navigate
        </Button>
      </div>
      <div className="mt-2 border-t border-slate-200 pt-4 dark:border-slate-700">
        <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
          <span className="flex items-center text-base" aria-hidden="true">
            <BsPersonHeart />
          </span>
          Deceased Information
        </h5>
        {records.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-400">
            No memorial records found for this plot.
          </div>
        )}
        {records.map((rec) => {
          const deathDate = formatDate(rec.dead_date_death)
          const intermentDate = formatDate(rec.dead_interment)
          const yearsLabel = calculateYearsBuried(rec.dead_interment)
          return (
            <div
              key={rec.deceased_id}
              className="mb-3 rounded-lg border border-slate-200 bg-slate-100/60 p-4 shadow-inner last:mb-0 dark:border-slate-700 dark:bg-slate-900/40"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Deceased ID: {rec.deceased_id}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{rec.dead_fullname}</p>
                </div>
                <div className="grid w-full grid-cols-1 gap-3 text-sm sm:w-auto sm:grid-cols-2">
                  <div>
                    <p className="font-medium text-slate-500 dark:text-slate-400">Death Date:</p>
                    <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-200">{deathDate}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-500 dark:text-slate-400">Interment:</p>
                    <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-200">{intermentDate}</p>
                  </div>
                </div>
                <div className="flex w-full items-start justify-start sm:w-auto sm:items-center sm:justify-end">
                  <Badge
                    variant="outline"
                    className="border-indigo-300 bg-indigo-50 text-[10px] font-medium whitespace-nowrap text-indigo-700 sm:text-xs dark:border-indigo-700/50 dark:bg-indigo-900/40 dark:text-indigo-300"
                  >
                    {yearsLabel}
                  </Badge>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
