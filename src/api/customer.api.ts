import { toast } from "sonner";
import { api } from "./axiosInstance";
import type { CustomerFormData } from "@/pages/admin/interment/customer/customer.validation";

export async function getCustomers() {
  try {
    const res = await api.post("customers/get_customer.php");
    if (res.data.success) {
      console.log("😊 Customers fetched successfully");
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    toast.error("Failed to fetch customers");
    throw error;
  }
}

export async function getCustomerById(id: string) {
  const res = await api.post("customers/get_customer.php", { id });
  console.log("getCustomerById called with response:", res.data);
  return res.data;
}

export async function createCustomer(data: CustomerFormData) {
  try {
    const res = await api.post("customers/create_customer.php", data);
    if (res.data.success) {
      toast.success("Customer created successfully");
    } else {
      toast.error(res.data.message);
    }
    return res.data;
  } catch (error) {
    toast.error("Failed to create customer");
    throw error;
  }
}

export async function editCustomer(data: CustomerFormData) {
  try {
    const res = await api.post("customers/edit_customer.php", data);
    if (res.data.success) {
      toast.success("Customer edited successfully");
    } else {
      toast.error(res.data.message);
    }
    return res.data;
  } catch {
    toast.error("Failed to edit customer");
    throw new Error("Failed to edit customer");
  }
}

export async function deleteCustomer(id: string) {
  const res = await api.post("customers/delete_customer.php", {
    id,
  });
  console.log("deleteCustomer called with response:", res.data);
  return res.data;
}
