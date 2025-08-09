import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to provide cache management utilities for plot-related data
 */
export const usePlotCacheManager = () => {
  const queryClient = useQueryClient();

  const invalidatePlotDetails = (plot_id?: string) => {
    if (plot_id) {
      // Invalidate specific plot details
      queryClient.invalidateQueries({
        queryKey: ["plotDetails", plot_id],
      });
    } else {
      // Invalidate all plot details
      queryClient.invalidateQueries({
        queryKey: ["plotDetails"],
      });
    }
  };

  const invalidatePlots = () => {
    // Invalidate main plots data
    queryClient.invalidateQueries({
      queryKey: ["plots"],
    });
  };

  const invalidateAllPlotData = () => {
    // Invalidate everything plot-related
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey[0];
        return key === "plots" || key === "plotDetails";
      },
    });
  };

  const refreshPlotDetails = async (plot_id: string) => {
    // Force refetch specific plot details
    return await queryClient.refetchQueries({
      queryKey: ["plotDetails", plot_id],
    });
  };

  const refreshPlots = async () => {
    // Force refetch main plots data
    return await queryClient.refetchQueries({
      queryKey: ["plots"],
    });
  };

  return {
    invalidatePlotDetails,
    invalidatePlots,
    invalidateAllPlotData,
    refreshPlotDetails,
    refreshPlots,
  };
};
