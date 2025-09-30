export type NewsCategory = 'Announcement' | 'Update' | 'Event' | 'Story'
export type NewsStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export interface NewsItem {
  news_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  category: NewsCategory
  status: NewsStatus
  is_featured: boolean
  cover_image: string | null
  author: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface NewsListResponse {
  success: boolean
  message: string
  news: NewsItem[]
}

export interface NewsMutationResponse {
  success: boolean
  message: string
  news_id: number
  news: NewsItem | null
}
