import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const restaurantlApi = {
  create: async (data) => {
    const response = await axios.post(`${API_URL}restaurant/create`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  getAll: async () => {
    const response = await axios.get(`${API_URL}restaurant/getAll`)
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}restaurant/${id}`)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.patch(`${API_URL}restaurant/update/${id}`, data)
    return response.data
  },

  deleteRestaurant: async (id) => {
    const response = await axios.delete(`${API_URL}restaurant/delete/${id}`)
    return response.data
  },

  deleteImageRestaurant: async (placeId, imageId) => {
    const response = await axios.delete(`${API_URL}restaurant/${placeId}/images/${imageId}`)
    return response.data
  },

  updateImageRestaurant: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await axios.put(`${API_URL}restaurant/${id}/images`, formData)
    return response.data
  }
}

export default restaurantlApi
