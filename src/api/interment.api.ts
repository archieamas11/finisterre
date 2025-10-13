import { api } from './axiosInstance'

export interface EditLotStatus {
  lot_id: string
  lot_status: 'active' | 'completed' | 'cancelled'
}

export interface EditDeceasedStatus {
  deceased_id: string
  status: 'active' | 'transferred' | 'cancelled'
}

export async function editLotStatusById(data: EditLotStatus) {
  try {
    const res = await api.post('lot-owners/edit_lot_owner_id.php', data)
    return res.data
  } catch (error) {
    console.error('Failed to update lot record:', error)
    throw error
  }
}

export async function editDeceasedStatusById(data: EditDeceasedStatus) {
  try {
    const res = await api.post('deceased-records/edit_deceased_id.php', data)
    return res.data
  } catch (error) {
    console.error('Failed to update deceased record:', error)
    throw error
  }
}
