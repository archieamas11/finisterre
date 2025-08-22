import { api } from './axiosInstance'

export interface LotInfo {
  niche_number: string | number | null
  plot_id: number | null
  block: string | null
  lot_plot_id: number | null
  category: string | null
  deceased_info: DeceasedInfo[]
}

export interface DeceasedInfo {
  deceased_id: string | null
  dead_fullname: string | null
  dead_date_death: string | null
  dead_interment: string | null
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
  const res = await api.post('customers/get_customer.php')
  return res.data
}

export async function editCustomer(data: Customer) {
  const res = await api.post('customers/edit_customer.php', data)
  return res.data
}

export async function createCustomer(data: Customer) {
  const res = await api.post('customers/create_customer.php', data)
  return res.data
}

export async function deleteCustomer(id: string | number) {
  const res = await api.post('customers/delete_customer.php', { id })
  return res.data
}

export async function getCustomerById(id: string | number) {
  const res = await api.post('customers/get_customer.php', { id })
  return res.data
}
