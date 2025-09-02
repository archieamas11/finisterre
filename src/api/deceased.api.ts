import type { DeceasedRecords } from '@/types/interment.types'

import { api } from './axiosInstance'

export async function createDeceasedRecord(data: DeceasedRecords) {
  try {
    console.log('🚀 Creating deceased record:', data)
    const res = await api.post('deceased-records/create_deceased.php', data)
    console.log('✅ Deceased record created successfully:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Failed to create deceased record:', error)
    throw error
  }
}

export async function editDeceasedRecords(data: DeceasedRecords) {
  try {
    console.log('✏️ Updating deceased record:', data)
    const res = await api.post('deceased-records/edit_deceased.php', data)
    console.log('✅ Deceased record updated successfully:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Failed to update deceased record:', error)
    throw error
  }
}

export async function getDeceasedRecords() {
  try {
    console.log('📋 Fetching all deceased records')
    const res = await api.post('deceased-records/get_deceased.php')
    console.log('✅ Deceased records fetched:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Failed to fetch deceased records:', error)
    throw error
  }
}

export async function getDeceasedRecordsById(id: string) {
  try {
    console.log('🔍 Fetching deceased record by ID:', id)
    const res = await api.post('deceased-records/get_deceased_id.php', { id })
    console.log('✅ Deceased record fetched:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Failed to fetch deceased record by ID:', error)
    throw error
  }
}

export async function getDeceasedRecordsForPlot(plotId: string) {
  try {
    console.log('📋 Fetching deceased records for plot:', plotId)
    const res = await api.post('deceased-records/get_deceased_by_plot.php', { plot_id: plotId })
    console.log('✅ Deceased records fetched for plot:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ Failed to fetch deceased records for plot:', error)
    throw error
  }
}
