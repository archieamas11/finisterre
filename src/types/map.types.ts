export interface ConvertedMarker {
  deceased: {
    dead_fullname?: string
    dead_interment?: string
  }
  owner: {
    customer_id?: string
    fullname?: string
    email?: string
    contact?: string
  }
  rows: string
  block: string
  plot_id: string
  columns: string
  location: string
  category: string
  plotStatus: string
  label: string | null
  position: [number, number]
  dimensions: {
    length: number
    width: number
    area: number
  }
  is_owned?: boolean
}

export interface plots {
  area: string
  rows: string
  block: string
  width: string
  label: string
  length: string
  status: string
  plot_id: string
  columns: string
  category: string
  coordinates: [number, number]
}

// Interface for creating new plots
export interface CreatePlotRequest {
  block: string
  category: string
  coordinates: string
  status?: string
}

// Marker types for different plot categories
export type MarkerType = 'Serenity Lawn' | 'Columbarium' | 'Memorial Chambers'

// Serenity Lawn plot request
export interface CreateSerenityLawnRequest {
  block: string
  category: string
  coordinates: string
  status?: string
}

// Memorial Chambers plot request
export interface CreateMemorialChambersRequest {
  rows: string
  columns: string
  block: string
  coordinates: string
  status?: string
}

// Columbarium plot request
export interface CreateColumbariumRequest {
  rows: string
  columns: string
  coordinates: string
  status?: string
}

// Map utility functions
export const convertPlotToMarker = (plot: {
  dead_fullname?: string
  dead_interment?: string
  customer_id?: string
  fullname?: string
  email?: string
  contact?: string
  label: string | null
  coordinates: string
  category: string
  plot_id: string
  columns: string
  length: string
  status: string
  block: string
  width: string
  area: string
  rows: string
  is_owned?: boolean
}): ConvertedMarker => {
  // Parse coordinates from database format "lng, lat" to [lat, lng]
  const [lng, lat] = plot.coordinates.split(', ').map(Number)

  return {
    rows: plot.rows,
    block: plot.block,
    label: plot.label,
    plot_id: plot.plot_id,
    columns: plot.columns,
    plotStatus: plot.status,
    category: plot.category,
    position: [lat, lng] as [number, number],
    location: `Block ${plot.block} • Plot ${plot.plot_id}`,
    dimensions: {
      area: parseFloat(plot.area),
      width: parseFloat(plot.width),
      length: parseFloat(plot.length),
    },
    deceased: {
      dead_fullname: plot.dead_fullname,
      dead_interment: plot.dead_interment,
    },
    owner: {
      customer_id: plot.customer_id,
      fullname: plot.fullname,
      email: plot.email,
      contact: plot.contact,
    },
    is_owned: plot.is_owned || false,
  }
}

// Get background and text colors based on plot category
export const getCategoryColors = (category: string): { background: string; text: string } => {
  switch (category.toLowerCase()) {
    case 'platinum':
      return { background: '#d4af37', text: '#303030' } // Gold background, black text
    case 'diamond':
      return { background: '#cc6688', text: '#ffffff' } // Pink background, white text
    case 'bronze':
      return { background: '#7d7d7d', text: '#ffffff' } // Gray background, white text
    case 'silver':
      return { background: '#b00020', text: '#ffffff' } // Red background, white text
    default:
      return { background: '#6b7280', text: '#ffffff' } // Gray background, white text
  }
}

// Get status color for map markers
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return '#22c55e'
    case 'occupied':
      return '#ef4444'
    case 'reserved':
      return '#facc15'
    default:
      return '#a3a3a3'
  }
}

// Search result interface for lot search
export interface LotSearchResult {
  success: boolean
  message: string
  data?: {
    lot_id: string
    plot_id: string
    niche_number: string | null
    niche_status: string | null
    lot_status: string
    customer_id: string
    block: string
    category: string
    coordinates: string
    label: string | null
    rows: string | null
    columns: string | null
    length: string | null
    width: string | null
    area: string | null
    plot_status: string
  }
}
