import axios from "axios";

import { getApiUrl } from "./getApiUrl";

export async function getCustomers() {
  const url = await getApiUrl();
  const res = await axios.post(url + "customers/get_customers.php");
  return res.data;
}

export async function getLotOwners() {
  const url = await getApiUrl();
  const res = await axios.post(url + "customers/get_lot_owners.php");
  return res.data;
}

export async function getDeceasedRecords() {
  const url = await getApiUrl();
  const res = await axios.post(url + "customers/get_deceased.php");
  return res.data;
}
