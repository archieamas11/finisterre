import axios from "axios";

// import { APP_URL } from "./getApiUrl";
const APP_URL = "http://localhost/finisterre_backend/";

export async function getCustomers() {
  const res = await axios.post(APP_URL + "customers/get_customers.php");
  return res.data;
}

export async function getLotOwners() {
  const res = await axios.post(APP_URL + "customers/get_lot_owners.php");
  return res.data;
}

export async function getDeceasedRecords() {
  const res = await axios.post(APP_URL + "customers/get_deceased.php");
  return res.data;
}

export async function createCustomer(data: any) {
  const res = await axios.post(APP_URL + "customers/create_customer.php", data);
  return res.data;
}

export async function deleteCustomer(id: string) {
  const res = await axios.post(APP_URL + "customers/delete_customer.php", { id });
  return res.data;
}
