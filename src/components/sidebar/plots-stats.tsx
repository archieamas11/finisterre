import type { ChartConfig } from '@/components/ui/chart'
import React from 'react'
import { PrinterIcon } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useLotsMonthlyShare } from '@/hooks/map-stats-hooks/PlotSalesStats'
import PrintableAreaChart from './components/PrintableAreaChart'

export const description = 'Monthly distribution of newly created lots by category'

const chartConfig = {
  serenity: { label: 'Serenity', color: 'var(--chart-1)' },
  columbarium: { label: 'Columbarium', color: 'var(--chart-2)' },
  memorial: { label: 'Chambers', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function ChartAreaStackedExpand() {
  const { data = [], isPending, isError, error } = useLotsMonthlyShare()

  const latest = data.length ? data[data.length - 1] : undefined
  const title = 'Lots Distribution'
  const period = 'Last 12 months'
  const series = latest
    ? [
        { label: 'Serenity', value: Number(latest.serenity) || 0 },
        { label: 'Columbarium', value: Number(latest.columbarium) || 0 },
        { label: 'Chambers', value: Number(latest.memorial) || 0 },
      ]
    : [
        { label: 'Serenity', value: 0 },
        { label: 'Columbarium', value: 0 },
        { label: 'Chambers', value: 0 },
      ]
  const total = series.reduce((s, p) => s + p.value, 0)

  const printRef = React.useRef<HTMLDivElement>(null)
  const doPrint = useReactToPrint({ contentRef: printRef, documentTitle: title })

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between sm:flex-row sm:items-center">
        <div className="space-y-1">
          <CardTitle>Lots Distribution</CardTitle>
          <CardDescription>Serenity Lawn • Columbarium • Memorial Chambers — last 12 months</CardDescription>
        </div>
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
      </CardHeader>
      <CardContent>
        {/* Hidden printable summary */}
        <PrintableAreaChart ref={printRef} title={title} description={description} period={period} total={total} series={series} />
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12, top: 12 }} stackOffset="expand">
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => String(value).slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="memorial" type="natural" fill="var(--color-memorial)" fillOpacity={0.2} stroke="var(--color-memorial)" stackId="a" />
            <Area
              dataKey="columbarium"
              type="natural"
              fill="var(--color-columbarium)"
              fillOpacity={0.3}
              stroke="var(--color-columbarium)"
              stackId="a"
            />
            <Area dataKey="serenity" type="natural" fill="var(--color-serenity)" fillOpacity={0.35} stroke="var(--color-serenity)" stackId="a" />
          </AreaChart>
        </ChartContainer>
        {isPending && <div className="text-muted-foreground mt-4 text-xs">Loading…</div>}
        {isError && !isPending && <div className="text-destructive mt-4 text-xs">{(error as Error).message}</div>}
      </CardContent>
    </Card>
  )
}
