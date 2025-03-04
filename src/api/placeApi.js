import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const createPlace = async (data, files) => {
  const formData = new FormData()
  formData.append('destination_id', data.destination_id)
  formData.append('name', data.name)
  formData.append('description', data.description)
  // Nếu có files
  if (files) {
    files.forEach((file) => {
      formData.append('files', file)
    })
  }

  try {
    const response = await axios.post(`${API_URL}place/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

const getAllPlaces = async () => {
  try {
    const response = await axios.get(`${API_URL}place/getAll`)
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

const getPlaceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}place/getById/${id}`)
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

const updatePlace = async (id, data, files) => {
  const formData = new FormData()
  formData.append('destination_id', data.destination_id)
  formData.append('name', data.name)
  formData.append('description', data.description)
  // Nếu có files
  if (files) {
    files.forEach((file) => {
      formData.append('files', file)
    })
  }

  try {
    const response = await axios.put(`${API_URL}place/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

const deletePlace = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}place/deletePlace/${id}`)
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

const deleteImageFromPlace = async (placeId, imageId) => {
  try {
    const response = await axios.delete(`${API_URL}place/deleteImagePlace/${placeId}/${imageId}`)
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

const updateImageForPlace = async (placeId, files) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const response = await axios.put(`${API_URL}place/updateImagePlace/${placeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error.message
  }
}

export const placeApi = {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  deleteImageFromPlace,
  updateImageForPlace
}
