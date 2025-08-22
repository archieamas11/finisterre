import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type {
  CreateSerenityLawnRequest,
  CreateMemorialChambersRequest,
  CreateColumbariumRequest
} from '@/types/map.types'

import {
  createSerenityLawnPlot,
  createMemorialChambersPlot,
  createColumbariumPlot
} from '@/api/plots.api'

interface UseCreatePlotMutationsArgs {
  onDone: () => void
}

export function useCreatePlotMutations({ onDone }: UseCreatePlotMutationsArgs) {
  const queryClient = useQueryClient()

  function onSuccessCommon() {
    queryClient.invalidateQueries({ queryKey: ['plots'] })
    queryClient.invalidateQueries({ queryKey: ['map-stats'] })
    queryClient.invalidateQueries({ queryKey: ['map-stats', 'chambers'] })
    queryClient.invalidateQueries({ queryKey: ['map-stats', 'serenity'] })
    onDone()
  }

  const serenity = useMutation({
    mutationFn: (data: CreateSerenityLawnRequest) =>
      createSerenityLawnPlot(data),
    onSuccess: onSuccessCommon
  })

  const chambers = useMutation({
    mutationFn: (data: CreateMemorialChambersRequest) =>
      createMemorialChambersPlot(data),
    onSuccess: onSuccessCommon
  })

  const columbarium = useMutation({
    mutationFn: (data: CreateColumbariumRequest) => createColumbariumPlot(data),
    onSuccess: onSuccessCommon
  })

  function submitSerenity(data: CreateSerenityLawnRequest) {
    return toast.promise(serenity.mutateAsync(data), {
      loading: 'Creating Serenity Lawn plot...',
      success: 'Serenity Lawn plot created successfully!',
      error: 'Failed to create plot. Please try again.'
    })
  }

  function submitChambers(data: CreateMemorialChambersRequest) {
    return toast.promise(chambers.mutateAsync(data), {
      loading: 'Creating Memorial Chambers plot...',
      success: 'Memorial Chambers plot created successfully!',
      error: 'Failed to create plot. Please try again.'
    })
  }

  function submitColumbarium(data: CreateColumbariumRequest) {
    return toast.promise(columbarium.mutateAsync(data), {
      loading: 'Creating Columbarium plot...',
      success: 'Columbarium plot created successfully!',
      error: 'Failed to create plot. Please try again.'
    })
  }

  return {
    serenity,
    chambers,
    columbarium,
    submitSerenity,
    submitChambers,
    submitColumbarium
  } as const
}
