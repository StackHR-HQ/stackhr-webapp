import axios from 'axios'
import { getStoredAuthToken } from '../features/auth/store/auth-store'
import { API_BASE_URL } from './env'

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  const token = getStoredAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
