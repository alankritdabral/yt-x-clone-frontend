// Local storage utility functions
import { STORAGE_KEYS } from '../constants'

export const storage = {
  // Get item from localStorage
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error)
      return null
    }
  },

  // Set item in localStorage
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error)
    }
  },

  // Remove item from localStorage
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error)
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage', error)
    }
  },

  // Token management
  getToken: () => storage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  setToken: (token) => storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeToken: () => storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),

  // User management
  getUser: () => storage.getItem(STORAGE_KEYS.USER),
  setUser: (user) => storage.setItem(STORAGE_KEYS.USER, user),
  removeUser: () => storage.removeItem(STORAGE_KEYS.USER),

  // Theme management
  getTheme: () => storage.getItem(STORAGE_KEYS.THEME) || 'light',
  setTheme: (theme) => storage.setItem(STORAGE_KEYS.THEME, theme),

  // Language management
  getLanguage: () => storage.getItem(STORAGE_KEYS.LANGUAGE) || 'en',
  setLanguage: (language) => storage.setItem(STORAGE_KEYS.LANGUAGE, language),
}

export default storage
