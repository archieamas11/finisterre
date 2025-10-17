import { useQuery } from '@tanstack/react-query'

import { getNichesByPlot } from '@/api/plots.api'

interface NicheData {
  row: number
  col: number
  lot_id: string
  niche_number: number
  customer_id?: string
  niche_status: 'available' | 'occupied' | 'reserved'
  owner?: {
    customer_id: string
    phone: string
    email: string
    name: string
  }
  deceased?: {
    dateOfInterment: string
    deceased_id: string
    dateOfBirth: string
    dateOfDeath: string
    name: string
  }
}

const generateGridPositions = (fetchedNiches: NicheData[], totalRows: number, totalCols: number, plotId: string): NicheData[] => {
  const result: NicheData[] = []

  const nicheMap = new Map<number, NicheData>()
  fetchedNiches.forEach((niche) => {
    if (niche.niche_number) {
      nicheMap.set(niche.niche_number, niche)
    }
  })

  let nicheCounter = 1
  for (let row = 1; row <= totalRows; row++) {
    for (let col = 1; col <= totalCols; col++) {
      const existingNiche = nicheMap.get(nicheCounter)

      if (existingNiche) {
        result.push({
          ...existingNiche,
          row,
          col,
          niche_number: nicheCounter,
        })
      } else {
        result.push({
          row,
          col,
          niche_status: 'available',
          niche_number: nicheCounter,
          lot_id: `${plotId}-N-${nicheCounter}-R${row}C${col}`,
        })
      }
      nicheCounter++
    }
  }
  return result
}

export function useNichesByPlot(plotId: string, rows: number, cols: number) {
  return useQuery({
    queryKey: ['niches', plotId, rows, cols],
    enabled: !!plotId && rows > 0 && cols > 0,
    queryFn: async () => {
      let existingNiches: unknown[] = []
      try {
        const response = await getNichesByPlot(plotId)
        existingNiches = response.nicheData || []
      } catch {
        existingNiches = []
      }

      const plotNiches: NicheData[] = existingNiches.map((n) => {
        const niche = (n || {}) as Record<string, unknown>
        const row = Number(niche.row as string) || 0
        const col = Number(niche.col as string) || 0
        const nicheNumber = Number(niche.niche_number as string) || 0
        const lotId = (niche.lot_id as string) || `${plotId}-N-${nicheNumber}`

        return {
          row,
          col,
          lot_id: lotId,
          niche_number: nicheNumber,
          niche_status: ((niche.niche_status as string) || 'available') as NicheData['niche_status'],
          owner: niche.customer_id
            ? {
                email: (niche.email as string) || '',
                customer_id: String(niche.customer_id),
                name: (niche.customer_name as string) || '',
                phone: (niche.contact_number as string) || '',
              }
            : undefined,
          deceased: niche.deceased_id
            ? {
                deceased_id: String(niche.deceased_id),
                name: (niche.dead_fullname as string) || '',
                dateOfBirth: (niche.dead_birth_date as string) || '',
                dateOfDeath: (niche.dead_date_death as string) || '',
                dateOfInterment: (niche.dead_interment as string) || '',
              }
            : undefined,
        }
      })

      const completeNiches = generateGridPositions(plotNiches, rows, cols, plotId)
      return completeNiches
    },
  })
}
