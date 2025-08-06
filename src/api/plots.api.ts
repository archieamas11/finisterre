import { toast } from "sonner";

import type { plots } from "@/types/map.types";

import { api } from "./axiosInstance";

// // Chambers api
// 🏛️ Get niches for specific plot/columbarium
export async function getNichesByPlot(plot_id: string) {
  const res = await api.post("plots/get_niche_data.php", { plot_id });
  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to fetch niche data");
  }
  if (!Array.isArray(res.data.nicheData)) {
    throw new Error("Invalid response format - nicheData should be an array");
  } else {
    console.log("🚀 Fetched niches for plot:", plot_id, res.data.nicheData);
  }
  return res.data;
}

// 🏗️ Get all plots with valid rows and columns for grid generation
export async function getPlotsWithGrids() {
  const res = await api.post("plots/get_plots_with_grids.php");
  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to fetch plots with grids");
  } else {
    console.log("🏗️ Fetched plots with grids:", res.data.plots);
  }
  return res.data;
}

export async function editPlots(data: plots) {
  // 🛠️ Accepts plot data to update plot details
  const res = await api.post("plots/update_plot.php", data);
  if (!res.data?.success) {
    toast.error("Failed to update plot details");
    throw new Error("Failed to update plot details");
  }
  return res.data;
}

export async function getPlots() {
  const res = await api.post("plots/get_plots.php");
  if (!res.data || !Array.isArray(res.data.plots)) {
    throw new Error("Invalid response format");
  } else {
    console.log("Fetched plots:", res.data.plots);
  }
  return res.data;
}

// 🏛️ Get detailed niches with owner and deceased info for specific plot
export async function generateNicheGrid() {
  const res = await api.post("plots/make_niche_grids.php");
  if (!res.data) {
    throw new Error("Invalid response format");
  } else {
    console.log("🔍 Fetched detailed niches for plot:", res.data);
  }
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

export async function createPlots(data: plots) {
  const res = await api.post("plots/create_plot.php", data);
  return res.data;
}

export async function getPlotsCategory() {
  const res = await api.post("plots/get_plot_category.php");
  return res.data;
}
