"use client";
import AssessmentSessionPage from '@/app/_components/AssessmentSessionPage'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {}

const Page = (props: Props) => {

  const param = useParams()
  const assessmentid =  param.assessmentId?.toString() || ''


  return (
    <div><AssessmentSessionPage sessionId={assessmentid} /></div>
  )
}

export default Page