// API error handler utility
export class APIError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.data = null
  }
}

// Handle API errors and return formatted error message
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    const message = data?.message || 'Something went wrong'
    const errors = data?.errors || []
    
    return {
      success: false,
      message,
      statusCode: status,
      errors,
    }
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      message: 'No response from server. Please check your connection.',
      statusCode: 0,
      errors: [],
    }
  } else {
    // Error in request setup
    return {
      success: false,
      message: error.message || 'An error occurred',
      statusCode: 0,
      errors: [],
    }
  }
}

// Format error message for display
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.errors?.length > 0) return error.errors[0]
  return 'An error occurred. Please try again.'
}

// Check if error is authentication error
export const isAuthError = (error) => {
  return error?.statusCode === 401 || error?.status === 401
}

// Check if error is validation error
export const isValidationError = (error) => {
  return error?.statusCode === 400 || error?.status === 400
}
