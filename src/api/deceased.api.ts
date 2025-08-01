import axios from "axios";
import { APP_URL } from "./axiosInstance";

export async function getDeceasedRecords() {
  const res = await axios.post(APP_URL + "deceased-records/get_deceased.php");
  return res.data;
}

export async function editDeceasedRecords(data: unknown) {
  // Validate data before sending in actual usage
  const res = await axios.post(
    APP_URL + "deceased-records/edit_deceased.php",
    data
  );
  return res.data;
}

export async function createDeceasedRecords(data: unknown) {
  // Validate data before sending in actual usage
  const res = await axios.post(
    APP_URL + "deceased-records/create_deceased.php",
    data
  );
  return res.data;
}
