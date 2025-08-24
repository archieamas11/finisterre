import { api } from './axiosInstance'

export async function createLotOwner(data: Record<string, unknown>) {
  const res = await api.post('lot-owners/create_lot_owner.php', data)
  console.log('createLotOwner called with response:', res.data)
  return res.data
}

export async function editLotOwner(data: Record<string, unknown>) {
  const res = await api.post('lot-owners/edit_lot_owner.php', data)
  console.log('editLotOwner called with response:', res.data)
  return res.data
}

export async function getLotOwner() {
  const res = await api.post('lot-owners/get_lot_owner.php')
  console.log(res.data)
  return res.data
}

export async function getLotOwnerById(id: string) {
  const res = await api.post('lot-owners/get_lot_owner.php', { id })
  console.log(res.data)
  return res.data
}
