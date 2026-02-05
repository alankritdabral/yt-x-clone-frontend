// Custom hook for authentication
import { useState, useCallback } from 'react'
import apiClient from '../api/axiosClient'
import { handleAPIError } from '../utils/errorHandler'

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/users/login', { email, password })
      const { user, accessToken } = response.data.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      return { success: true, user }
    } catch (err) {
      const errorData = handleAPIError(err)
      setError(errorData)
      throw errorData
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (username, email, password) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/users/register', { username, email, password })
      return { success: true, data: response.data.data }
    } catch (err) {
      const errorData = handleAPIError(err)
      setError(errorData)
      throw errorData
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
  }, [])

  const isAuthenticated = !!user

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    setError,
  }
}

export default useAuth
