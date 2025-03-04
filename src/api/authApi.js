import axios from 'axios'

// Dùng import.meta.env để lấy biến môi trường trong Vite
const API_BASE_URL = import.meta.env.VITE_API_URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}auth/SignIn`, { email, password })

    return response.data
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message)
    throw error.response?.data || { message: 'Login failed' }
  }
}

export const signUp = async (fullName, username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}auth/signUp`, { fullName, username, email, password })
    return response.data
  } catch (error) {
    console.error('Sign-up failed:', error.response?.data || error.message)
    throw error.response?.data || { message: 'Sign-up failed' }
  }
}
