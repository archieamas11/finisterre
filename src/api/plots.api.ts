import { toast } from "sonner";
import { api } from "./axiosInstance";
import type { plots } from "@/types/map.types";

export async function getPlots() {
  const res = await api.post("plots/get_plots.php");
  if (!res.data || !Array.isArray(res.data.plots)) {
    throw new Error("Invalid response format");
  } else {
    console.log("Fetched plots:", res.data.plots);
  }
  return res.data;
}

export async function getColPlots() {
  const res = await api.post("plots/get_col_plots.php");
  if (!res.data || !Array.isArray(res.data.plots)) {
    throw new Error("Invalid response format");
  } else {
    console.log("Fetched plots:", res.data.plots);
  }
  return res.data;
}

export async function editPlots(data: plots) {
  // 🛠️ Accepts plot data to update plot details
  const res = await api.post("plots/update_plot.php", data);
  if (!res.data || !res.data.success) {
    toast.error("Failed to update plot details");
    throw new Error("Failed to update plot details");
  }
  return res.data;
}

export async function createPlots(data: plots) {
  const res = await api.post("plots/create_plot.php", data);
  return res.data;
}

export async function getPlotMedia(data: plots) {
  const res = await api.post("plots/get_plot_media.php", data);
  return res.data;
}

export async function getPlotsCategory() {
  const res = await api.post("plots/get_plot_category.php");
  return res.data;
}

export async function editLotOwner(data: plots) {
  // Validate data before sending in actual usage
  const res = await api.post("plots/edit_lot_owner.php", data);
  return res.data;
}

// Chambers api
export async function getNiche() {
  const res = await api.post("plots/get_niche_data.php");
  if (!res.data || !Array.isArray(res.data.plots)) {
    throw new Error("Invalid response format");
  } else {
    console.log("Fetched niche:", res.data.plots);
  }
  return res.data;
}
