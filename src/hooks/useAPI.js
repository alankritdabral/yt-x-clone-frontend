// Custom hook for API calls with loading and error handling
import { useState, useCallback } from 'react'
import { handleAPIError } from '../utils/errorHandler'

export const useAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (apiCall) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall()
      return response.data
    } catch (err) {
      const errorData = handleAPIError(err)
      setError(errorData)
      throw errorData
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, request, setError }
}

export default useAPI
