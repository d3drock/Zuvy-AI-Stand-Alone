'use client'

import { useState, useEffect } from 'react'
import { api } from '@/utils/axios.config'

export interface InstructorDetails {
  id: number
  name: string
  profilePicture: string | null
}

export interface StudentBootcamp {
  id: number
  name: string
  coverImage: string
  duration: number | null
  language: string
  bootcampTopic: string
  description: string
  batchId: number
  batchName: string
  progress: number
  instructorDetails: InstructorDetails
}

export interface StudentApiResponse {
  completedBootcamps: StudentBootcamp[]
  inProgressBootcamps: StudentBootcamp[]
  totalCompleted: number
  totalInProgress: number
  totalPages: number
}

interface UseStudentReturn {
  completedBootcamps: StudentBootcamp[]
  inProgressBootcamps: StudentBootcamp[]
  totalCompleted: number
  totalInProgress: number
  totalPages: number
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useStudent(): UseStudentReturn {
  const [completedBootcamps, setCompletedBootcamps] = useState<StudentBootcamp[]>([])
  const [inProgressBootcamps, setInProgressBootcamps] = useState<StudentBootcamp[]>([])
  const [totalCompleted, setTotalCompleted] = useState<number>(0)
  const [totalInProgress, setTotalInProgress] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get<StudentApiResponse>('/student')

      setCompletedBootcamps(response.data.completedBootcamps)
      setInProgressBootcamps(response.data.inProgressBootcamps)
      setTotalCompleted(response.data.totalCompleted)
      setTotalInProgress(response.data.totalInProgress)
      setTotalPages(response.data.totalPages)
    } catch (err: any) {
      console.error('Error fetching student data:', err)
      setError(err?.response?.data?.message || 'Failed to fetch student data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentData()
  }, [])

  return {
    completedBootcamps,
    inProgressBootcamps,
    totalCompleted,
    totalInProgress,
    totalPages,
    loading,
    error,
    refetch: fetchStudentData,
  }
}
