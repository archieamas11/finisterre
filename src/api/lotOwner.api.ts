import { api } from './axiosInstance'

export async function createLotOwner(data: Record<string, unknown>) {
  try {
    const res = await api.post('lot-owners/create_lot_owner.php', data)
    console.log('createLotOwner called with response:', res.data)
    return res.data
  } catch (error) {
    console.error('Create lot owner failed:', error)
    throw error
  }
}

export async function editLotOwner(data: Record<string, unknown>) {
  try {
    const res = await api.post('lot-owners/edit_lot_owner.php', data)
    console.log('editLotOwner called with response:', res.data)
    return res.data
  } catch (error) {
    console.error('Edit lot owner failed:', error)
    throw error
  }
}

export async function getLotOwner() {
  try {
    const res = await api.get('lot-owners/get_lot_owner.php')
    return res.data
  } catch (error) {
    console.error('Get lot owner failed:', error)
    throw error
  }
}

export async function getLotOwnerById(id: string) {
  try {
    const res = await api.get('lot-owners/get_lot_owner.php', { params: { id } })
    return res.data
  } catch (error) {
    console.error('Get lot owner by ID failed:', error)
    throw error
  }
}
