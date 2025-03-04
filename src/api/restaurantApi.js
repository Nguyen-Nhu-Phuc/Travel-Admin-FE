import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Tạo mới nhà hàng
const createRestaurant = async (data, files) => {
  try {
    const formData = new FormData()
    formData.append('destination_id', data.destination_id)
    formData.append('name', data.name)
    formData.append('address', data.address)
    formData.append('description', data.description)

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file)
      })
    }

    const response = await axios.post(`${apiUrl}restaurant/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error creating restaurant:', error)
    throw error
  }
}

// Lấy danh sách nhà hàng
const getAllRestaurants = async () => {
  try {
    const response = await axios.get(`${apiUrl}/restauran`)
    return response.data
  } catch (error) {
    console.error('Error fetching restauran:', error)
    throw error
  }
}

// Lấy thông tin nhà hàng theo ID
const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/restauran/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    throw error
  }
}

// Cập nhật nhà hàng
const updateRestaurant = async (id, data) => {
  try {
    const response = await axios.put(`${apiUrl}/restauran/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating restaurant:', error)
    throw error
  }
}

// Xóa nhà hàng
const deleteRestaurant = async (id) => {
  try {
    const response = await axios.delete(`${apiUrl}/restauran/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting restaurant:', error)
    throw error
  }
}

// Thêm ảnh mới vào nhà hàng
const updateImageRestaurant = async (id, files) => {
  try {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await axios.put(`${apiUrl}/restauran/${id}/update-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    console.error('Error adding images to restaurant:', error)
    throw error
  }
}

// Xóa ảnh khỏi nhà hàng
const deleteImageRestaurant = async (restaurantId, imageId) => {
  try {
    const response = await axios.delete(`${apiUrl}/restauran/${restaurantId}/image/${imageId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting image from restaurant:', error)
    throw error
  }
}

export {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  updateImageRestaurant,
  deleteImageRestaurant
}
