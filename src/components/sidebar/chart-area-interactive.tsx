"use client";

import * as React from "react";
import { CartesianGrid, AreaChart, XAxis, Area } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { ToggleGroupItem, ToggleGroup } from "@/components/ui/toggle-group";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";
import {
  ChartTooltipContent,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  CardDescription,
  CardContent,
  CardAction,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui/card";

export const description = "An interactive area chart";

const chartData = [
  { mobile: 150, desktop: 222, date: "2024-04-01" },
  { desktop: 97, mobile: 180, date: "2024-04-02" },
  { mobile: 120, desktop: 167, date: "2024-04-03" },
  { mobile: 260, desktop: 242, date: "2024-04-04" },
  { mobile: 290, desktop: 373, date: "2024-04-05" },
  { mobile: 340, desktop: 301, date: "2024-04-06" },
  { mobile: 180, desktop: 245, date: "2024-04-07" },
  { mobile: 320, desktop: 409, date: "2024-04-08" },
  { desktop: 59, mobile: 110, date: "2024-04-09" },
  { mobile: 190, desktop: 261, date: "2024-04-10" },
  { mobile: 350, desktop: 327, date: "2024-04-11" },
  { mobile: 210, desktop: 292, date: "2024-04-12" },
  { mobile: 380, desktop: 342, date: "2024-04-13" },
  { mobile: 220, desktop: 137, date: "2024-04-14" },
  { mobile: 170, desktop: 120, date: "2024-04-15" },
  { mobile: 190, desktop: 138, date: "2024-04-16" },
  { mobile: 360, desktop: 446, date: "2024-04-17" },
  { mobile: 410, desktop: 364, date: "2024-04-18" },
  { mobile: 180, desktop: 243, date: "2024-04-19" },
  { desktop: 89, mobile: 150, date: "2024-04-20" },
  { mobile: 200, desktop: 137, date: "2024-04-21" },
  { mobile: 170, desktop: 224, date: "2024-04-22" },
  { mobile: 230, desktop: 138, date: "2024-04-23" },
  { mobile: 290, desktop: 387, date: "2024-04-24" },
  { mobile: 250, desktop: 215, date: "2024-04-25" },
  { desktop: 75, mobile: 130, date: "2024-04-26" },
  { mobile: 420, desktop: 383, date: "2024-04-27" },
  { mobile: 180, desktop: 122, date: "2024-04-28" },
  { mobile: 240, desktop: 315, date: "2024-04-29" },
  { mobile: 380, desktop: 454, date: "2024-04-30" },
  { mobile: 220, desktop: 165, date: "2024-05-01" },
  { mobile: 310, desktop: 293, date: "2024-05-02" },
  { mobile: 190, desktop: 247, date: "2024-05-03" },
  { mobile: 420, desktop: 385, date: "2024-05-04" },
  { mobile: 390, desktop: 481, date: "2024-05-05" },
  { mobile: 520, desktop: 498, date: "2024-05-06" },
  { mobile: 300, desktop: 388, date: "2024-05-07" },
  { mobile: 210, desktop: 149, date: "2024-05-08" },
  { mobile: 180, desktop: 227, date: "2024-05-09" },
  { mobile: 330, desktop: 293, date: "2024-05-10" },
  { mobile: 270, desktop: 335, date: "2024-05-11" },
  { mobile: 240, desktop: 197, date: "2024-05-12" },
  { mobile: 160, desktop: 197, date: "2024-05-13" },
  { mobile: 490, desktop: 448, date: "2024-05-14" },
  { mobile: 380, desktop: 473, date: "2024-05-15" },
  { mobile: 400, desktop: 338, date: "2024-05-16" },
  { mobile: 420, desktop: 499, date: "2024-05-17" },
  { mobile: 350, desktop: 315, date: "2024-05-18" },
  { mobile: 180, desktop: 235, date: "2024-05-19" },
  { mobile: 230, desktop: 177, date: "2024-05-20" },
  { desktop: 82, mobile: 140, date: "2024-05-21" },
  { desktop: 81, mobile: 120, date: "2024-05-22" },
  { mobile: 290, desktop: 252, date: "2024-05-23" },
  { mobile: 220, desktop: 294, date: "2024-05-24" },
  { mobile: 250, desktop: 201, date: "2024-05-25" },
  { mobile: 170, desktop: 213, date: "2024-05-26" },
  { mobile: 460, desktop: 420, date: "2024-05-27" },
  { mobile: 190, desktop: 233, date: "2024-05-28" },
  { desktop: 78, mobile: 130, date: "2024-05-29" },
  { mobile: 280, desktop: 340, date: "2024-05-30" },
  { mobile: 230, desktop: 178, date: "2024-05-31" },
  { mobile: 200, desktop: 178, date: "2024-06-01" },
  { mobile: 410, desktop: 470, date: "2024-06-02" },
  { mobile: 160, desktop: 103, date: "2024-06-03" },
  { mobile: 380, desktop: 439, date: "2024-06-04" },
  { desktop: 88, mobile: 140, date: "2024-06-05" },
  { mobile: 250, desktop: 294, date: "2024-06-06" },
  { mobile: 370, desktop: 323, date: "2024-06-07" },
  { mobile: 320, desktop: 385, date: "2024-06-08" },
  { mobile: 480, desktop: 438, date: "2024-06-09" },
  { mobile: 200, desktop: 155, date: "2024-06-10" },
  { desktop: 92, mobile: 150, date: "2024-06-11" },
  { mobile: 420, desktop: 492, date: "2024-06-12" },
  { desktop: 81, mobile: 130, date: "2024-06-13" },
  { mobile: 380, desktop: 426, date: "2024-06-14" },
  { mobile: 350, desktop: 307, date: "2024-06-15" },
  { mobile: 310, desktop: 371, date: "2024-06-16" },
  { mobile: 520, desktop: 475, date: "2024-06-17" },
  { mobile: 170, desktop: 107, date: "2024-06-18" },
  { mobile: 290, desktop: 341, date: "2024-06-19" },
  { mobile: 450, desktop: 408, date: "2024-06-20" },
  { mobile: 210, desktop: 169, date: "2024-06-21" },
  { mobile: 270, desktop: 317, date: "2024-06-22" },
  { mobile: 530, desktop: 480, date: "2024-06-23" },
  { mobile: 180, desktop: 132, date: "2024-06-24" },
  { mobile: 190, desktop: 141, date: "2024-06-25" },
  { mobile: 380, desktop: 434, date: "2024-06-26" },
  { mobile: 490, desktop: 448, date: "2024-06-27" },
  { mobile: 200, desktop: 149, date: "2024-06-28" },
  { mobile: 160, desktop: 103, date: "2024-06-29" },
  { mobile: 400, desktop: 446, date: "2024-06-30" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            onValueChange={setTimeRange}
            value={timeRange}
            variant="outline"
            type="single"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select onValueChange={setTimeRange} value={timeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select a value"
              size="sm"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                  offset="5%"
                />
                <stop
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                  offset="95%"
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                  offset="5%"
                />
                <stop
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                  offset="95%"
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
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
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
              defaultIndex={isMobile ? -1 : 10}
              cursor={false}
            />
            <Area
              stroke="var(--color-mobile)"
              fill="url(#fillMobile)"
              dataKey="mobile"
              type="natural"
              stackId="a"
            />
            <Area
              stroke="var(--color-desktop)"
              fill="url(#fillDesktop)"
              dataKey="desktop"
              type="natural"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
