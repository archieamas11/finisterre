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
  file_name?: string[]
  position: [number, number]
  file_names_array?: string[]
  dimensions: {
    length: number
    width: number
    area: number
  }
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
  file_names: string[]
  file_names_array?: string[]
  coordinates: [number, number]
}

// 🆕 Interface for creating new plots
export interface CreatePlotRequest {
  block: string
  category: string
  coordinates: string // String format for API: "lng, lat"
  status?: string
}

// 🏛️ Marker types for different plot categories
export type MarkerType = 'Serenity Lawn' | 'Columbarium' | 'Memorial Chambers'

// 🌿 Serenity Lawn plot request
export interface CreateSerenityLawnRequest {
  block: string
  category: string
  coordinates: string
  status?: string
}

// 🏛️ Memorial Chambers plot request
export interface CreateMemorialChambersRequest {
  rows: string
  columns: string
  coordinates: string
  status?: string
}

// 🏺 Columbarium plot request
export interface CreateColumbariumRequest {
  rows: string
  columns: string
  coordinates: string
  status?: string
}

// 🔧 Map utility functions
export const convertPlotToMarker = (plot: {
  file_names_array?: string[]
  dead_fullname?: string
  dead_interment?: string
  customer_id?: string
  fullname?: string
  email?: string
  contact?: string
  label: string | null
  file_name?: string[]
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
}): ConvertedMarker => {
  // 📍 Parse coordinates from database format "lng, lat" to [lat, lng]
  const [lng, lat] = plot.coordinates.split(', ').map(Number)

  // 🖼️ Handle file_name conversion - ensure it's always an array
  let fileNames: string[] = []

  // 🔍 Check multiple sources for image files
  if (plot.file_names_array && Array.isArray(plot.file_names_array)) {
    fileNames = plot.file_names_array.filter(Boolean) // Remove empty strings
  } else if (plot.file_name) {
    if (Array.isArray(plot.file_name)) {
      fileNames = plot.file_name.filter(Boolean)
    } else if (typeof plot.file_name === 'string') {
      // 🔧 Handle case where backend sends JSON string or comma-separated
      try {
        const parsed = JSON.parse(plot.file_name)
        fileNames = Array.isArray(parsed) ? parsed.filter(Boolean) : [plot.file_name]
      } catch {
        // 📝 Might be comma-separated string
        fileNames = (plot.file_name as string)
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean)
      }
    }
  }

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
    file_name: fileNames.length > 0 ? fileNames : undefined,
    file_names_array: fileNames.length > 0 ? fileNames : undefined,
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
  }
}

// 🎨 Get background color based on plot category
export const getCategoryBackgroundColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'columbarium':
      return '#a3a3'
    case 'platinum':
      return '#d4af37'
    case 'chambers':
      return '#a3a3'
    case 'diamond':
      return '#cc6688'
    case 'bronze':
      return '#7d7d7d'
    case 'silver':
      return '#b00020'
    default:
      return '#6b7280'
  }
}

// 🟢 Get status color for map markers
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
