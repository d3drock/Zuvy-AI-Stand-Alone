'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, CheckCircle2, AlertCircle, TrendingUp, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAssessmentConfigs } from '@/types/mock-adaptive-data';
import { AssessmentSession } from '@/types/adaptive-assessment';
import { generateMockSession } from '@/types/mock-adaptive-data';
import { useStudentAssessments } from '@/lib/hooks/useStudentAssessments'

export default function StudentDashboard() {
  const router = useRouter();
  const { assessments, loading, error, refetch } = useStudentAssessments()


  const [inProgressSessions] = useState<AssessmentSession[]>([
    // Mock in-progress session
    {
      ...generateMockSession('student1', 'config1', 'in-progress'),
      currentQuestionIndex: 7,
      score: 5,
      timeRemaining: 15 * 60, // 15 minutes remaining
    },
  ]);

  // Use API data for available assessments
  const availableAssessments = assessments || [];

  // Calculate total questions across all assessments
  const totalQuestions = availableAssessments.reduce(
    (sum, assessment) => sum + assessment.totalNumberOfQuestions, 
    0
  );

  // Get unique topics count
  const uniqueTopics = new Set(
    availableAssessments.flatMap((assessment) => 
      Object.keys(assessment.topics || {})
    )
  );


  const handleStartAssessment = (assessmentId: number) => {
    router.push(`/student/studentAssessment/${assessmentId}`);
  };



  const getTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProgressPercentage = (session: AssessmentSession) => {
    return Math.round((session.currentQuestionIndex / session.totalQuestions) * 100);
  };

  // console.log(assessments)


  return (
    <div className="w-full px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-h5 text-foreground mb-2">
          My Assessments
        </h1>
        <p className="text-body2 text-muted-foreground">
          Track your progress and continue learning
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <Play className="h-5 w-5 text-primary" />
            <div>
              <p className="text-body2 text-muted-foreground">Available</p>
              <p className="text-h5 font-semibold">{availableAssessments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="text-body2 text-muted-foreground">In Progress</p>
              <p className="text-h5 font-semibold">{inProgressSessions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-body2 text-muted-foreground">Total Questions</p>
              <p className="text-h5 font-semibold">{totalQuestions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-body2 text-muted-foreground">Topics Covered</p>
              <p className="text-h5 font-semibold">{uniqueTopics.size}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
     

   

         <div className="space-y-4">
  {loading ? (
    <Card className="p-12 text-center">
      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
      <h3 className="font-heading text-body1 font-semibold mb-2">
        Loading assessments...
      </h3>
      <p className="text-body2 text-muted-foreground">
        Please wait a moment.
      </p>
    </Card>
  ) : assessments?.length === 0 ? (
    <Card className="p-12 text-center">
      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-heading text-body1 font-semibold mb-2">
        No assessments available
      </h3>
      <p className="text-body2 text-muted-foreground">
        Please check back later.
      </p>
    </Card>
  ) : (
    assessments.map((assessment) => (
      <Card
        key={assessment.id}
        className="p-6 border-l-4 border-l-primary hover:shadow-8dp transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-heading text-body1 font-semibold">
                {assessment.title}
              </h3>
              <Badge className="bg-primary">Available</Badge>
            </div>

            <p className="text-body2 text-muted-foreground mb-3">
              {assessment.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-body2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{assessment.totalNumberOfQuestions} Questions</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Difficulty: {assessment.difficulty}</span>
              </div>
            </div>
          </div>

          <Button onClick={() => handleStartAssessment(assessment.id)} className="flex items-center justify-center">
            <span>Start Assessment</span>
            <Play className="h-2 w-2 mb-1 " />
          </Button>
        </div>
      </Card>
    ))
  )}
</div>



        {/* Completed */}
        {/* <TabsContent value="completed">
          <Card className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-body1 font-semibold mb-2">
              No completed assessments yet
            </h3>
            <p className="text-body2 text-muted-foreground">
              Complete an assessment to see your results here
            </p>
          </Card>
        </TabsContent> */}
     
    </div>
  );
}
