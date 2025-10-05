import { PrinterIcon } from 'lucide-react'
import React from 'react'
import { Pie, PieChart, Cell } from 'recharts'

import { getChambersStats, getSerenityStatsByBlock, type MapStatsResponse } from '@/api/map-stats.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const description = 'Plot status distribution per category'

// Mock data for columbarium only - will be replaced when data is available
const columbariumMockData = { Available: 180, Occupied: 260, Reserved: 40 }

const COLORS: Record<string, string> = {
  Available: '#047857',
  Occupied: '#b91c1c',
  Reserved: '#fbbf24',
}

const chartConfig = {
  Available: { label: 'Available' },
  Occupied: { label: 'Occupied' },
  Reserved: { label: 'Reserved' },
} satisfies ChartConfig

function toPieArray(obj: Record<string, number>) {
  return Object.entries(obj).map(([name, value]) => ({ name, value }))
}

function PrintButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      aria-label="Print chart"
      size="icon"
      className="text-muted-foreground hover:text-foreground ml-2"
    >
      <PrinterIcon />
    </Button>
  )
}

export function ChartPieInteractive() {
  const id = 'plots-pie-grid'
  const [serenityBlock, setSerenityBlock] = React.useState<string>('all')

  // State for real data from API
  const [serenityStats, setSerenityStats] = React.useState<MapStatsResponse | null>(null)
  const [memorialStats, setMemorialStats] = React.useState<MapStatsResponse | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Fetch data on mount and when serenityBlock changes
  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [serenityRes, memorialRes] = await Promise.all([getSerenityStatsByBlock(serenityBlock), getChambersStats()])
        setSerenityStats(serenityRes)
        setMemorialStats(memorialRes)
      } catch (error) {
        console.error('Failed to fetch plot stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [serenityBlock])

  // Convert API response to pie chart format
  const serenityData = React.useMemo(() => {
    if (!serenityStats) return []
    return toPieArray({
      Available: serenityStats.available,
      Occupied: serenityStats.occupied,
      Reserved: serenityStats.reserved,
    })
  }, [serenityStats])

  const columbariumData = React.useMemo(() => toPieArray(columbariumMockData), [])

  const memorialData = React.useMemo(() => {
    if (!memorialStats) return []
    return toPieArray({
      Available: memorialStats.available,
      Occupied: memorialStats.occupied,
      Reserved: memorialStats.reserved,
    })
  }, [memorialStats])

  const serenityTotal = serenityData.reduce((s, d) => s + d.value, 0)
  const columbariumTotal = columbariumData.reduce((s, d) => s + d.value, 0)
  const memorialTotal = memorialData.reduce((s, d) => s + d.value, 0)

  // Show loading state
  if (loading && !serenityStats && !memorialStats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex flex-col shadow-sm">
            <CardHeader>
              <div className="bg-muted h-4 w-32 animate-pulse rounded" />
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
              <div className="bg-muted h-64 w-64 animate-pulse rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Reusable legend component for each card
  const Legend = ({ data }: { data: { name: string; value: number }[] }) => (
    <div className="mt-3 flex flex-wrap items-center gap-3" aria-hidden>
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: COLORS[d.name] ?? 'var(--color-2)' }} />
          <span className="text-muted-foreground text-sm">{d.name}</span>
        </div>
      ))}
    </div>
  )

  const renderPieCard = (title: string, desc: string, data: { name: string; value: number }[], total: number, extra?: React.ReactNode) => {
    const chartId = `${id}-${title.replace(/\s+/g, '-').toLowerCase()}`

    const handlePrint = () => {
      try {
        const selector = `[data-chart="${chartId}"]`
        const card = document.querySelector(selector) as HTMLElement | null
        if (!card) return

        const chartContainer = card.querySelector('.chart-container, svg, .recharts-surface') as HTMLElement | null
        const contentToPrint = chartContainer ? chartContainer.outerHTML : card.innerHTML

        const newWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
        if (!newWindow) return

        const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${title} - Print</title><style>body{font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;margin:0;padding:20px;display:flex;align-items:center;justify-content:center}svg{max-width:95vw;max-height:90vh}</style></head><body><div>${contentToPrint}</div><script>window.onload=function(){setTimeout(()=>{window.print();window.close()},200)}</script></body></html>`
        newWindow.document.open()
        newWindow.document.write(html)
        newWindow.document.close()
      } catch (err) {
        console.error(err)
      }
    }

    return (
      <Card key={chartId} data-chart={chartId} className="flex flex-col shadow-sm">
        <ChartStyle id={chartId} config={chartConfig} />
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="flex justify-between gap-1">
            <div>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <CardDescription className="text-xs">{desc}</CardDescription>
            </div>
            <div className="ml-auto flex items-center" role="toolbar" aria-label={`${title} actions`}>
              {extra}
              <PrintButton onClick={handlePrint} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col items-center justify-center pb-3">
          <div className="relative mx-auto w-full max-w-[320px]">
            <ChartContainer id={chartId} config={chartConfig} className="aspect-square w-full">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={86} strokeWidth={2} paddingAngle={4}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name] ?? 'var(--color-2)'} stroke="#fff" strokeWidth={1.5} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-foreground text-xl font-semibold">{total.toLocaleString()}</div>
                <div className="text-muted-foreground text-xs">Total</div>
              </div>
            </div>
          </div>

          <Legend data={data} />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {renderPieCard(
        'Serenity Lawn',
        `Block: ${serenityBlock.toUpperCase()}`,
        serenityData,
        serenityTotal,
        <Select value={serenityBlock} onValueChange={setSerenityBlock}>
          <SelectTrigger className="ml-auto h-8 w-[150px] rounded-lg pl-2.5" aria-label="Select block">
            <SelectValue placeholder="Select block" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            <SelectItem value="all">All Blocks</SelectItem>
            <SelectItem value="A">Block A</SelectItem>
            <SelectItem value="B">Block B</SelectItem>
            <SelectItem value="C">Block C</SelectItem>
            <SelectItem value="D">Block D</SelectItem>
          </SelectContent>
        </Select>,
      )}

      {renderPieCard('Columbarium', 'Niches distribution', columbariumData, columbariumTotal)}

      {renderPieCard('Memorial Chambers', 'Chambers distribution', memorialData, memorialTotal)}
    </div>
  )
}
