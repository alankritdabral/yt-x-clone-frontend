// App configuration constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'YT-X Clone'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000

// Feature Flags
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
export const ENABLE_SOCIAL_LOGIN = import.meta.env.VITE_ENABLE_SOCIAL_LOGIN === 'true'
export const ENABLE_NOTIFICATIONS = import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true'

// OAuth Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ''

// Cloudinary Configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

// Video Categories
export const VIDEO_CATEGORIES = [
  { id: 'all', label: 'All', icon: '🎬' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'news', label: 'News', icon: '📰' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { id: 'tech', label: 'Technology', icon: '💻' },
]

// Pagination
export const ITEMS_PER_PAGE = 20
export const VIDEOS_PER_PAGE = 20

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful! Please login.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  UPDATE_SUCCESS: 'Updated successfully.',
  DELETE_SUCCESS: 'Deleted successfully.',
  VIDEO_UPLOADED: 'Video uploaded successfully!',
  TWEET_POSTED: 'Tweet posted successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
}

// Validation Rules
export const VALIDATION_RULES = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
  MIN_VIDEO_TITLE_LENGTH: 3,
  MAX_VIDEO_TITLE_LENGTH: 100,
  MIN_VIDEO_DESCRIPTION_LENGTH: 10,
  MAX_VIDEO_DESCRIPTION_LENGTH: 5000,
}

// File Size Limits (in bytes)
export const FILE_SIZE_LIMITS = {
  VIDEO: 500 * 1024 * 1024, // 500MB
  AVATAR: 5 * 1024 * 1024, // 5MB
  COVER: 10 * 1024 * 1024, // 10MB
  THUMBNAIL: 5 * 1024 * 1024, // 5MB
}

// Allowed File Types
export const ALLOWED_FILE_TYPES = {
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}
