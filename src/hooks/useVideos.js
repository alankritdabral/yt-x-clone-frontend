// Custom hook for fetching videos
import { useState, useEffect } from 'react'
import videoAPI from '../api/videoAPI'
import { handleAPIError } from '../utils/errorHandler'

export const useVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchVideos = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await videoAPI.getAllVideos(params)
      setVideos(response.data)
      return response.data
    } catch (err) {
      const errorData = handleAPIError(err)
      setError(errorData)
      throw errorData
    } finally {
      setLoading(false)
    }
  }

  const fetchVideoById = async (videoId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await videoAPI.getVideoById(videoId)
      return response.data
    } catch (err) {
      const errorData = handleAPIError(err)
      setError(errorData)
      throw errorData
    } finally {
      setLoading(false)
    }
  }

  const searchVideos = async (query, params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await videoAPI.searchVideos(query, params)
      setVideos(response.data)
      return response.data
    } catch (err) {
      const errorData = handleAPIError(err)
      setError(errorData)
      throw errorData
    } finally {
      setLoading(false)
    }
  }

  return {
    videos,
    loading,
    error,
    fetchVideos,
    fetchVideoById,
    searchVideos,
    setError,
  }
}

export default useVideos
