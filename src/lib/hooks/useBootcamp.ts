'use client'

import { useState, useEffect } from 'react'
import { api } from '@/utils/axios.config'

export interface Bootcamp {
  id: number
  name: string
  description: string | null
  collaborator: string | null
  coverImage: string | null
  bootcampTopic: string | null
  startTime: string | null
  duration: number | null
  language: string | null
  createdAt: string
  updatedAt: string
  version: string | null
  students_in_bootcamp: number
  unassigned_students: number
}

export interface BootcampApiResponse {
  data: Bootcamp[]
  permissions: {
    createCourse: boolean
    viewCourse: boolean
    editCourse: boolean
    deleteCourse: boolean
    viewQuestion: boolean
    viewRolesAndPermission: boolean
  }
  totalBootcamps: number
  totalPages: number | null
}

interface UseBootcampReturn {
  bootcamps: Bootcamp[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  totalBootcamps: number
  permissions: BootcampApiResponse['permissions'] | null
}

export function useBootcamp(): UseBootcampReturn {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<BootcampApiResponse['permissions'] | null>(null)
  const [totalBootcamps, setTotalBootcamps] = useState<number>(0)

  const fetchBootcamps = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get<BootcampApiResponse>('/bootcamp')

      setBootcamps(response.data.data)
      setPermissions(response.data.permissions)
      setTotalBootcamps(response.data.totalBootcamps)
    } catch (err: any) {
      console.error('Error fetching bootcamps:', err)
      setError(err?.response?.data?.message || 'Failed to fetch bootcamps')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBootcamps()
  }, [])

  return {
    bootcamps,
    loading,
    error,
    refetch: fetchBootcamps,
    totalBootcamps,
    permissions,
  }
}
