import { useQuery } from '@tanstack/react-query'

import { getDeceasedRecords } from '@/api/deceased.api'

export function useGetDeceasedRecord() {
  return useQuery({
    queryKey: ['deceased'],
    queryFn: async () => {
      const r = await getDeceasedRecords()
      return r.deceased ?? []
    },
  })
}
