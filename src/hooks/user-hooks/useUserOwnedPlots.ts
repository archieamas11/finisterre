import type { UserOwnedPlot } from '@/api/plots.api'
import type { ConvertedMarker } from '@/types/map.types'
import { useQuery } from '@tanstack/react-query'

import { getUserOwnedPlots } from '@/api/plots.api'
import { isAuthenticated } from '@/utils/auth.utils'

export function useUserOwnedPlots() {
  const enabled = isAuthenticated()

  return useQuery({
    queryKey: ['user', 'plots'],
    queryFn: async () => {
      const response = await getUserOwnedPlots()
      if (!response.success) {
        throw new Error(response.message)
      }
      return response
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Convert user owned plots to markers format for map display
export function convertUserPlotToMarker(plot: UserOwnedPlot): ConvertedMarker | null {
  if (!plot.coordinates) return null

  return {
    deceased: {
      dead_fullname: undefined,
      dead_interment: undefined,
    },
    owner: {
      customer_id: String(plot.customer_id),
      fullname: plot.owner_name,
      email: undefined,
      contact: undefined,
    },
    rows: String(plot.rows || ''),
    block: plot.block || '',
    plot_id: String(plot.plot_id),
    columns: String(plot.columns || ''),
    location: plot.niche_number ? `${plot.category} • Niche ${plot.niche_number}` : `${plot.category}${plot.block ? ` • Block ${plot.block}` : ''}`,
    category: plot.category,
    plotStatus: plot.plot_status || 'available',
    label: plot.plot_label || null,
    position: plot.coordinates, // Already in [lat, lng] format
    dimensions: {
      length: plot.length || 0,
      width: plot.width || 0,
      area: plot.area || 0,
    },
    is_owned: true, // User-owned plots are always owned
  }
}
