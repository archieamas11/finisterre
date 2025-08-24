import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import { CardDescription, CardAction, CardFooter, CardHeader, CardTitle, Card } from '@/components/ui/card'

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Plots</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">2,500</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              ₱5,000,000
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All plots in cemetery <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Total number of plots available for allocation</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Occupied Plots</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">1,800</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              72%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Plots currently occupied <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Indicates total plots with burials</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Available Plots</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">500</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Plots open for reservation <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Ready for new reservations</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Reserved Plots</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">200</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Plots reserved but not yet occupied <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Pending future use</div>
        </CardFooter>
      </Card>
    </div>
  )
}
