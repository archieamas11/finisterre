import { api } from "./axiosInstance";

export async function getDeceasedRecords() {
  const res = await api.post("deceased-records/get_deceased.php");
  console.log(res.data);
  return res.data;
}

export async function editDeceasedRecords(data: unknown) {
  // Validate data before sending in actual usage
  const res = await api.post("deceased-records/edit_deceased.php", data);
  return res.data;
}

export async function createDeceasedRecords(data: unknown) {
  // Validate data before sending in actual usage
  const res = await api.post("deceased-records/create_deceased.php", data);
  return res.data;
}
