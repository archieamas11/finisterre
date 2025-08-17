import type { plots, CreatePlotRequest, CreateSerenityLawnRequest, CreateMemorialChambersRequest, CreateColumbariumRequest } from "@/types/map.types";
import { api } from "./axiosInstance";

// // Chambers api
// 🏛️ Get niches for specific plot/columbarium
export async function getNichesByPlot(plot_id: string) {
  const res = await api.post("plots/get_niche_data.php", { plot_id });
  return res.data;
}

// 🏗️ Get all plots with valid rows and columns for grid generation
export async function getPlotsWithGrids() {
  const res = await api.post("plots/get_plots_with_grids.php");
  return res.data;
}

export async function editPlots(data: plots) {
  // 🛠️ Accepts plot data to update plot details
  const res = await api.post("plots/update_plot.php", data);
  return res.data;
}

export async function getPlots() {
  const res = await api.post("plots/get_plots.php");
  return res.data;
}

// 🏛️ Get detailed niches with owner and deceased info for specific plot
export async function generateNicheGrid() {
  const res = await api.post("plots/make_niche_grids.php");
  return res.data;
}

export async function editLotOwner(data: plots) {
  // Validate data before sending in actual usage
  const res = await api.post("plots/edit_lot_owner.php", data);
  return res.data;
}

export async function getPlotMedia(data: plots) {
  const res = await api.post("plots/get_plot_media.php", data);
  return res.data;
}

export async function createPlots(data: CreatePlotRequest | CreateSerenityLawnRequest | CreateMemorialChambersRequest | CreateColumbariumRequest) {
  const res = await api.post("plots/create_plot.php", data);
  return res.data;
}

// 🌿 Create Serenity Lawn plot
export async function createSerenityLawnPlot(data: CreateSerenityLawnRequest) {
  const res = await api.post("plots/create_plot.php", data);
  return res.data;
}

// 🏛️ Create Memorial Chambers plot
export async function createMemorialChambersPlot(data: CreateMemorialChambersRequest) {
  const res = await api.post("plots/create_chambers_plot.php", data);
  return res.data;
}

// 🏺 Create Columbarium plot
export async function createColumbariumPlot(data: CreateColumbariumRequest) {
  const res = await api.post("plots/create_columbarium_plot.php", data);
  return res.data;
}

export async function getPlotsCategory() {
  const res = await api.post("plots/get_plot_category.php");
  return res.data;
}

// Serenity Lawn
export async function getSerenityByPlot(plot_id: string) {
  const res = await api.post("plots/get_plots_media.php", { plot_id });
  return res.data;
}

// 🏠 Get plot owner and deceased details
export async function getPlotDetails(plot_id: string) {
  const res = await api.post("plots/get_plot_details.php", { plot_id });
  return res.data;
}
