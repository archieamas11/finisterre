import axios from "axios";
import { APP_URL } from "./axiosInstance";

export async function getPlots() {
  const res = await axios.post(APP_URL + "plots/get_plots.php");
  return res.data;
}

export async function getPlotsCategory(data: unknown) {
  // Validate data before sending in actual usage
  const res = await axios.post(APP_URL + "plots/get_plot_category.php", data);
  return res.data;
}

export async function editLotOwner(data: unknown) {
  // Validate data before sending in actual usage
  const res = await axios.post(APP_URL + "plots/edit_lot_owner.php", data);
  return res.data;
}
