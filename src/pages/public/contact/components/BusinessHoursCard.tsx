import { Clock } from 'lucide-react'

import type { BusinessHour } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BUSINESS_HOURS } from '../constants'

export function BusinessHoursCard() {
  return (
    <Card aria-labelledby="business-hours-heading" className="border-white/50 bg-white/50 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
          <Clock className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle id="business-hours-heading" className="text-lg font-bold text-[var(--brand-primary)]">
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <ul className="space-y-3">
          {BUSINESS_HOURS.map((item: BusinessHour) => (
            <li key={item.day} className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium text-gray-700">{item.day}</span>
              <span className="text-gray-500">{item.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
