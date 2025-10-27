'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, CheckCircle2, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAssessmentConfigs } from '@/types/mock-adaptive-data';
import { AssessmentSession } from '@/types/adaptive-assessment';
import { generateMockSession } from '@/types/mock-adaptive-data';

export default function StudentDashboard() {
  const router = useRouter();
  const [inProgressSessions] = useState<AssessmentSession[]>([
    // Mock in-progress session
    {
      ...generateMockSession('student1', 'config1', 'in-progress'),
      currentQuestionIndex: 7,
      score: 5,
      timeRemaining: 15 * 60, // 15 minutes remaining
    },
  ]);

  const availableAssessments = mockAssessmentConfigs;

  const handleStartAssessment = (configId: string) => {

    router.push(`/student/studentAssessment/1761558852599`);
  };

  const handleResumeSession = (sessionId: string) => {
    router.push(`/student/studentAssessment/1761558852599`);
  };

  const handleViewResults = (sessionId: string) => {
    router.push(`/student/results/${sessionId}`);
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
              <p className="text-body2 text-muted-foreground">In Progress</p>
              <p className="text-h5 font-semibold">{inProgressSessions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-body2 text-muted-foreground">Completed</p>
              <p className="text-h5 font-semibold">5</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-warning" />
            <div>
              <p className="text-body2 text-muted-foreground">Avg Score</p>
              <p className="text-h5 font-semibold">74%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-body2 text-muted-foreground">Proficiency</p>
              <p className="text-h5 font-semibold">Intermediate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="in-progress">
            In Progress
            {inProgressSessions.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {inProgressSessions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* In Progress */}
        <TabsContent value="in-progress">
          {inProgressSessions.length === 0 ? (
            <Card className="p-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-body1 font-semibold mb-2">
                No assessments in progress
              </h3>
              <p className="text-body2 text-muted-foreground">
                Start an assessment from the "Available" tab
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {inProgressSessions.map((session) => {
                const config = availableAssessments.find(
                  (c) => c.id === session.assessmentConfigId
                );
                const progress = getProgressPercentage(session);

                return (
                  <Card
                    key={session.id}
                    className="p-6 border-l-4 border-l-warning hover:shadow-8dp transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading text-body1 font-semibold">
                            {config?.title || 'Assessment'}
                          </h3>
                          <Badge className="bg-warning">In Progress</Badge>
                        </div>
                        <p className="text-body2 text-muted-foreground mb-3">
                          {config?.description}
                        </p>

                        {/* Progress */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Question {session.currentQuestionIndex + 1} of{' '}
                              {session.totalQuestions}
                            </span>
                            <span className="font-semibold">{progress}% complete</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-body2 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{getTimeRemaining(session.timeRemaining)} remaining</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              {session.score} / {session.currentQuestionIndex} correct
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleResumeSession(session.id)}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Resume
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Available Assessments */}
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableAssessments.map((assessment) => (
              <Card
                key={assessment.id}
                className="p-6 hover:shadow-8dp transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="font-heading text-body1 font-semibold mb-2">
                    {assessment.title}
                  </h3>
                  <p className="text-body2 text-muted-foreground line-clamp-2">
                    {assessment.description}
                  </p>
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {assessment.topics.map((topic) => (
                    <Badge key={topic} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Play className="h-4 w-4" />
                    <span>{assessment.totalQuestions} questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{assessment.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{assessment.passingScore}% to pass</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      {assessment.allowRetry ? 'Retry allowed' : 'One attempt'}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <Button
                  onClick={() => handleStartAssessment(assessment.id)}
                  className="w-full gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Assessment
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed */}
        <TabsContent value="completed">
          <Card className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-body1 font-semibold mb-2">
              No completed assessments yet
            </h3>
            <p className="text-body2 text-muted-foreground">
              Complete an assessment to see your results here
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
