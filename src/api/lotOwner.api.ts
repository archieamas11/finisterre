import { api } from "./axiosInstance";

export async function getLotOwner() {
  const res = await api.post("lot-owners/get_lot_owner.php");
  console.log(res.data);
  return res.data;
}

export async function createLotOwner(data: any) {
  const res = await api.post("lot-owners/create_lot_owner.php", data);
  return res.data;
}

export async function editLotOwner(data: any) {
  const res = await api.post("lot-owners/edit_lot_owner.php", data);
  return res.data;
}
