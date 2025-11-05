import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

async function shortenUrl(url: string): Promise<string> {
  const apiKey = import.meta.env.VITE_TINYURL_API_URL as string | undefined

  if (!apiKey) return url // Fallback: just return original link if no key configured

  try {
    const response = await axios.post(
      'https://api.tinyurl.com/create',
      { url, domain: 'tinyurl.com' },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )
    const tiny = response.data?.data?.tiny_url
    return typeof tiny === 'string' ? tiny : url
  } catch (err) {
    console.warn('TinyURL shorten failed, using original URL', err)
    return url
  }
}

export function useShortenUrl(url: string, enabled = true) {
  return useQuery({
    queryKey: ['shorten-url', url],
    queryFn: () => shortenUrl(url),
    enabled: enabled && !!url,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  })
}
