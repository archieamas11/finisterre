import { useQueryClient } from '@tanstack/react-query'

export const usePlotCacheManager = () => {
  const queryClient = useQueryClient()

  const invalidatePlotDetails = (plot_id?: string) => {
    if (plot_id) {
      queryClient.invalidateQueries({
        queryKey: ['plotDetails', plot_id],
      })
    } else {
      queryClient.invalidateQueries({
        queryKey: ['plotDetails'],
      })
    }
  }

  const invalidatePlots = () => {
    queryClient.invalidateQueries({
      queryKey: ['plots'],
    })
  }

  const invalidateAllPlotData = () => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey[0]
        return key === 'plots' || key === 'plotDetails'
      },
    })
  }

  const refreshPlotDetails = async (plot_id: string) => {
    return await queryClient.refetchQueries({
      queryKey: ['plotDetails', plot_id],
    })
  }

  const refreshPlots = async () => {
    // Force refetch main plots data
    return await queryClient.refetchQueries({
      queryKey: ['plots'],
    })
  }

  return {
    invalidatePlotDetails,
    invalidatePlots,
    invalidateAllPlotData,
    refreshPlotDetails,
    refreshPlots,
  }
}
