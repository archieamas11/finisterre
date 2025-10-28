import type { NewsCategory, NewsItem } from '@/types/news.types'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, CalendarDays, Clock, Megaphone, Newspaper } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getNewsList } from '@/api/news.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const categoryBadgeStyles: Record<NewsCategory, string> = {
  Announcement: 'bg-amber-500/15 text-amber-700 backdrop-blur',
  Update: 'bg-emerald-500/15 text-emerald-700 backdrop-blur',
  Event: 'bg-rose-500/15 text-rose-700 backdrop-blur',
  Story: 'bg-blue-500/15 text-blue-700 backdrop-blur',
}

const defaultBadgeStyle = 'bg-slate-500/15 text-slate-700 backdrop-blur'

interface TabConfig {
  key: string
  label: string
  icon: IconComponent
  highlight: NewsItem | null
  rest: NewsItem[]
  total: number
}

export default function PublicNewsAnnouncement() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-news', { limit: 9, published_only: true }],
    queryFn: () => getNewsList({ limit: 9, published_only: true }),
    staleTime: 1000 * 60 * 5,
  })

  const tabs = React.useMemo<TabConfig[]>(() => {
    const newsItems = data?.news ?? []
    const groups = [
      {
        key: 'news',
        label: 'News',
        icon: Newspaper,
        entries: newsItems.filter((item) => item.category !== 'Announcement'),
      },
      {
        key: 'announcements',
        label: 'Announcements',
        icon: Megaphone,
        entries: newsItems.filter((item) => item.category === 'Announcement'),
      },
    ]

    return groups.map((group) => {
      const highlight = group.entries.find((item) => item.is_featured) ?? group.entries[0] ?? null
      const restPool = highlight ? group.entries.filter((item) => item.news_id !== highlight.news_id) : group.entries

      return {
        key: group.key,
        label: group.label,
        icon: group.icon,
        highlight,
        rest: restPool.slice(0, 3),
        total: group.entries.length,
      }
    })
  }, [data?.news])

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">News & Announcements</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-[var(--brand-primary)] sm:text-5xl">Latest from Finisterre</h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Stay up to date with community milestones, service advisories, and thoughtful stories from our memorial park.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <span>Updated weekly</span>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
            >
              <Link to="/updates" aria-label="View all updates">
                View all updates
              </Link>
            </Button>
          </div>
        </header>

        {isError ? (
          <div className="rounded-lg border border-amber-300/60 bg-amber-50/70 p-4 text-sm text-amber-900">
            We couldn’t load the latest updates right now. Please try again in a moment.
          </div>
        ) : null}

        <Tabs defaultValue="news" className="grid gap-10">
          <TabsList className="overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const count = tab.total

              return (
                <TabsTrigger key={tab.key} value={tab.key} disabled={!count && !isLoading} className={cn('flex items-center gap-2 px-4')}>
                  <Icon className="h-4 w-4 text-[var(--brand-secondary)]" aria-hidden />
                  <span>{tab.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{count}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.key} value={tab.key} className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
              {isLoading ? (
                <LoadingGrid />
              ) : tab.highlight ? (
                <>
                  <HighlightCard item={tab.highlight} Icon={tab.icon} tabLabel={tab.label} />
                  <div className="grid gap-6">
                    {tab.rest.length ? (
                      tab.rest.map((item) => <UpdateCard key={item.news_id} item={item} />)
                    ) : (
                      <EmptyState icon={tab.icon} message={`No other ${tab.label.toLowerCase()} at the moment.`} />
                    )}
                  </div>
                </>
              ) : (
                <EmptyState icon={tab.icon} message={`No ${tab.label.toLowerCase()} available yet.`} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

interface HighlightCardProps {
  item: NewsItem
  Icon: IconComponent
  tabLabel: string
}

const HighlightCard = ({ item, Icon, tabLabel }: HighlightCardProps) => {
  const dateMeta = getDateMeta(item.published_at, item.created_at)
  const summary = getSummary(item)
  const link = getNewsLink(item)

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-none bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-secondary)] to-slate-900 text-white shadow-xl">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-light.png')" }}
        aria-hidden
      />

      <CardHeader className="relative z-10 space-y-4 pb-6">
        <div className="flex items-center gap-3 text-sm text-white/80">
          <Icon className="h-5 w-5" aria-hidden />
          <span>{tabLabel}</span>
        </div>
        <Badge className={cn('bg-white/15 text-white backdrop-blur-sm', getBadgeClass(item.category))}>{item.category}</Badge>
        <CardTitle className="text-3xl leading-tight font-semibold md:text-4xl">{item.title}</CardTitle>
        <CardDescription className="text-base text-white/80">{summary}</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 mt-auto flex flex-col gap-6 pb-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
          {dateMeta ? (
            <time dateTime={dateMeta.iso} className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden />
              {dateMeta.dateLabel}
            </time>
          ) : null}
          {dateMeta?.timeLabel ? (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              {dateMeta.timeLabel}
            </span>
          ) : null}
          {item.author ? (
            <span className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" aria-hidden />
              {item.author}
            </span>
          ) : null}
          {item.is_featured ? (
            <span className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" aria-hidden />
              Featured
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-white/80">
            {item.excerpt ? 'Continue reading the full story for more details.' : 'Explore the complete update to learn more about this story.'}
          </p>
          <Button variant="secondary" asChild className="w-full bg-white/10 text-white hover:bg-white/20 sm:w-auto">
            <Link to={link} aria-label={`Read more about ${item.title}`} className="flex items-center gap-2">
              Read full story
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const UpdateCard = ({ item }: { item: NewsItem }) => {
  const dateMeta = getDateMeta(item.published_at, item.created_at)
  const summary = getSummary(item)
  const link = getNewsLink(item)

  return (
    <Card className="group flex h-full flex-col border border-slate-200/70 bg-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)]/40 hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge className={cn('bg-slate-100 text-slate-700', getBadgeClass(item.category))}>{item.category}</Badge>
          {dateMeta ? (
            <time dateTime={dateMeta.iso} className="text-xs tracking-wide text-slate-500 uppercase">
              {dateMeta.dateLabel}
            </time>
          ) : null}
        </div>
        <CardTitle className="text-xl font-semibold text-slate-900">
          <Link to={link} className="transition-colors hover:text-[var(--brand-primary)]">
            {item.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">{summary}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between pt-0 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {item.author ? (
            <span className="flex items-center gap-2">
              <Newspaper className="h-3.5 w-3.5" aria-hidden />
              {item.author}
            </span>
          ) : null}
          {dateMeta?.timeLabel ? (
            <span className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {dateMeta.timeLabel}
            </span>
          ) : null}
        </div>

        <ArrowUpRight
          className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--brand-primary)]"
          aria-hidden
        />
      </CardContent>
    </Card>
  )
}

