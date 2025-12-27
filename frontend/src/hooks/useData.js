import { useState, useEffect } from 'react'
import { equipmentAPI, requestAPI, teamAPI } from '../services/api'

// Hook for fetching equipment data
export const useEquipment = () => {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true)
        const response = await equipmentAPI.getAll()
        if (response.success) {
          setEquipment(response.equipment || [])
        } else {
          setError(response.message || 'Failed to fetch equipment')
        }
      } catch (err) {
        // Provide more helpful error messages
        let errorMessage = err.message || 'Failed to fetch equipment'
        
        // Check if it's a network error (backend not running)
        if (err.name === 'NetworkError' || err.message.includes('Failed to connect')) {
          errorMessage = 'Cannot connect to backend server. Please ensure:\n' +
            '1. Backend is running on port 4000\n' +
            '2. MongoDB is connected\n' +
            '3. You are logged in'
        } else if (err.message.includes('Authentication required')) {
          errorMessage = 'Please login to view equipment'
        }
        
        setError(errorMessage)
        console.error('Error fetching equipment:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipment()
  }, [])

  return { equipment, loading, error, refetch: () => {
    setLoading(true)
    equipmentAPI.getAll()
      .then(response => {
        if (response.success) {
          setEquipment(response.equipment || [])
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }}
}

// Hook for fetching requests data
export const useRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await requestAPI.getAll()
        if (response.success) {
          setRequests(response.requests || [])
        } else {
          setError(response.message || 'Failed to fetch requests')
        }
      } catch (err) {
        // Provide more helpful error messages
        let errorMessage = err.message || 'Failed to fetch requests'
        
        // Check if it's a network error (backend not running)
        if (err.name === 'NetworkError' || err.message.includes('Failed to connect')) {
          errorMessage = 'Cannot connect to backend server. Please ensure:\n' +
            '1. Backend is running on port 4000\n' +
            '2. MongoDB is connected\n' +
            '3. You are logged in'
        } else if (err.message.includes('Authentication required')) {
          errorMessage = 'Please login to view requests'
        }
        
        setError(errorMessage)
        console.error('Error fetching requests:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  return { requests, loading, error, refetch: () => {
    setLoading(true)
    requestAPI.getAll()
      .then(response => {
        if (response.success) {
          setRequests(response.requests || [])
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }}
}

// Hook for fetching teams data
export const useTeams = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const response = await teamAPI.getAll()
        if (response.success) {
          setTeams(response.teams || [])
        } else {
          setError(response.message || 'Failed to fetch teams')
        }
      } catch (err) {
        // Provide more helpful error messages
        let errorMessage = err.message || 'Failed to fetch teams'
        
        // Check if it's a network error (backend not running)
        if (err.name === 'NetworkError' || err.message.includes('Failed to connect')) {
          errorMessage = 'Cannot connect to backend server. Please ensure:\n' +
            '1. Backend is running on port 4000\n' +
            '2. MongoDB is connected\n' +
            '3. You are logged in'
        } else if (err.message.includes('Authentication required')) {
          errorMessage = 'Please login to view teams'
        }
        
        setError(errorMessage)
        console.error('Error fetching teams:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  return { teams, loading, error }
}

