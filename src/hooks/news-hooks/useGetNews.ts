import { useQuery } from '@tanstack/react-query'

import { getNewsList } from '@/api/news.api'
import type { NewsCategory, NewsStatus } from '@/types/news.types'

interface UseGetNewsOptions {
  search?: string
  status?: NewsStatus
  category?: NewsCategory
  isFeatured?: boolean
  publishedOnly?: boolean
  limit?: number
}

export function useGetNews(options: UseGetNewsOptions = {}) {
  return useQuery({
    queryKey: ['news', options],
    queryFn: async () => {
      const response = await getNewsList({
        search: options.search,
        status: options.status,
        category: options.category,
        is_featured: options.isFeatured,
        published_only: options.publishedOnly,
        limit: options.limit,
      })

      return response.news ?? []
    },
  })
}
