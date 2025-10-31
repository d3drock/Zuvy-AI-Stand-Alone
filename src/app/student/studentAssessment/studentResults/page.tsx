"use client";
import AssessmentResultsPage from '@/app/_components/AssessmentResultPage'
import { useSearchParams } from 'next/navigation';
import React from 'react'

type Props = {}

const Page = (props: Props) => {

  const searchParams = useSearchParams();

  // Get specific query param
  const assessmentId = searchParams.get('assessmentId') || ''

  return (
    <div>
        <AssessmentResultsPage assessmentId={assessmentId} />
    </div>
  )
}

export default Page