export interface Product {
  id: number
  title: string
  description: string
  image: string
}

export interface DesktopProductListProps {
  products: Product[]
  hoveredId: number | null
  setHoveredId: (id: number | null) => void
}
