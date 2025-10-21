import type { NewsCategory, NewsItem, NewsListResponse, NewsMutationResponse, NewsStatus } from '@/types/news.types'

import { api } from './axiosInstance'

interface GetNewsParams {
  search?: string
  status?: NewsStatus
  category?: NewsCategory
  is_featured?: boolean
  published_only?: boolean
  limit?: number
}

export async function getNewsList(params: GetNewsParams = {}): Promise<NewsListResponse> {
  try {
    const res = await api.post<NewsListResponse>('news/get_news.php', params)
    return res.data
  } catch (error) {
    console.error('Failed to fetch news list:', error)
    throw error
  }
}

interface MutateNewsPayload {
  news_id?: string | number
  title: string
  slug?: string
  excerpt?: string | null
  content?: string | null
  category?: NewsCategory
  status?: NewsStatus
  is_featured?: boolean
  cover_image?: string | null
  author?: string | null
  published_at?: string | null
}

export async function createNews(payload: MutateNewsPayload): Promise<NewsMutationResponse> {
  try {
    const res = await api.post<NewsMutationResponse>('news/create_news.php', payload)
    return res.data
  } catch (error) {
    console.error('Failed to create news item:', error)
    throw error
  }
}

export async function updateNews(payload: MutateNewsPayload & { news_id: string | number }): Promise<NewsMutationResponse> {
  try {
    const res = await api.post<NewsMutationResponse>('news/update_news.php', payload)
    return res.data
  } catch (error) {
    console.error('Failed to update news item:', error)
    throw error
  }
}

export type { NewsItem }
