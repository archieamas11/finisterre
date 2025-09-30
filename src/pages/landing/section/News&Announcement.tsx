import { ArrowUpRight, CalendarDays, Clock, MapPin, Megaphone, Newspaper } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface UpdateItem {
  id: string
  title: string
  summary: string
  date: string
  dateTime: string
  tag: keyof typeof tagStyles
  link: string
  readingTime?: string
  location?: string
  time?: string
}

export default function PublicNewsAnnouncement() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      {/* <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-100 via-white to-slate-200" aria-hidden />
      <div
        className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),transparent_60%)] sm:block"
        aria-hidden
      /> */}

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
              variant="outline"
              className="border-slate-300 text-slate-700 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
            >
              <Link to="/updates" aria-label="View all updates">
                View all updates
              </Link>
            </Button>
          </div>
        </header>

        <Tabs defaultValue="news" className="grid gap-10">
          <TabsList>
            {Object.entries(updateCategories).map(([key, config]) => {
              const Icon = config.icon

              return (
                <TabsTrigger key={key} value={key} className="px-4">
                  <Icon className="h-4 w-4 text-[var(--brand-secondary)]" aria-hidden />
                  {config.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.entries(updateCategories).map(([key, config]) => {
            const [highlight, ...rest] = config.items

            if (!highlight) {
              return null
            }

            return (
              <TabsContent key={key} value={key} className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
                <HighlightCard item={highlight} category={config.label} Icon={config.icon} />

                <div className="grid gap-6">
                  {rest.map((item) => (
                    <UpdateCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}

interface HighlightCardProps {
  item: UpdateItem
  category: string
  Icon: React.ElementType
}

const HighlightCard = ({ item, category, Icon }: HighlightCardProps) => {
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
          <span>{category}</span>
        </div>
        <Badge className={cn('bg-white/15 text-white backdrop-blur-sm', tagStyles[item.tag])}>{item.tag}</Badge>
        <CardTitle className="text-3xl leading-tight font-semibold md:text-4xl">{item.title}</CardTitle>
        <CardDescription className="text-base text-white/80">{item.summary}</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 mt-auto flex flex-col gap-6 pb-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
          <time dateTime={item.dateTime} className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" aria-hidden />
            {item.date}
          </time>
          {item.time ? (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              {item.time}
            </span>
          ) : null}
          {item.location ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden />
              {item.location}
            </span>
          ) : null}
          {item.readingTime ? (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              {item.readingTime}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-white/80">
            Discover how this update enhances the experience for families and guests across the memorial park.
          </p>
          <Button variant="secondary" asChild className="w-full bg-white/10 text-white hover:bg-white/20 sm:w-auto">
            <Link to={item.link} aria-label={`Read more about ${item.title}`} className="flex items-center gap-2">
              Read full story
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const UpdateCard = ({ item }: { item: UpdateItem }) => {
  return (
    <Card className="group flex h-full flex-col border border-slate-200/70 bg-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)]/40 hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <Badge className={cn('bg-slate-100 text-slate-700', tagStyles[item.tag])}>{item.tag}</Badge>
          <time dateTime={item.dateTime} className="text-xs tracking-wide text-slate-500 uppercase">
            {item.date}
          </time>
        </div>
        <CardTitle className="text-xl font-semibold text-slate-900">
          <Link to={item.link} className="transition-colors hover:text-[var(--brand-primary)]">
            {item.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">{item.summary}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between pt-0 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {item.time ? (
            <span className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {item.time}
            </span>
          ) : null}
          {item.location ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {item.location}
            </span>
          ) : null}
          {item.readingTime ? (
            <span className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {item.readingTime}
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

const tagStyles = {
  'Park Update': 'bg-emerald-500/15 text-emerald-700 backdrop-blur',
  'Community Story': 'bg-blue-500/15 text-blue-700 backdrop-blur',
  'Service Advisory': 'bg-amber-500/15 text-amber-700 backdrop-blur',
  Event: 'bg-rose-500/15 text-rose-700 backdrop-blur',
  Maintenance: 'bg-slate-500/15 text-slate-700 backdrop-blur',
} as const

const updateCategories = {
  news: {
    label: 'News',
    icon: Newspaper,
    items: [
      {
        id: 'serenity-garden-wing',
        title: 'Serenity Garden Wing Nears Completion',
        summary: 'Our new garden wing is almost ready, featuring shaded walkways, contemplative seating, and native blooms.',
        date: 'September 22, 2025',
        dateTime: '2025-09-22',
        tag: 'Park Update',
        link: '/news/serenity-garden-wing',
        readingTime: '4 min read',
        location: 'Serenity Garden',
      },
      {
        id: 'legacy-park-feature',
        title: 'Families Share Stories of Legacy and Hope',
        summary: 'Hear from families who have found moments of comfort through Finisterre’s memorial traditions.',
        date: 'September 12, 2025',
        dateTime: '2025-09-12',
        tag: 'Community Story',
        link: '/news/families-share-stories',
        readingTime: '6 min read',
      },
      {
        id: 'digital-mapping-update',
        title: 'Digital Map Enhancements Roll Out to All Visitors',
        summary: 'Wayfinding just got smarter with guided routes, plot bookmarking, and real-time assistance.',
        date: 'August 30, 2025',
        dateTime: '2025-08-30',
        tag: 'Park Update',
        link: '/news/digital-map-enhancements',
        readingTime: '3 min read',
      },
    ],
  },
  announcements: {
    label: 'Announcements',
    icon: Megaphone,
    items: [
      {
        id: 'all-souls-prep',
        title: 'All Souls’ Day Preparation Schedule',
        summary: 'Extended visiting hours begin October 28 with dedicated assistance booths across the park.',
        date: 'September 25, 2025',
        dateTime: '2025-09-25',
        tag: 'Service Advisory',
        link: '/announcements/all-souls-preparation',
        time: '6:00 AM – 9:00 PM',
        location: 'Entire Park Grounds',
      },
      {
        id: 'sunrise-ritual',
        title: 'Sunrise Remembrance Ritual and Blessing',
        summary: 'Join us for a guided ritual led by the Finisterre pastoral team to honor loved ones.',
        date: 'October 2, 2025',
        dateTime: '2025-10-02',
        tag: 'Event',
        link: '/announcements/sunrise-remembrance',
        time: '6:30 AM',
        location: 'Pilgrim’s Plaza',
      },
      {
        id: 'grounds-maintenance',
        title: 'Grounds Maintenance Advisory',
        summary: 'Sections B3 and C1 will undergo light landscaping on September 29. Access will remain guided by our staff.',
        date: 'September 18, 2025',
        dateTime: '2025-09-18',
        tag: 'Maintenance',
        link: '/announcements/grounds-maintenance',
        time: '8:00 AM – 4:00 PM',
        location: 'Sections B3 & C1',
      },
    ],
  },
} satisfies Record<string, { label: string; icon: React.ElementType; items: UpdateItem[] }>
