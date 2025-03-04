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

    const response = await axios.post(`${API_URL}detination/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating destination', error)
    throw error
  }
}

// Lấy tất cả các địa điểm
const getAllDestinations = async () => {
  try {
    const response = await axios.get(`${API_URL}detination/getAll`)
    return response.data
  } catch (error) {
    console.error('Error fetching destinations', error)
    throw error
  }
}

// Lấy thông tin một địa điểm theo ID
const getDestinationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}detination/getById/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching destination by ID', error)
    throw error
  }
}

// Cập nhật thông tin một địa điểm
const updateDestination = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}detination/updateDestination/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating destination', error)
    throw error
  }
}

// Xóa địa điểm
const deleteDestination = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}detination/deleteDestination/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting destination', error)
    throw error
  }
}

// Cập nhật ảnh của địa điểm
const updateImageDestination = async (id, files) => {
  try {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const response = await axios.post(`${API_URL}detination/updateImageDestination/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating image for destination', error)
    throw error
  }
}

// Xóa ảnh của địa điểm
const deleteImageDestination = async (id, imageId) => {
  try {
    const response = await axios.delete(`${API_URL}detination/deleteImageDestination/${id}/${imageId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting image from destination', error)
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
