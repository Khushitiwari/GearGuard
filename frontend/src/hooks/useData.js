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
        setError(err.message || 'Failed to fetch equipment')
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
        setError(err.message || 'Failed to fetch requests')
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
        setError(err.message || 'Failed to fetch teams')
        console.error('Error fetching teams:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  return { teams, loading, error }
}

