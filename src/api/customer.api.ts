import { api } from './axiosInstance'

export interface LotInfo {
  lot_id: number | string | null
  niche_number: string | number | null
  plot_id: number | null
  coordinates?: [number, number] | null
  block: string | null
  lot_plot_id: number | null
  category: string | null
  lot_status: 'active' | 'completed' | 'cancelled' | 'canceled' | null
  niche_status?: 'available' | 'occupied' | 'reserved' | null
  deceased_info: DeceasedInfo[]
}

export interface DeceasedInfo {
  deceased_id: string | null
  dead_fullname: string | null
  dead_date_death: string | null
  dead_interment: string | null
  status: string | null
}

export type Customer = {
  customer_id: string
  first_name: string
  middle_name: string | null
  last_name: string
  email: string
  nickname: string | null
  address: string
  contact_number: string
  birth_date: string | null
  gender: 'Male' | 'Female' | string
  religion: string | null
  citizenship: string | null
  status: 'Single' | 'Married' | 'Divorced' | 'Widowed' | string
  occupation: string | null
  created_at: string | null
  updated_at: string | null
  lot_info?: LotInfo[]
}

export async function getCustomers() {
  try {
    const res = await api.get('customers/get_customer.php')
    return res.data
  } catch (error) {
    console.error('Get customers failed:', error)
    throw error
  }
}

export async function getCustomerById(id: string | number) {
  try {
    const res = await api.get('customers/get_customer.php', { params: { id } })
    return res.data
  } catch (error) {
    console.error('Get customer by ID failed:', error)
    throw error
  }
}

export async function editCustomer(data: Customer) {
  try {
    const res = await api.post('customers/edit_customer.php', data)
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to update customer')
    }
    return res.data
  } catch (error) {
    console.error('Edit customer failed:', error)
    throw error
  }
}

export async function createCustomer(data: Customer) {
  try {
    const res = await api.post('customers/create_customer.php', data)
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to create customer')
    }
    return res.data
  } catch (error) {
    console.error('Create customer failed:', error)
    throw error
  }
}

export async function deleteCustomer(id: string | number) {
  try {
    const res = await api.post('customers/delete_customer.php', { id })
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to delete customer')
    }
    return res.data
  } catch (error) {
    console.error('Delete customer failed:', error)
    throw error
  }
}

export async function archiveCustomer(customer_id: string | number) {
  try {
    const res = await api.post('customers/archive_customer.php', { customer_id })
    if (!res.data.success) {
      throw new Error(res.data.message || 'Failed to archive customer')
    }
    return res.data
  } catch (error) {
    console.error('Archive customer failed:', error)
    throw error
  }
}
