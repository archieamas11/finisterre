import type { CustomerFormData } from "@/pages/admin/interment/customer/customer.validation";

import { api } from "./axiosInstance";
import { toast } from "sonner";

export async function editCustomer(data: CustomerFormData) {
  try {
    const res = await api.post("customers/edit_customer.php", data);
    if (res.data.success) {
      console.log("✅ Customer edited successfully");
      return res.data.customer || res.data;
    } else {
      console.error("Error editing customer:", res.data.message);
    }
    return res.data;
  } catch {
    throw new Error("Failed to edit customer");
  }
}

// API function (createCustomer)
export async function createCustomer(data: CustomerFormData) {
  try {
    const res = await api.post("customers/create_customer.php", data);
    if (!res.data.success) {
      const errorMessage = res.data.message || "Error creating customer";
      toast.error(errorMessage, {
        description: "Please check the details and try again.",
      });
      console.error("Error creating customer:", errorMessage);
      throw new Error(errorMessage);
    }
    console.log("✅ Customer created successfully");
    return res.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function getCustomers() {
  try {
    const res = await api.post("customers/get_customer.php");
    if (res.data.success) {
      console.log("😊 Customers fetched successfully");
    } else {
      console.error("Error fetching customers:", res.data.message);
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

export async function deleteCustomer(id: string) {
  const res = await api.post("customers/delete_customer.php", {
    id,
  });
  console.log("deleteCustomer called with response:", res.data);
  return res.data;
}

export async function getCustomerById(id: string) {
  const res = await api.post("customers/get_customer.php", { id });
  console.log("getCustomerById called with response:", res.data);
  return res.data;
}
