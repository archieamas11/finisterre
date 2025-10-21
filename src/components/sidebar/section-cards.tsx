import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useOverallMapStats } from '@/hooks/map-stats-hooks/useOverallMapStats'
import { cn } from '@/lib/utils'

function StatSkeleton() {
  return (
    <Card className="@container/card animate-pulse">
      <CardHeader>
        <div className="bg-muted/50 h-4 w-24 rounded" />
        <div className="bg-muted/50 mt-2 h-8 w-20 rounded" />
        <div className="bg-muted/50 mt-2 h-6 w-24 rounded" />
      </CardHeader>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="bg-muted/50 h-4 w-40 rounded" />
        <div className="bg-muted/40 h-3 w-52 rounded" />
      </CardFooter>
    </Card>
  )
}

export function SectionCards() {
  const { data, isLoading, isError } = useOverallMapStats()

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <div className="bg-destructive/5 text-destructive col-span-1 rounded border p-4 text-sm @xl/main:col-span-2">
          Failed to load plot statistics.
        </div>
      </div>
    )
  }

  const { total, occupied, available, reserved, occupancyRate, availableRate, reservedRate } = data

  const cards = [
    {
      key: 'total',
      title: 'Total Capacity',
      value: total,
      badge: `${occupancyRate}% occupied`,
      icon: <IconTrendingUp className="size-4" />,
      description: 'Combined slots across all plot categories',
      trendLabel: 'Overall capacity',
      iconPositive: true,
    },
    {
      key: 'occupied',
      title: 'Occupied Plots',
      value: occupied,
      badge: `${occupancyRate}% of total`,
      icon: <IconTrendingDown className="size-4" />,
      description: 'Currently in use (interments)',
      trendLabel: 'Active burials',
      iconPositive: false,
    },
    {
      key: 'available',
      title: 'Available Plots',
      value: available,
      badge: `${availableRate}% open`,
      icon: <IconTrendingUp className="size-4" />,
      description: 'Ready for reservation or purchase',
      trendLabel: 'Open capacity',
      iconPositive: true,
    },
    {
      key: 'reserved',
      title: 'Reserved Plots',
      value: reserved,
      badge: `${reservedRate}% pending`,
      icon: <IconTrendingUp className="size-4" />,
      description: 'Reserved awaiting future interment',
      trendLabel: 'Pending use',
      iconPositive: true,
    },
  ] as const

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.key} className="@container/card">
          <CardHeader>
            <CardDescription>{c.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{c.value.toLocaleString()}</CardTitle>
            <CardAction>
              <Badge variant="outline" className="flex items-center gap-1.5">
                {c.icon}
                {c.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div
              className={cn('line-clamp-1 flex gap-2 font-medium', {
                'text-emerald-600 dark:text-emerald-400': c.iconPositive,
                'text-rose-600 dark:text-rose-400': !c.iconPositive,
              })}
            >
              {c.trendLabel} {c.icon}
            </div>
            <div className="text-muted-foreground">{c.description}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
