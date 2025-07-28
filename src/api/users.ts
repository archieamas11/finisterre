import axios from "axios";

import { getApiUrl } from "./getApiUrl";
export async function getCustomers() {
  const url = await getApiUrl();
  const res = await axios.post(url + "customers/get_customers.php");
  return res.data;
}
