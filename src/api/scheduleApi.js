import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const scheduleApi = {
  create: async (data) => {
    const response = await axios.post(`${API_URL}schedule/create`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  getAll: async () => {
    const response = await axios.get(`${API_URL}schedule/getAll`)
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}schedule/${id}`)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.patch(`${API_URL}schedule/update/${id}`, data)
    return response.data
  },

  deleteSchedule: async (id) => {
    const response = await axios.delete(`${API_URL}schedule/delete/${id}`)
    return response.data
  },

  deleteImageSchedule: async (placeId, imageId) => {
    const response = await axios.delete(`${API_URL}schedule/${placeId}/images/${imageId}`)
    return response.data
  },

  updateImageSchedule: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await axios.put(`${API_URL}schedule/${id}/images`, formData)
    return response.data
  }
}

export default scheduleApi
