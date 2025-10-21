import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createDeceasedRecord } from '@/api/deceased.api'
import { type DeceasedRecords } from '@/types/interment.types'

export function useCreateDeceasedRecord() {
  const qc = useQueryClient()
  return useMutation<DeceasedRecords, Error, Partial<DeceasedRecords>>({
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['deceased'] })
      qc.invalidateQueries({ queryKey: ['plots'], refetchType: 'active' })
      qc.invalidateQueries({ queryKey: ['niches'] })
      qc.invalidateQueries({ queryKey: ['map-stats'] })
      qc.invalidateQueries({ queryKey: ['map-stats', 'chambers'] })
      qc.invalidateQueries({ queryKey: ['map-stats', 'serenity'] })

      if (variables.plot_id) {
        qc.invalidateQueries({ queryKey: ['plotDetails', variables.plot_id] })
      }
    },
    onError: (error) => {
      console.error(' Mutation failed:', error)
    },
    mutationFn: async (data) => {
      console.log(' Executing mutation with data:', data)
      return await createDeceasedRecord(data as DeceasedRecords)
    },
  })
}
