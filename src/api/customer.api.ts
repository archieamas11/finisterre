import { api } from "./axiosInstance";

export async function getCustomers() {
  // Use shared axios instance and base URL for consistency
  const res = await api.post("customers/get_customer.php");
  return res.data;
}

export async function createCustomer(data: unknown) {
  // Validate data before sending in actual usage
  const res = await api.post("customers/create_customer.php", data);
  return res.data;
}

export async function editCustomer(data: unknown) {
  // Validate data before sending in actual usage
  const res = await api.post("customers/edit_customer.php", data);
  return res.data;
}

export async function deleteCustomer(id: string) {
  // API expects an object with id property
  const res = await api.post("customers/delete_customer.php", {
    id,
  });
  return res.data;
}
