import { api } from "./axiosInstance";

export interface LotInfo {
  niche_number: string | number | null;
  plot_id: number | null;
  block: string | null;
  lot_plot_id: number | null;
  category: string | null;
}

export type Customer = {
  customer_id: string | number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  nickname: string | null;
  address: string;
  contact_number: string;
  birth_date: string | null;
  gender: "Male" | "Female" | string;
  religion: string | null;
  citizenship: string | null;
  status: "Single" | "Married" | "Divorced" | "Widowed" | string;
  occupation: string | null;
  created_at: string | null;
  updated_at: string | null;
  lot_info?: LotInfo[];
};

export async function getCustomers() {
  try {
    const res = await api.post("customers/get_customer.php");
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function editCustomer(data: Customer) {
  try {
    const res = await api.post("customers/edit_customer.php", data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

// API function (createCustomer)
export async function createCustomer(data: Customer) {
  try {
    const res = await api.post("customers/create_customer.php", data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCustomer(id: string | number) {
  try {
    const res = await api.post("customers/delete_customer.php", { id });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getCustomerById(id: string | number) {
  try {
    const res = await api.post("customers/get_customer.php", { id });
    return res.data;
  } catch (error) {
    throw error;
  }
}
