// API service for backend communication
// Use relative path to leverage Vite proxy in development
// In production, set VITE_API_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
  }

  try {
    const response = await fetch(url, config)
    
    // Parse JSON response first
    let data
    try {
      data = await response.json()
    } catch (e) {
      // If response is not JSON, handle HTTP errors
      if (!response.ok) {
        let errorMessage = response.statusText || `HTTP ${response.status}`
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please login.'
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.'
        } else if (response.status === 404) {
          errorMessage = 'Resource not found.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }
        throw new Error(errorMessage)
      }
      // If response is not JSON but status is OK, return empty object
      return {}
    }
    
    // Backend returns { success: true/false, message: "...", ...data }
    // Check for backend error format (success: false)
    if (data.success === false) {
      throw new Error(data.message || 'API request failed')
    }
    
    // Handle HTTP errors (for non-JSON responses or actual HTTP errors)
    if (!response.ok) {
      let errorMessage = data.message || response.statusText || `HTTP ${response.status}`
      if (response.status === 401) {
        errorMessage = 'Authentication required. Please login.'
      } else if (response.status === 403) {
        errorMessage = 'You do not have permission to perform this action.'
      } else if (response.status === 404) {
        errorMessage = 'Resource not found.'
      } else if (response.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      }
      throw new Error(errorMessage)
    }
    
    return data
  } catch (error) {
    // Handle network errors (backend not running, connection refused, etc.)
    const isNetworkError = 
      error.name === 'TypeError' || 
      error.name === 'NetworkError' ||
      error.message.includes('fetch') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Network request failed') ||
      error.message.includes('ERR_CONNECTION_REFUSED') ||
      error.message.includes('ERR_INTERNET_DISCONNECTED')
    
    if (isNetworkError) {
      const networkError = new Error(
        'Failed to connect to backend server. Please make sure:\n' +
        '1. Backend server is running on port 4000\n' +
        '2. MongoDB is connected\n' +
        '3. You are authenticated (login required)'
      )
      networkError.name = 'NetworkError'
      throw networkError
    }
    
    // Re-throw other errors
    console.error('API Error:', error)
    throw error
  }
}

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  
  register: async (name, email, password, role) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    })
  },
  
  logout: async () => {
    return apiRequest('/users/logout', {
      method: 'POST',
    })
  },
}

// Equipment API
export const equipmentAPI = {
  getAll: async () => {
    return apiRequest('/equipment/get-all', {
      method: 'GET',
    })
  },
  
  getById: async (id) => {
    return apiRequest(`/equipment/get/${id}`, {
      method: 'GET',
    })
  },
  
  create: async (equipmentData) => {
    return apiRequest('/equipment/create', {
      method: 'POST',
      body: JSON.stringify(equipmentData),
    })
  },
  
  update: async (id, equipmentData) => {
    return apiRequest(`/equipment/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipmentData),
    })
  },
  
  delete: async (id) => {
    return apiRequest(`/equipment/delete/${id}`, {
      method: 'DELETE',
    })
  },
}

// Request API
export const requestAPI = {
  getAll: async () => {
    return apiRequest('/request/get-all', {
      method: 'GET',
    })
  },
  
  getById: async (id) => {
    return apiRequest(`/request/get/${id}`, {
      method: 'GET',
    })
  },
  
  create: async (requestData) => {
    return apiRequest('/request/create', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  },
  
  update: async (id, requestData) => {
    return apiRequest(`/request/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    })
  },
  
  delete: async (id) => {
    return apiRequest(`/request/${id}`, {
      method: 'DELETE',
    })
  },
}

// Team API
export const teamAPI = {
  getAll: async () => {
    return apiRequest('/team/get-all', {
      method: 'GET',
    })
  },
  
  getById: async (id) => {
    return apiRequest(`/team/${id}`, {
      method: 'GET',
    })
  },
}

// User API
export const userAPI = {
  getAll: async () => {
    return apiRequest('/users/get-all', {
      method: 'GET',
    })
  },
}

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.ok
  } catch (error) {
    return false
  }
}

