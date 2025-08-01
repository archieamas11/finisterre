import axios from "axios";

// import { APP_URL } from "./getApiUrl";
const APP_URL = "http://localhost/finisterre_backend/";
// const APP_URL = "https://finisterre.ct.ws/";

export async function getDeceasedRecords() {
    const res = await axios.post(APP_URL + "deceased-records/get_deceased.php");
    return res.data;
}

export async function editDeceasedRecords(data: any) {
    const res = await axios.post(APP_URL + "deceased-records/edit_deceased.php", data);
    return res.data;
}

export async function createDeceasedRecords(data: any) {
    const res = await axios.post(APP_URL + "deceased-records/create_deceased.php", data);
    return res.data;
}