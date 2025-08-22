import { useQuery } from '@tanstack/react-query'

import { getDeceasedRecords } from '@/api/deceased.api'

// 1) Query for list
export function useGetDeceasedRecord() {
  return useQuery({
    queryKey: ['deceased'],
    queryFn: async () => {
      const r = await getDeceasedRecords()
      return r.deceased ?? []
    }
  })
}
