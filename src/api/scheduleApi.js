const axios = require('axios') // Sử dụng axios để gọi API

// Lấy URL cơ bản từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL

// API để lấy danh sách địa điểm
const getPlaces = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/places`) // Sử dụng API_URL trong URL
    return response.data
  } catch (error) {
    throw new Error('Lỗi khi gọi API lấy địa điểm: ' + error.message)
  }
}

// API để lấy chi tiết một địa điểm
const getPlaceById = async (placeId) => {
  try {
    const response = await axios.get(`${API_URL}/api/places/${placeId}`)
    return response.data
  } catch (error) {
    throw new Error('Lỗi khi gọi API lấy chi tiết địa điểm: ' + error.message)
  }
}

// API để tạo một địa điểm mới
const createPlace = async (placeData) => {
  try {
    const response = await axios.post(`${API_URL}/api/places`, placeData) // Gửi yêu cầu POST để tạo mới
    return response.data
  } catch (error) {
    throw new Error('Lỗi khi gọi API tạo địa điểm: ' + error.message)
  }
}

// API để cập nhật địa điểm
const updatePlace = async (placeId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/api/places/${placeId}`, updatedData) // Gửi yêu cầu PUT để cập nhật
    return response.data
  } catch (error) {
    throw new Error('Lỗi khi gọi API cập nhật địa điểm: ' + error.message)
  }
}

// API để xóa địa điểm
const deletePlace = async (placeId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/places/${placeId}`) // Gửi yêu cầu DELETE để xóa
    return response.data
  } catch (error) {
    throw new Error('Lỗi khi gọi API xóa địa điểm: ' + error.message)
  }
}

module.exports = {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
}
