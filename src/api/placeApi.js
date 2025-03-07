import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const placelApi = {
  create: async (data) => {
    const response = await axios.post(`${API_URL}place/create`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  getAll: async () => {
    const response = await axios.get(`${API_URL}place/getAll`)
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}place/${id}`)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.patch(`${API_URL}place/update/${id}`, data)
    return response.data
  },

  deletePlace: async (id) => {
    const response = await axios.delete(`${API_URL}place/delete/${id}`)
    return response.data
  },

  deleteImagePlace: async (id, imageId) => {
    const response = await axios.delete(`${API_URL}place/deleteImage/${id}/${imageId}`)
    return response.data
  },

  updateImageplace: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('image', file))

    const response = await axios.patch(`${API_URL}place//updateImage/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default placelApi
