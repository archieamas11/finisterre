'use client'
import * as React from 'react'
import { CartesianGrid, AreaChart, XAxis, Area, ResponsiveContainer } from 'recharts'

import { CardDescription, CardContent, CardAction, CardHeader, CardTitle, Card } from '@/components/ui/card'
import { ChartTooltipContent, type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { SelectContent, SelectTrigger, SelectValue, SelectItem, Select } from '@/components/ui/select'
import { ToggleGroupItem, ToggleGroup } from '@/components/ui/toggle-group'
import { useIsMobile } from '@/hooks/use-mobile'

export const description = 'An interactive area chart showing customer data for lots'

const chartData = [
  {
    serenityLawn: 45,
    columbarium: 32,
    memorialChambers: 28,
    date: '2023-07-01',
  },
  {
    serenityLawn: 52,
    columbarium: 41,
    memorialChambers: 35,
    date: '2023-08-01',
  },
  {
    serenityLawn: 48,
    columbarium: 38,
    memorialChambers: 30,
    date: '2023-09-01',
  },
  {
    serenityLawn: 55,
    columbarium: 45,
    memorialChambers: 42,
    date: '2023-10-01',
  },
  {
    serenityLawn: 60,
    columbarium: 48,
    memorialChambers: 45,
    date: '2023-11-01',
  },
  {
    serenityLawn: 65,
    columbarium: 52,
    memorialChambers: 48,
    date: '2023-12-01',
  },
  {
    serenityLawn: 58,
    columbarium: 46,
    memorialChambers: 40,
    date: '2024-01-01',
  },
  {
    serenityLawn: 62,
    columbarium: 50,
    memorialChambers: 43,
    date: '2024-02-01',
  },
  {
    serenityLawn: 70,
    columbarium: 55,
    memorialChambers: 48,
    date: '2024-03-01',
  },
  {
    serenityLawn: 75,
    columbarium: 60,
    memorialChambers: 52,
    date: '2024-04-01',
  },
  {
    serenityLawn: 80,
    columbarium: 65,
    memorialChambers: 55,
    date: '2024-05-01',
  },
  {
    serenityLawn: 85,
    columbarium: 70,
    memorialChambers: 60,
    date: '2024-06-01',
  },
  // Daily data for more granular view
  { serenityLawn: 12, columbarium: 8, memorialChambers: 7, date: '2024-06-01' },
  {
    serenityLawn: 15,
    columbarium: 10,
    memorialChambers: 8,
    date: '2024-06-02',
  },
  { serenityLawn: 10, columbarium: 7, memorialChambers: 6, date: '2024-06-03' },
  {
    serenityLawn: 18,
    columbarium: 12,
    memorialChambers: 10,
    date: '2024-06-04',
  },
  { serenityLawn: 14, columbarium: 9, memorialChambers: 8, date: '2024-06-05' },
  {
    serenityLawn: 16,
    columbarium: 11,
    memorialChambers: 9,
    date: '2024-06-06',
  },
  {
    serenityLawn: 20,
    columbarium: 14,
    memorialChambers: 12,
    date: '2024-06-07',
  },
  {
    serenityLawn: 22,
    columbarium: 15,
    memorialChambers: 13,
    date: '2024-06-08',
  },
  {
    serenityLawn: 18,
    columbarium: 12,
    memorialChambers: 10,
    date: '2024-06-09',
  },
  {
    serenityLawn: 25,
    columbarium: 18,
    memorialChambers: 15,
    date: '2024-06-10',
  },
  {
    serenityLawn: 23,
    columbarium: 16,
    memorialChambers: 14,
    date: '2024-06-11',
  },
  {
    serenityLawn: 20,
    columbarium: 14,
    memorialChambers: 12,
    date: '2024-06-12',
  },
  {
    serenityLawn: 17,
    columbarium: 12,
    memorialChambers: 10,
    date: '2024-06-13',
  },
  {
    serenityLawn: 19,
    columbarium: 13,
    memorialChambers: 11,
    date: '2024-06-14',
  },
  {
    serenityLawn: 24,
    columbarium: 17,
    memorialChambers: 15,
    date: '2024-06-15',
  },
  {
    serenityLawn: 21,
    columbarium: 15,
    memorialChambers: 13,
    date: '2024-06-16',
  },
  {
    serenityLawn: 26,
    columbarium: 19,
    memorialChambers: 16,
    date: '2024-06-17',
  },
  {
    serenityLawn: 14,
    columbarium: 10,
    memorialChambers: 8,
    date: '2024-06-18',
  },
  {
    serenityLawn: 16,
    columbarium: 11,
    memorialChambers: 9,
    date: '2024-06-19',
  },
  {
    serenityLawn: 22,
    columbarium: 16,
    memorialChambers: 14,
    date: '2024-06-20',
  },
  {
    serenityLawn: 18,
    columbarium: 13,
    memorialChambers: 11,
    date: '2024-06-21',
  },
  {
    serenityLawn: 20,
    columbarium: 14,
    memorialChambers: 12,
    date: '2024-06-22',
  },
  {
    serenityLawn: 28,
    columbarium: 20,
    memorialChambers: 18,
    date: '2024-06-23',
  },
  {
    serenityLawn: 15,
    columbarium: 11,
    memorialChambers: 9,
    date: '2024-06-24',
  },
  {
    serenityLawn: 17,
    columbarium: 12,
    memorialChambers: 10,
    date: '2024-06-25',
  },
  {
    serenityLawn: 23,
    columbarium: 17,
    memorialChambers: 15,
    date: '2024-06-26',
  },
  {
    serenityLawn: 27,
    columbarium: 20,
    memorialChambers: 17,
    date: '2024-06-27',
  },
  {
    serenityLawn: 19,
    columbarium: 14,
    memorialChambers: 12,
    date: '2024-06-28',
  },
  {
    serenityLawn: 16,
    columbarium: 11,
    memorialChambers: 9,
    date: '2024-06-29',
  },
  {
    serenityLawn: 25,
    columbarium: 18,
    memorialChambers: 16,
    date: '2024-06-30',
  },
]

const chartConfig = {
  customers: {
    label: 'Customers',
  },
  serenityLawn: {
    label: 'Serenity Lawn',
    color: 'var(--primary)',
  },
  columbarium: {
    label: 'Columbarium',
    color: 'var(--primary)',
  },
  memorialChambers: {
    label: 'Memorial Chambers',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState('90d')

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d')
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90

    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    } else if (timeRange === '1y') {
      daysToSubtract = 365
    }

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return date >= startDate
  })

  return (
    <Card className="@container/card flex h-full flex-col">
      <CardHeader>
        <CardTitle>Total Customers</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {timeRange === '1y'
              ? 'Total for the last year'
              : timeRange === '90d'
                ? 'Total for the last 3 months'
                : timeRange === '30d'
                  ? 'Total for the last 30 days'
                  : 'Total for the last 7 days'}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === '1y' ? 'Last year' : timeRange === '90d' ? 'Last 3 months' : timeRange === '30d' ? 'Last 30 days' : 'Last 7 days'}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex" onValueChange={setTimeRange} value={timeRange} variant="outline" type="single">
            <ToggleGroupItem value="1y">Last year</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select onValueChange={setTimeRange} value={timeRange}>
            <SelectTrigger className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden" aria-label="Select a value" size="sm">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem className="rounded-lg" value="1y">
                Last year
              </SelectItem>
              <SelectItem className="rounded-lg" value="90d">
                Last 3 months
              </SelectItem>
              <SelectItem className="rounded-lg" value="30d">
                Last 30 days
              </SelectItem>
              <SelectItem className="rounded-lg" value="7d">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer className="h-full min-h-0 w-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillSerenityLawn" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="var(--color-serenityLawn)" stopOpacity={1.0} offset="5%" />
                  <stop stopColor="var(--color-serenityLawn)" stopOpacity={0.1} offset="95%" />
                </linearGradient>
                <linearGradient id="fillColumbarium" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="var(--color-columbarium)" stopOpacity={0.8} offset="5%" />
                  <stop stopColor="var(--color-columbarium)" stopOpacity={0.1} offset="95%" />
                </linearGradient>
                <linearGradient id="fillMemorialChambers" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="var(--color-memorialChambers)" stopOpacity={0.8} offset="5%" />
                  <stop stopColor="var(--color-memorialChambers)" stopOpacity={0.1} offset="95%" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
                tickLine={false}
                axisLine={false}
                minTickGap={32}
                dataKey="date"
                tickMargin={8}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    }}
                    indicator="dot"
                  />
                }
                defaultIndex={isMobile ? -1 : 10}
                cursor={false}
              />
              <Area stroke="var(--color-serenityLawn)" fill="url(#fillSerenityLawn)" dataKey="serenityLawn" type="natural" stackId="a" />
              <Area stroke="var(--color-columbarium)" fill="url(#fillColumbarium)" dataKey="columbarium" type="natural" stackId="a" />
              <Area stroke="var(--color-memorialChambers)" fill="url(#fillMemorialChambers)" dataKey="memorialChambers" type="natural" stackId="a" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
