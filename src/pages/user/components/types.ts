export type Coordinates = [number, number]

export interface Lot {
  lot_id: number | string
  block?: string | null
  category?: string | null
  niche_number?: string | number | null
  lot_status?: string | null
  coordinates?: Coordinates | null
}

export interface Deceased {
  deceased_id?: number | string
  dead_fullname?: string
  dead_date_death?: string | null
  dead_interment?: string | null
  lot_id?: number | string
}
