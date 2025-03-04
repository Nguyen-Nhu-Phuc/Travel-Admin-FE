import axios from 'axios'

// Định nghĩa URL của API
const API_URL = import.meta.env.VITE_API_URL

// Tạo khách sạn mới
const createHotel = async (hotelData, files) => {
  const formData = new FormData()
  formData.append('destination_id', hotelData.destination_id)
  formData.append('name', hotelData.name)
  formData.append('address', hotelData.address)
  formData.append('description', hotelData.description)

  // Thêm file nếu có
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('files', file)
    })
  }

  try {
    const response = await axios.post(`${API_URL}/hotel/createHotel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating hotel:', error)
    throw error
  }
}

// Lấy danh sách khách sạn
const getAllHotels = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching hotels:', error)
    throw error
  }
}

// Lấy thông tin khách sạn theo ID
const getHotelById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}hotel/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching hotel by ID:', error)
    throw error
  }
}

// Cập nhật thông tin khách sạn
const updateHotel = async (id, hotelData) => {
  try {
    const response = await axios.put(`${API_URL}hotel/${id}`, hotelData)
    return response.data
  } catch (error) {
    console.error('Error updating hotel:', error)
    throw error
  }
}

// Xóa khách sạn
const deleteHotel = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}hotel/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting hotel:', error)
    throw error
  }
}

// Cập nhật ảnh cho khách sạn
const updateHotelImage = async (id, files) => {
  const formData = new FormData()
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('files', file)
    })
  }

  try {
    const response = await axios.post(`${API_URL}hotel/${id}/update-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating hotel image:', error)
    throw error
  }
}

// Xóa ảnh khách sạn
const deleteHotelImage = async (id, imageId) => {
  try {
    const response = await axios.delete(`${API_URL}hotel/${id}/delete-image/${imageId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting hotel image:', error)
    throw error
  }
}

// Export các API dưới dạng một đối tượng
export { createHotel, getAllHotels, getHotelById, updateHotel, deleteHotel, updateHotelImage, deleteHotelImage }
