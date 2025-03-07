import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const hotelApi = {
  create: async (data) => {
    const response = await axios.post(`${API_URL}hotel/create`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

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
    const response = await axios.patch(`${API_URL}hotel/update/${id}`, data)
    return response.data
  },

  deleteHotel: async (id) => {
    const response = await axios.delete(`${API_URL}hotel/delete/${id}`)
    return response.data
  },

  deleteImageHotel: async (id, imageId) => {
    const response = await axios.delete(`${API_URL}hotel/deleteImage/${id}/${imageId}`)
    return response.data
  },

  updateImageHotel: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('image', file))

    const response = await axios.patch(`${API_URL}hotel/updateImage/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default hotelApi
