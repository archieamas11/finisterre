import axios from "axios";
import { APP_URL } from "./axiosInstance";

export async function getCustomers() {
  // Use shared axios instance and base URL for consistency
  const res = await axios.post(APP_URL + "customers/get_customer.php");
  return res.data;
}

export async function createCustomer(data: unknown) {
  // Validate data before sending in actual usage
  const res = await axios.post(APP_URL + "customers/create_customer.php", data);
  return res.data;
}

export async function editCustomer(data: unknown) {
  // Validate data before sending in actual usage
  const res = await axios.post(APP_URL + "customers/edit_customer.php", data);
  return res.data;
}

export async function deleteCustomer(id: string) {
  // API expects an object with id property
  const res = await axios.post(APP_URL + "customers/delete_customer.php", {
    id,
  });
  return res.data;
}
