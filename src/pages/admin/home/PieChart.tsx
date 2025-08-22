import { PrinterIcon } from 'lucide-react'
import React from 'react'
import { Pie, PieChart, Cell } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const description = 'Plot status distribution per category'

// Mock data - keep for now. Replace with API integration when available.
const plotData = {
  serenity: {
    all: { Available: 420, Occupied: 320, Reserved: 60 },
    A: { Available: 110, Occupied: 70, Reserved: 10 },
    B: { Available: 90, Occupied: 80, Reserved: 15 },
    C: { Available: 100, Occupied: 90, Reserved: 20 },
    D: { Available: 120, Occupied: 80, Reserved: 15 }
  },
  columbarium: { Available: 180, Occupied: 260, Reserved: 40 },
  memorial: { Available: 60, Occupied: 200, Reserved: 20 }
}

// Softer, modern semantic palette (accessible contrast)
const COLORS: Record<string, string> = {
  Available: '#047857',
  Occupied: '#b91c1c',
  Reserved: '#fbbf24'
}

const chartConfig = {
  Available: { label: 'Available' },
  Occupied: { label: 'Occupied' },
  Reserved: { label: 'Reserved' }
} satisfies ChartConfig

function toPieArray(obj: Record<string, number>) {
  return Object.entries(obj).map(([name, value]) => ({ name, value }))
}

function PrintButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type='button'
      variant='secondary'
      onClick={onClick}
      aria-label='Print chart'
      size='icon'
      className='text-muted-foreground hover:text-foreground ml-2'
    >
      <PrinterIcon />
    </Button>
  )
}

export function ChartPieInteractive() {
  const id = 'plots-pie-grid'
  const [serenityBlock, setSerenityBlock] = React.useState<string>('all')

  const serenityData = React.useMemo(
    () =>
      toPieArray(
        plotData.serenity[serenityBlock as keyof typeof plotData.serenity]
      ),
    [serenityBlock]
  )
  const columbariumData = React.useMemo(
    () => toPieArray(plotData.columbarium),
    []
  )
  const memorialData = React.useMemo(() => toPieArray(plotData.memorial), [])

  const serenityTotal = serenityData.reduce((s, d) => s + d.value, 0)
  const columbariumTotal = columbariumData.reduce((s, d) => s + d.value, 0)
  const memorialTotal = memorialData.reduce((s, d) => s + d.value, 0)

  // Reusable legend component for each card
  const Legend = ({ data }: { data: { name: string; value: number }[] }) => (
    <div className='mt-3 flex flex-wrap items-center gap-3' aria-hidden>
      {data.map((d) => (
        <div key={d.name} className='flex items-center gap-2'>
          <span
            className='inline-block h-3 w-3 rounded'
            style={{ backgroundColor: COLORS[d.name] ?? 'var(--color-2)' }}
          />
          <span className='text-muted-foreground text-sm'>{d.name}</span>
        </div>
      ))}
    </div>
  )

  const renderPieCard = (
    title: string,
    desc: string,
    data: { name: string; value: number }[],
    total: number,
    extra?: React.ReactNode
  ) => {
    const chartId = `${id}-${title.replace(/\s+/g, '-').toLowerCase()}`

    const handlePrint = () => {
      try {
        const selector = `[data-chart="${chartId}"]`
        const card = document.querySelector(selector) as HTMLElement | null
        if (!card) return

        const chartContainer = card.querySelector(
          '.chart-container, svg, .recharts-surface'
        ) as HTMLElement | null
        const contentToPrint = chartContainer
          ? chartContainer.outerHTML
          : card.innerHTML

        const newWindow = window.open(
          '',
          '_blank',
          'noopener,noreferrer,width=900,height=700'
        )
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
      <Card
        key={chartId}
        data-chart={chartId}
        className='flex flex-col shadow-sm'
      >
        <ChartStyle id={chartId} config={chartConfig} />
        <CardHeader className='flex-row items-start space-y-0 pb-0'>
          <div className='flex justify-between gap-1'>
            <div>
              <CardTitle className='text-sm font-medium'>{title}</CardTitle>
              <CardDescription className='text-xs'>{desc}</CardDescription>
            </div>
            <div
              className='ml-auto flex items-center'
              role='toolbar'
              aria-label={`${title} actions`}
            >
              {extra}
              <PrintButton onClick={handlePrint} />
            </div>
          </div>
        </CardHeader>

        <CardContent className='flex flex-1 flex-col items-center justify-center pb-3'>
          <div className='relative mx-auto w-full max-w-[320px]'>
            <ChartContainer
              id={chartId}
              config={chartConfig}
              className='aspect-square w-full'
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={56}
                  outerRadius={86}
                  strokeWidth={2}
                  paddingAngle={4}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[entry.name] ?? 'var(--color-2)'}
                      stroke='#fff'
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
              <div className='text-center'>
                <div className='text-foreground text-xl font-semibold'>
                  {total.toLocaleString()}
                </div>
                <div className='text-muted-foreground text-xs'>Total</div>
              </div>
            </div>
          </div>

          <Legend data={data} />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {renderPieCard(
        'Serenity Lawn',
        `Block: ${serenityBlock.toUpperCase()}`,
        serenityData,
        serenityTotal,
        <Select value={serenityBlock} onValueChange={setSerenityBlock}>
          <SelectTrigger
            className='ml-auto h-8 w-[150px] rounded-lg pl-2.5'
            aria-label='Select block'
          >
            <SelectValue placeholder='Select block' />
          </SelectTrigger>
          <SelectContent align='end' className='rounded-xl'>
            <SelectItem value='all'>All Blocks</SelectItem>
            <SelectItem value='A'>Block A</SelectItem>
            <SelectItem value='B'>Block B</SelectItem>
            <SelectItem value='C'>Block C</SelectItem>
            <SelectItem value='D'>Block D</SelectItem>
          </SelectContent>
        </Select>
      )}

      {renderPieCard(
        'Columbarium',
        'Niches distribution',
        columbariumData,
        columbariumTotal
      )}

      {renderPieCard(
        'Memorial Chambers',
        'Chambers distribution',
        memorialData,
        memorialTotal
      )}
    </div>
  )
}
