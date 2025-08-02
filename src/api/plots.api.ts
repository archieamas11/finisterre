import { api } from "./axiosInstance";
import type { plots } from "@/types/interment.types";

export async function getPlots() {
  const res = await api.post("plots/get_plots.php");
  if (!res.data || !Array.isArray(res.data.plots)) {
    throw new Error("Invalid response format");
    console.error("Invalid response format:", res.data);
  } else {
    console.log("Fetched plots:", res.data.plots);
  }
  return res.data;
}

export async function editPlots(data: plots) {
  // 🛠️ Accepts plot data to update plot details
  const res = await api.post("plots/edit_plot.php", data);
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
