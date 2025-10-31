'use client'

import { useState, useEffect } from 'react'
import { api } from '@/utils/axios.config'

export interface QuestionOption {
  id: number
  optionText: string
  questionId: number
  optionNumber: number
}

export interface EvaluationQuestion {
  id: number
  aiAssessmentId: number
  question: string
  topic: string
  difficulty: string
  options: QuestionOption[]
  selectedAnswerByStudent: number // This is now the option ID, not the option number
  language: string
  status: string | null
  explanation: string
  summary: string
  recommendations: string
  studentId: number
  createdAt: string
  updatedAt: string
}

export type AssessmentEvaluationApiResponse = EvaluationQuestion[]

interface UseAssessmentEvaluationParams {
  userId: number | null
  enabled?: boolean // Option to control when to fetch
  assessmentId: number
}

interface UseAssessmentEvaluationReturn {
  evaluations: EvaluationQuestion[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  totalEvaluations: number
}

export function useAssessmentEvaluation({ 
  userId, 
  assessmentId,
  enabled = true 
}: UseAssessmentEvaluationParams): UseAssessmentEvaluationReturn {
  const [evaluations, setEvaluations] = useState<EvaluationQuestion[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvaluations = async () => {
    if (!userId) {
      setError('User ID is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await api.get<AssessmentEvaluationApiResponse>(
        `/questions-by-llm/evaluation/${userId}/${assessmentId}`
      )

      setEvaluations(response.data)
    } catch (err: any) {
      console.error('Error fetching assessment evaluation:', err)
      setError(err?.response?.data?.message || 'Failed to fetch assessment evaluation')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (enabled && userId) {
      fetchEvaluations()
    }
  }, [userId, enabled])

  return {
    evaluations,
    loading,
    error,
    refetch: fetchEvaluations,
    totalEvaluations: evaluations.length,
  }
}
