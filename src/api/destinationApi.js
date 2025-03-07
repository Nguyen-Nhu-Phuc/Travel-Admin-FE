import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const destinationApi = {
  create: async (data) => {
    const response = await axios.post(`${API_URL}destination/createdestination`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  getAllDestinations: async () => {
    const response = await axios.get(`${API_URL}destination/getAlldestination`)
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}destination/${id}`)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.patch(`${API_URL}destination/update/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}destination/delete/${id}`)
    return response.data
  },

  deleteImageDestination: async (id, imageId) => {
    const response = await axios.delete(`${API_URL}destination/deleteImage/${id}/${imageId}`)
    return response.data
  },

  updateImageDestination: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('image', file))

    const response = await axios.patch(`${API_URL}destination/updateImage/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default destinationApi
