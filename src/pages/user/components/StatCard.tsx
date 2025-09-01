import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatCardProps = {
  title: string
  value: number | string
  description?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  colorClass?: string
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, colorClass = '' }) => (
  <Card className={`group relative overflow-hidden border-0 bg-gradient-to-br ${colorClass} shadow-lg`}>
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
    <CardHeader className="flex items-center justify-between pb-3">
      <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</CardTitle>
      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </CardContent>
  </Card>
)