const LoadingGrid = () => (
  <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
    <Card className="flex h-full flex-col border-none bg-gradient-to-br from-slate-200 via-slate-100 to-white">
      <CardHeader className="space-y-4 pb-6">
        <Skeleton className="h-4 w-32 bg-white/50" />
        <Skeleton className="h-10 w-4/5 bg-white/60" />
        <Skeleton className="h-16 w-full bg-white/60" />
      </CardHeader>
      <CardContent className="mt-auto space-y-4 pb-6">
        <Skeleton className="h-4 w-32 bg-white/60" />
        <Skeleton className="h-10 w-40 bg-white/60" />
      </CardContent>
    </Card>
    <div className="grid gap-6">
      {[0, 1, 2].map((index) => (
        <Card key={index} className="border border-slate-200/70 bg-white/80">
          <CardHeader className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-14 w-full" />
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-0">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-8" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

const EmptyState = ({ icon: Icon, message }: { icon: IconComponent; message: string }) => (
  <Card className="flex h-full items-center justify-center border border-dashed border-slate-200 bg-white/80 py-16">
    <CardContent className="flex flex-col items-center gap-3 text-center">
      <Icon className="h-6 w-6 text-slate-400" aria-hidden />
      <p className="max-w-sm text-sm text-slate-600">{message}</p>
    </CardContent>
  </Card>
)

function getBadgeClass(category: NewsCategory) {
  return categoryBadgeStyles[category] ?? defaultBadgeStyle
}

function getNewsLink(item: NewsItem) {
  return `/news/${item.slug || item.news_id}`
}

function getSummary(item: NewsItem) {
  if (item.excerpt && item.excerpt.trim().length > 0) {
    return item.excerpt.trim()
  }

  if (item.content && item.content.trim().length > 0) {
    const cleaned = item.content.replace(/\s+/g, ' ').trim()
    return cleaned.length > 180 ? `${cleaned.slice(0, 177)}…` : cleaned
  }

  return 'Details coming soon.'
}

function getDateMeta(primary: string | null, fallback: string | null) {
  const raw = primary ?? fallback
  if (!raw) {
    return null
  }

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return {
    iso: date.toISOString(),
    dateLabel: new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date),
    timeLabel: new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(date),
  }
}
