import type { plots, CreatePlotRequest, CreateSerenityLawnRequest, CreateMemorialChambersRequest, CreateColumbariumRequest } from '@/types/map.types'

import { api } from './axiosInstance'

// // Chambers api
// 🏛️ Get niches for specific plot/columbarium
export async function getNichesByPlot(plot_id: string) {
  const res = await api.post('plots/get_niche_data.php', { plot_id })
  return res.data
}

// 🏗️ Get all plots with valid rows and columns for grid generation
export async function getPlotsWithGrids() {
  const res = await api.post('plots/get_plots_with_grids.php')
  return res.data
}

export async function editPlots(data: plots) {
  // 🛠️ Accepts plot data to update plot details
  const res = await api.post('plots/update_plot.php', data)
  return res.data
}

export async function updatePlotCoordinates(plot_id: string, coordinates: string) {
  // 📍 Update only the coordinates of a specific plot
  const res = await api.post('plots/update_plot_coordinates.php', {
    plot_id,
    coordinates,
  })
  return res.data
}

export async function getPlots() {
  const res = await api.post('plots/get_plots.php')
  return res.data
}

// 🏛️ Get detailed niches with owner and deceased info for specific plot
export async function generateNicheGrid() {
  const res = await api.post('plots/make_niche_grids.php')
  return res.data
}

export async function editLotOwner(data: plots) {
  // Validate data before sending in actual usage
  const res = await api.post('plots/edit_lot_owner.php', data)
  return res.data
}

export async function getPlotMedia(data: plots) {
  const res = await api.post('plots/get_plot_media.php', data)
  return res.data
}

export async function createPlots(data: CreatePlotRequest | CreateSerenityLawnRequest | CreateMemorialChambersRequest | CreateColumbariumRequest) {
  const res = await api.post('plots/create_plot.php', data)
  return res.data
}

// 🌿 Create Serenity Lawn plot
export async function createSerenityLawnPlot(data: CreateSerenityLawnRequest) {
  const res = await api.post('plots/create_plot.php', data)
  return res.data
}

// 🏛️ Create Memorial Chambers plot
export async function createMemorialChambersPlot(data: CreateMemorialChambersRequest) {
  const res = await api.post('plots/create_chambers_plot.php', data)
  return res.data
}

// 🏺 Create Columbarium plot
export async function createColumbariumPlot(data: CreateColumbariumRequest) {
  const res = await api.post('plots/create_columbarium_plot.php', data)
  return res.data
}

export async function getPlotsCategory() {
  const res = await api.post('plots/get_plot_category.php')
  return res.data
}

// Serenity Lawn
export async function getSerenityByPlot(plot_id: string) {
  const res = await api.post('plots/get_plots_media.php', { plot_id })
  return res.data
}

// 🏠 Get plot owner and deceased details
export async function getPlotDetails(plot_id: string) {
  const res = await api.post('plots/get_plot_details.php', { plot_id })
  return res.data
}

// 🔍 Search for lot by lot_id
export async function searchLotById(lot_id: string) {
  const res = await api.post('plots/search_lot.php', { lot_id })
  return res.data
}

// 🏠 User-owned plots interface
export interface UserOwnedPlot {
  plot_id: number
  lot_id: number
  block?: string
  category: string
  coordinates: [number, number] | null // [lat, lng] format
  plot_status?: string
  plot_label?: string
  length?: number
  width?: number
  area?: number
  rows?: number
  columns?: number
  niche_number?: string
  niche_status?: string
  lot_status: string
  lot_created_at: string
  lot_updated_at: string
  owner_name: string
  customer_id: number
}

export interface UserPlotsResponse {
  success: boolean
  message: string
  plots: UserOwnedPlot[]
  total: number
}

// 👤 Get plots owned by the authenticated user
export async function getUserOwnedPlots(): Promise<UserPlotsResponse> {
  const res = await api.post<UserPlotsResponse>('plots/get_user_plots.php')
  return res.data
}
