import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Tạo một địa điểm mới
const createDestination = async (data, files) => {
  try {
    const formData = new FormData()
    // Thêm các thông tin từ data vào formData
    for (const key in data) {
      formData.append(key, data[key])
    }
    // Thêm file nếu có
    if (files && files.length > 0) {
      files.forEach((file) => formData.append('files', file))
    }

    const response = await axios.post(`${API_URL}destination/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating destination:', error.response?.data || error.message)
    throw error
  }
}

// Lấy tất cả các địa điểm
export const getAllDestinations = async () => {
  try {
    const response = await axios.get(`${API_URL}destination/getAlldestination`)

    return response.data
  } catch (error) {
    console.error('Error fetching destinations:', error.response?.data || error.message)
    throw error
  }
}

// Lấy thông tin một địa điểm theo ID
const getDestinationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}destination/getById/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching destination by ID:', error.response?.data || error.message)
    throw error
  }
}

// Cập nhật thông tin một địa điểm
const updateDestination = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}destination/updateDestination/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating destination:', error.response?.data || error.message)
    throw error
  }
}

// Xóa địa điểm
const deleteDestination = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}destination/deleteDestination/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting destination:', error.response?.data || error.message)
    throw error
  }
}

// Cập nhật ảnh của địa điểm
const updateImageDestination = async (id, files) => {
  try {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await axios.post(`${API_URL}destination/updateImageDestination/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating image for destination:', error.response?.data || error.message)
    throw error
  }
}

// Xóa ảnh của địa điểm
const deleteImageDestination = async (id, imageId) => {
  try {
    const response = await axios.delete(`${API_URL}destination/deleteImageDestination/${id}/${imageId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting image from destination:', error.response?.data || error.message)
    throw error
  }
}

export default {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
  updateImageDestination,
  deleteImageDestination
}
