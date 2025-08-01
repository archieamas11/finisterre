import { api } from "./axiosInstance";

export async function getPlots() {
  const res = await api.post("plots/get_plots.php");
  return res.data;
}

export async function getPlotsCategory(data: unknown) {
  // Validate data before sending in actual usage
  const res = await api.post("plots/get_plot_category.php", data);
  return res.data;
}

export async function editLotOwner(data: unknown) {
  // Validate data before sending in actual usage
  const res = await api.post("plots/edit_lot_owner.php", data);
  return res.data;
}
