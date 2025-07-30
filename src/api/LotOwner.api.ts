import axios from "axios";

// import { APP_URL } from "./getApiUrl";
const APP_URL = "http://localhost/finisterre_backend/";
// const APP_URL = "https://finisterre.ct.ws/";

export async function getLotOwner() {
  const res = await axios.post(APP_URL + "customers/get_lot_owner.php");
  return res.data;
}

export async function createLotOwner(data: any) {
  const res = await axios.post(APP_URL + "customers/create_lot_owner.php", data);
  return res.data;
}

export async function editLotOwner(data: any) {
  const res = await axios.post(APP_URL + "customers/edit_lot_owner.php", data);
  return res.data;
}