import { useMemo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import type { NewsItem } from '@/types/news.types'

function PostAvatar({ label }: { label: string }) {
  const initial = useMemo(() => label?.trim()?.[0]?.toUpperCase() ?? 'F', [label])
  return (
    <div
      aria-hidden
      className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-semibold text-slate-700 dark:from-slate-700 dark:to-slate-600 dark:text-slate-100"
    >
      {initial}
    </div>
  )
}

function AnnouncementPost({ item, isHighlighted }: { item: NewsItem; isHighlighted: boolean }) {
  const publishedDate = item.published_at || item.created_at

  const displayContent = item.content

  return (
    <Card
      id={`news-${item.news_id}`}
      className={cn('border-slate-200 dark:border-slate-800', isHighlighted && 'ring-2 ring-blue-500/30')}
      aria-label={`Announcement: ${item.title}`}
    >
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <PostAvatar label={item.author || item.title} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              {item.category}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">{new Date(publishedDate).toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <img
          src={item.cover_image || `https://picsum.photos/seed/${item.news_id}/400/300`}
          alt={item.title}
          loading="lazy"
          className="h-auto w-full rounded-lg object-cover"
        />
        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">{displayContent}</p>
      </CardContent>
    </Card>
  )
}

export default function AnnouncementsPage() {
  const mockNews: NewsItem[] = [
    {
      news_id: '1',
      title: 'Welcome to Our Community!',
      slug: 'welcome-to-our-community',
      author: 'Community Team',
      category: 'Announcement',
      excerpt: 'Welcome to our amazing community!',
      content:
        "🎉 Welcome to our amazing community! 🎉\n\nWe're so excited to have you here. This is a place where we share updates, news, and connect with fellow members.\n\nFeel free to explore, ask questions, and join the conversation. Together, we're building something special!\n\n#Welcome #Community #NewBeginnings",
      status: 'published',
      is_featured: false,
      cover_image: null,
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      news_id: '2',
      title: 'New Features Coming Soon!',
      slug: 'new-features-coming-soon',
      author: 'Product Team',
      category: 'Update',
      excerpt: 'Big things are coming!',
      content:
        "🚀 Big things are coming! 🚀\n\nOur development team has been working tirelessly on some exciting new features that will revolutionize how you interact with our platform.\n\nFrom improved user interfaces to enhanced functionality, we're making everything better for you. Stay tuned for the official launch!\n\n#NewFeatures #Innovation #ComingSoon",
      status: 'published',
      is_featured: true,
      cover_image: null,
      published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      news_id: '3',
      title: 'Community Guidelines Update',
      slug: 'community-guidelines-update',
      author: 'Moderation Team',
      category: 'Announcement',
      excerpt: 'Important update to our community guidelines',
      content:
        "📋 Important Update 📋\n\nWe've updated our community guidelines to ensure everyone has a positive experience. Here are the key changes:\n\n• Be respectful and kind to all members\n• No spam or promotional content\n• Report any inappropriate behavior\n• Help keep our community safe and welcoming\n\nLet's continue building a great community together!\n\n#CommunityGuidelines #Respect #Safety",
      status: 'published',
      is_featured: false,
      cover_image: null,
      published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      news_id: '4',
      title: 'Monthly Community Meetup',
      slug: 'monthly-community-meetup',
      author: 'Events Team',
      category: 'Event',
      excerpt: 'Join us for our monthly virtual meetup',
      content:
        "📅 Join us for our monthly meetup! 📅\n\nThis month, we're hosting a virtual meetup where we'll discuss the latest trends, share experiences, and connect with community members from around the world.\n\nDate: Next Saturday, 2 PM EST\nLocation: Virtual (link will be shared)\n\nDon't miss out on this opportunity to network and learn!\n\n#CommunityMeetup #Networking #VirtualEvent",
      status: 'published',
      is_featured: false,
      cover_image: null,
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      news_id: '5',
      title: 'Thank You to Our Contributors',
      slug: 'thank-you-to-our-contributors',
      author: 'Admin Team',
      category: 'Announcement',
      excerpt: 'A huge thank you to all our contributors',
      content:
        "🙏 A huge thank you! 🙏\n\nWe want to take a moment to recognize and thank all our amazing contributors who have been helping make our community better every day.\n\nYour dedication, creativity, and passion inspire us all. Whether it's sharing knowledge, helping others, or contributing code, every contribution matters.\n\nThank you for being awesome!\n\n#ThankYou #Contributors #CommunityHeroes",
      status: 'published',
      is_featured: false,
      cover_image: null,
      published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="px-4 py-6 md:py-8 lg:container lg:mx-auto lg:max-w-3xl lg:px-4">
      {mockNews.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/30">
          <p className="text-sm text-slate-600 dark:text-slate-400">No announcements yet. Please check back later.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {mockNews.map((item) => (
            <AnnouncementPost key={item.news_id} item={item} isHighlighted={false} />
          ))}
        </div>
      )}
    </div>
  )
}
