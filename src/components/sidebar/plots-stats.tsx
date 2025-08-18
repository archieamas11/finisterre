"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "A stacked area chart with expand stacking";

// Updated chartData
const chartData = [
  { month: "January", serenity: 120, columbarium: 90, memorial: 60 },
  { month: "February", serenity: 150, columbarium: 110, memorial: 80 },
  { month: "March", serenity: 100, columbarium: 95, memorial: 70 },
  { month: "April", serenity: 170, columbarium: 130, memorial: 100 },
  { month: "May", serenity: 200, columbarium: 140, memorial: 120 },
  { month: "June", serenity: 180, columbarium: 150, memorial: 110 },
];

// Updated chartConfig
const chartConfig = {
  serenity: {
    label: "Serenity Lawn",
    color: "var(--chart-1)",
  },
  columbarium: {
    label: "Columbarium",
    color: "var(--chart-2)",
  },
  memorial: {
    label: "Memorial Chambers",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartAreaStackedExpand() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Comparison - Cemetery Lots</CardTitle>
        <CardDescription>Serenity Lawn, Columbarium, and Memorial Chambers (Jan - Jun 2025)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
            stackOffset="expand"
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="memorial" type="natural" fill="var(--color-memorial)" fillOpacity={0.1} stroke="var(--color-memorial)" stackId="a" />{" "}
            <Area dataKey="columbarium" type="natural" fill="var(--color-columbarium)" fillOpacity={0.4} stroke="var(--color-columbarium)" stackId="a" />
            <Area dataKey="serenity" type="natural" fill="var(--color-serenity)" fillOpacity={0.4} stroke="var(--color-serenity)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">January - June 2025</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
