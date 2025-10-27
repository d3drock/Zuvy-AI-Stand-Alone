'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  Target,
  Brain,
  BookOpen,
  ArrowLeft,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface AssessmentResultsPageProps {
  sessionId: string;
}

export default function AssessmentResultsPage({ sessionId }: AssessmentResultsPageProps) {
  const router = useRouter();

  // Mock results data
  const results = {
    sessionId,
    assessmentTitle: 'JavaScript Fundamentals Assessment',
    studentName: 'John Doe',
    completedAt: '2025-01-25T10:30:00Z',
    totalQuestions: 15,
    correctAnswers: 11,
    score: 73,
    passingScore: 60,
    passed: true,
    timeSpent: 25 * 60, // 25 minutes
    proficiencyLevel: 'intermediate' as const,
    topicPerformance: [
      { topic: 'JavaScript', correct: 4, total: 5, accuracy: 80 },
      { topic: 'React', correct: 4, total: 5, accuracy: 80 },
      { topic: 'Data Structures', correct: 3, total: 5, accuracy: 60 },
    ],
    questionReview: [
      {
        questionNumber: 1,
        question: 'What keyword is used to declare a variable in JavaScript?',
        yourAnswer: 'let',
        correctAnswer: 'let',
        isCorrect: true,
        difficulty: 2,
        topic: 'JavaScript',
        timeSpent: 45,
      },
      {
        questionNumber: 2,
        question: 'What is the correct way to create a functional component in React?',
        yourAnswer: 'const MyComponent = <div>Hello</div>;',
        correctAnswer: 'function MyComponent() { return <div>Hello</div>; }',
        isCorrect: false,
        difficulty: 3,
        topic: 'React',
        explanation:
          'Functional components are JavaScript functions that return JSX. The function syntax is the standard way to create them.',
        timeSpent: 120,
      },
      // Add more questions...
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getProficiencyBadge = (level: string) => {
    switch (level) {
      case 'advanced':
        return <Badge className="bg-green-500">Advanced</Badge>;
      case 'intermediate':
        return <Badge className="bg-blue-500">Intermediate</Badge>;
      case 'basic':
        return <Badge className="bg-yellow-500">Basic</Badge>;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadReport = () => {
    console.log('Downloading report...');
    // Generate PDF report
  };

  return (
    <div className="w-full px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/student/dashboard')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-h5 text-foreground mb-2">
              Assessment Results
            </h1>
            <p className="text-body2 text-muted-foreground">
              {results.assessmentTitle}
            </p>
            <p className="text-body2 text-muted-foreground">
              Completed on {formatDate(results.completedAt)}
            </p>
          </div>
          <Button variant="outline" onClick={handleDownloadReport} className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Score Card */}
      <Card
        className={cn(
          'p-8 mb-8 border-l-4',
          results.passed ? 'border-l-success bg-success/5' : 'border-l-destructive bg-destructive/5'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center',
                results.passed
                  ? 'bg-success text-success-foreground'
                  : 'bg-destructive text-destructive-foreground'
              )}
            >
              {results.passed ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <XCircle className="h-8 w-8" />
              )}
            </div>
            <div>
              <h2 className="font-heading text-h5 font-semibold mb-1">
                {results.passed ? 'Congratulations! You Passed' : 'Not Passed'}
              </h2>
              <p className="text-body1 text-muted-foreground">
                {results.passed
                  ? 'Great job! Keep up the excellent work.'
                  : `You need ${results.passingScore}% to pass. Review and try again.`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className={cn('text-6xl font-bold', getScoreColor(results.score))}>
              {results.score}%
            </p>
            <p className="text-body2 text-muted-foreground mt-1">
              {results.correctAnswers} / {results.totalQuestions} correct
            </p>
          </div>
        </div>

        <Progress value={results.score} className="h-3 mb-4" />

        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Passing Score</p>
              <p className="text-body2 font-semibold">{results.passingScore}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Time Spent</p>
              <p className="text-body2 font-semibold">{formatTime(results.timeSpent)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Proficiency</p>
              <div className="mt-1">{getProficiencyBadge(results.proficiencyLevel)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Time/Question</p>
              <p className="text-body2 font-semibold">
                {Math.round(results.timeSpent / results.totalQuestions)}s
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
          <TabsTrigger value="review">Question Review</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-success/10 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-body2 text-muted-foreground">Correct</p>
                  <p className="text-h5 font-semibold">{results.correctAnswers}</p>
                </div>
              </div>
              <Progress
                value={(results.correctAnswers / results.totalQuestions) * 100}
                className="h-2"
              />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-body2 text-muted-foreground">Incorrect</p>
                  <p className="text-h5 font-semibold">
                    {results.totalQuestions - results.correctAnswers}
                  </p>
                </div>
              </div>
              <Progress
                value={
                  ((results.totalQuestions - results.correctAnswers) /
                    results.totalQuestions) *
                  100
                }
                className="h-2"
              />
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-body2 text-muted-foreground">Topics Covered</p>
                  <p className="text-h5 font-semibold">{results.topicPerformance.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-6 mt-6">
            <h3 className="font-heading text-body1 font-semibold mb-4">
              Recommendations
            </h3>
            <div className="space-y-3">
              {results.topicPerformance
                .filter((t) => t.accuracy < 70)
                .map((topic) => (
                  <div
                    key={topic.topic}
                    className="p-4 rounded-lg bg-warning/10 border border-warning/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-body2 mb-1">
                          Review {topic.topic}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You scored {topic.accuracy}% in this topic. Consider reviewing the
                          concepts and practicing more.
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Study Resources
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        {/* Topic Analysis */}
        <TabsContent value="topics">
          <div className="space-y-4">
            {results.topicPerformance.map((topic) => (
              <Card key={topic.topic} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-body1 font-semibold">{topic.topic}</h3>
                  <Badge
                    className={cn(
                      topic.accuracy >= 80
                        ? 'bg-success'
                        : topic.accuracy >= 60
                        ? 'bg-warning'
                        : 'bg-destructive'
                    )}
                  >
                    {topic.accuracy}% accuracy
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {topic.correct} / {topic.total} correct
                    </span>
                    <span className="font-semibold">{topic.accuracy}%</span>
                  </div>
                  <Progress value={topic.accuracy} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Question Review */}
        <TabsContent value="review">
          <Accordion type="single" collapsible className="w-full">
            {results.questionReview.map((q, index) => (
              <AccordionItem key={index} value={`question-${index}`}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                        q.isCorrect
                          ? 'bg-success text-success-foreground'
                          : 'bg-destructive text-destructive-foreground'
                      )}
                    >
                      {q.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-body2">
                        Question {q.questionNumber}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {q.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{q.topic}</Badge>
                      <Badge variant="secondary">Level {q.difficulty}</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-body1 font-medium mb-2">{q.question}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className={cn(
                        'p-3 rounded-lg border-2',
                        q.isCorrect
                          ? 'border-success bg-success/10'
                          : 'border-destructive bg-destructive/10'
                      )}>
                        <p className="text-xs text-muted-foreground mb-1">Your Answer</p>
                        <p className="text-body2">{q.yourAnswer}</p>
                      </div>

                      {!q.isCorrect && (
                        <div className="p-3 rounded-lg border-2 border-success bg-success/10">
                          <p className="text-xs text-muted-foreground mb-1">
                            Correct Answer
                          </p>
                          <p className="text-body2">{q.correctAnswer}</p>
                        </div>
                      )}
                    </div>

                    {!q.isCorrect && q.explanation && (
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm font-medium mb-2">Explanation:</p>
                        <p className="text-sm text-muted-foreground">{q.explanation}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Time spent: {formatTime(q.timeSpent)}</span>
                      <span>•</span>
                      <span>Difficulty: {q.difficulty}/10</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
