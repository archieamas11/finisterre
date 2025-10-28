'use client'

import type { ChartConfig } from '@/components/ui/chart'
import * as React from 'react'
import { PrinterIcon } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLotsTimeSeries } from '@/hooks/map-stats-hooks/ChartStats'
import { useIsMobile } from '@/hooks/use-mobile'
import PrintableAreaChart from './components/PrintableAreaChart'

export const description = 'Interactive chart of new customers created per day by category'

type Range = '7d' | '30d' | '90d' | '1y'

const chartConfig = {
  serenity: {
    label: 'Serenity',
    color: 'var(--chart-1)',
  },
  columbarium: {
    label: 'Columbarium',
    color: 'var(--chart-2)',
  },
  chambers: {
    label: 'Chambers',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<Range>('90d')
  const { data: queryData, isPending, isError, error } = useLotsTimeSeries(timeRange)
  const data = queryData ?? []

  React.useEffect(() => {
    if (isMobile) setTimeRange('7d')
  }, [isMobile])

  const descLong = timeRange === '1y' ? 'Last 12 months' : timeRange === '90d' ? 'Last 90 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 7 days'

  // Prepare printable summary as totals over the selected range (more meaningful than just the last day)
  const serenitySum = data.reduce((s, d) => s + (Number((d as any).serenity) || 0), 0)
  const columbariumSum = data.reduce((s, d) => s + (Number((d as any).columbarium) || 0), 0)
  const chambersSum = data.reduce((s, d) => s + (Number((d as any).chambers) || 0), 0)

  const series = [
    { label: 'Serenity', value: serenitySum },
    { label: 'Columbarium', value: columbariumSum },
    { label: 'Chambers', value: chambersSum },
  ]
  const total = serenitySum + columbariumSum + chambersSum
  const printRef = React.useRef<HTMLDivElement>(null)
  const doPrint = useReactToPrint({ contentRef: printRef, documentTitle: `New customers Created — ${descLong}` })

  function printButton() {
    return (
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={doPrint}
          aria-label="Print chart"
          size="icon"
          className="text-muted-foreground hover:text-foreground ml-2"
        >
          <PrinterIcon />
        </Button>
      </div>
    )
  }
  return (
    <Card className="@container/card flex h-full flex-col">
      <CardHeader>
        <CardTitle>New Customers Created</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Daily counts by category • {descLong}</span>
          <span className="@[540px]/card:hidden">{descLong}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            onValueChange={(v) => v && setTimeRange(v as Range)}
            value={timeRange}
            variant="outline"
            type="single"
          >
            <ToggleGroupItem value="1y">Last year</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 90 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            {printButton()}
          </ToggleGroup>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Select onValueChange={(v) => setTimeRange(v as Range)} value={timeRange}>
              <SelectTrigger
                className="flex min-h-9 w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                aria-label="Select range"
                size="sm"
              >
                <SelectValue placeholder="Last 90 days" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem className="rounded-lg" value="1y">
                  Last year
                </SelectItem>
                <SelectItem className="rounded-lg" value="90d">
                  Last 90 days
                </SelectItem>
                <SelectItem className="rounded-lg" value="30d">
                  Last 30 days
                </SelectItem>
                <SelectItem className="rounded-lg" value="7d">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="**:data-[slot=select-value]:truncate @[767px]/card:hidden">{printButton()}</div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Hidden printable summary */}
        <PrintableAreaChart ref={printRef} title="New Lots Created" description={description} period={descLong} total={total} series={series} />
        <div className="relative h-full min-h-0 w-full">
          <ChartContainer className="h-full min-h-0 w-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="fillSerenity" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="var(--color-serenity)" stopOpacity={0.9} offset="5%" />
                    <stop stopColor="var(--color-serenity)" stopOpacity={0.08} offset="95%" />
                  </linearGradient>
                  <linearGradient id="fillColumbarium" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="var(--color-columbarium)" stopOpacity={0.8} offset="5%" />
                    <stop stopColor="var(--color-columbarium)" stopOpacity={0.08} offset="95%" />
                  </linearGradient>
                  <linearGradient id="fillChambers" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="var(--color-chambers)" stopOpacity={0.8} offset="5%" />
                    <stop stopColor="var(--color-chambers)" stopOpacity={0.08} offset="95%" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  minTickGap={32}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const d = new Date(`${value}T00:00:00`)
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  defaultIndex={isMobile ? -1 : 10}
                  content={
                    <ChartTooltipContent
                      indicator="dot"
                      labelFormatter={(value) =>
                        new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      }
                    />
                  }
                />
                <Area type="natural" stackId="a" dataKey="serenity" stroke="var(--color-serenity)" fill="url(#fillSerenity)" />
                <Area type="natural" stackId="a" dataKey="columbarium" stroke="var(--color-columbarium)" fill="url(#fillColumbarium)" />
                <Area type="natural" stackId="a" dataKey="chambers" stroke="var(--color-chambers)" fill="url(#fillChambers)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          {isPending && <div className="text-muted-foreground absolute inset-0 flex items-center justify-center text-xs">Loading…</div>}
          {isError && !isPending && <div className="text-destructive absolute inset-0 flex items-center justify-center text-xs">{error.message}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
