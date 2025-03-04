import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const hotelApi = {
  create: async (data, files) => {
    const formData = new FormData()

    for (const key in data) {
      formData.append(key, data[key])
    }

    if (files) {
      files.forEach((file) => formData.append('files', file))
    }

    const response = await axios.post(`${API_URL}hotel/create`, formData)
    return response.data
  },

  getAll: async () => {
    const response = await axios.get(`${API_URL}hotel/getALL`)
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}hotel/${id}`)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.put(`${API_URL}hotel/${id}`, data)
    return response.data
  },

  deleteHotel: async (id) => {
    const response = await axios.delete(`${API_URL}hotel/${id}`)
    return response.data
  },

  deleteImageHotel: async (hotelId, imageId) => {
    const response = await axios.delete(`${API_URL}hotel/${hotelId}/images/${imageId}`)
    return response.data
  },

  updateImageHotel: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await axios.put(`${API_URL}hotel/${id}/images`, formData)
    return response.data
  }
}

export default hotelApi
