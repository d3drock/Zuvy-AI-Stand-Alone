"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/axios.config";

export interface AiAssessment {
  id: number;
  title: string;
  description: string | null;
  bootcampId: number | null;
  audience: string | null;
  difficulty: string | null;
  topics: {
    topic: string;
    count: number;
  }[];
  // questions?: any[]
  createdAt: string;
  updatedAt: string;
}

interface UseAiAssessmentReturn {
  assessment: AiAssessment[] | null;
  setBootcampId: (bootcampId: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAiAssessment(): UseAiAssessmentReturn {
  const [assessment, setAssessment] = useState<AiAssessment[] | null>(null);
  const [bootcampId, setBootcampId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessment = useCallback(async () => {
    if (!bootcampId) return;
    try {
      setLoading(true);
      setError(null);
      // const url = `/ai-assessment?bootcampId=${encodeURIComponent(String(bootcampId))}`
      const res = await api.get(
        `/ai-assessment?bootcampId=${encodeURIComponent(String(bootcampId))}`
      );
      console.log("Fetched AI assessment:", res.data);
      setAssessment(res.data);
    } catch (err: any) {
      console.error("Error fetching AI assessment:", err);
      setError(err?.response?.data?.message || "Failed to fetch AI assessment");
      setAssessment(null);
    } finally {
      setLoading(false);
    }
  }, [bootcampId]);

  useEffect(() => {
    if (bootcampId) fetchAssessment();
  }, [bootcampId, fetchAssessment]);

  return {
    assessment,
    setBootcampId,
    loading,
    error,
    refetch: fetchAssessment,
  };
}
