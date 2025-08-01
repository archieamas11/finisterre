import axios from "axios";

// import { APP_URL } from "./getApiUrl";
const APP_URL = "http://localhost/finisterre_backend/";
// const APP_URL = "https://finisterre.ct.ws/";

export async function getPlots() {
  const res = await axios.post(APP_URL + "plots/get_plots.php");
  return res.data;
}

export async function getPlotsCategory(data: any) {
  const res = await axios.post(APP_URL + "plots/get_plot_category.php", data);
  return res.data;
}

export async function editLotOwner(data: any) {
  const res = await axios.post(APP_URL + "plots/edit_lot_owner.php", data);
  return res.data;
}
