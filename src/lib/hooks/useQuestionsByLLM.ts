'use client'

import { useState, useEffect } from 'react'
import { api } from '@/utils/axios.config'

export interface QuestionOption {
  [key: string]: string
}

export interface QuestionByLLM {
  id: number
  topic: string
  difficulty: string
  bootcampId: number | null
  question: string
  options: QuestionOption
  answer: number
  language: string
  createdAt: string
  updatedAt: string
}

export type QuestionsByLLMApiResponse = QuestionByLLM[]

interface UseQuestionsByLLMReturn {
  questions: QuestionByLLM[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  totalQuestions: number
}

export function useQuestionsByLLM(): UseQuestionsByLLMReturn {
  const [questions, setQuestions] = useState<QuestionByLLM[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get<QuestionsByLLMApiResponse>('/questions-by-llm')

      setQuestions(response.data)
    } catch (err: any) {
      console.error('Error fetching questions by LLM:', err)
      setError(err?.response?.data?.message || 'Failed to fetch questions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions,
    totalQuestions: questions.length,
  }
}
