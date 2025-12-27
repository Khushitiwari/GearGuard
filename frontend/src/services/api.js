// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

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
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }
    
    return data
  } catch (error) {
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
  // Add user-related API calls if needed
}

