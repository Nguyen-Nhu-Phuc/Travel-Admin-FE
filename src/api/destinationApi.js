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

  deleteImageDestination: async (placeId, imageId) => {
    const response = await axios.delete(`${API_URL}destination/${placeId}/images/${imageId}`)
    return response.data
  },

  updateImageDestination: async (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await axios.put(`${API_URL}destination/${id}/images`, formData)
    return response.data
  }
}

export default destinationApi

// const createDestination = async (data, files) => {
//   try {
//     const formData = new FormData()

//     for (const key in data) {
//       formData.append(key, data[key])
//     }

//     if (files && files.length > 0) {
//       files.forEach((file) => formData.append('files', file))
//     }

//     const response = await axios.post(`${API_URL}destination/create`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//     return response.data
//   } catch (error) {
//     console.error('Error creating destination:', error.response?.data || error.message)
//     throw error
//   }
// }

// export const getAllDestinations = async () => {
//   try {
//     const response = await axios.get(`${API_URL}destination/getAlldestination`)

//     return response.data
//   } catch (error) {
//     console.error('Error fetching destinations:', error.response?.data || error.message)
//     throw error
//   }
// }

// const getDestinationById = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}destination/getById/${id}`)
//     return response.data
//   } catch (error) {
//     console.error('Error fetching destination by ID:', error.response?.data || error.message)
//     throw error
//   }
// }

// const updateDestination = async (id, data) => {
//   try {
//     const response = await axios.put(`${API_URL}destination/updateDestination/${id}`, data)
//     return response.data
//   } catch (error) {
//     console.error('Error updating destination:', error.response?.data || error.message)
//     throw error
//   }
// }

// const deleteDestination = async (id) => {
//   try {
//     const response = await axios.delete(`${API_URL}destination/deleteDestination/${id}`)
//     return response.data
//   } catch (error) {
//     console.error('Error deleting destination:', error.response?.data || error.message)
//     throw error
//   }
// }

// const updateImageDestination = async (id, files) => {
//   try {
//     const formData = new FormData()
//     files.forEach((file) => formData.append('files', file))

//     const response = await axios.post(`${API_URL}destination/updateImageDestination/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//     return response.data
//   } catch (error) {
//     console.error('Error updating image for destination:', error.response?.data || error.message)
//     throw error
//   }
// }

// const deleteImageDestination = async (id, imageId) => {
//   try {
//     const response = await axios.delete(`${API_URL}destination/deleteImageDestination/${id}/${imageId}`)
//     return response.data
//   } catch (error) {
//     console.error('Error deleting image from destination:', error.response?.data || error.message)
//     throw error
//   }
// }

// export default {
//   createDestination,
//   getAllDestinations,
//   getDestinationById,
//   updateDestination,
//   deleteDestination,
//   updateImageDestination,
//   deleteImageDestination
// }
