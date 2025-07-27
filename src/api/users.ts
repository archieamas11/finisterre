import axios from "axios";

const API_URL = "http://localhost/finisterre_backend/customers/";

export async function getCustomers() {
  const res = await axios.post(API_URL + "get_customers.php");
  return res.data;
}
