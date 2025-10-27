'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuestionDisplay } from '@/components/adaptive-assessment/QuestionDisplay';
import { QuestionSidebar } from '@/components/adaptive-assessment/QuestionSidebar';
import { TimerWidget } from '@/components/adaptive-assessment/TimerWidget';
import { ProgressIndicator } from '@/components/adaptive-assessment/ProgressIndicator';
import { OfflineIndicator } from '@/components/adaptive-assessment/OfflineIndicator';
import { FeedbackPanel } from '@/components/adaptive-assessment/FeedbackPanel';
import {
  AssessmentSession,
  QuestionSubmission,
  AssessmentUIState,
} from '@/types/adaptive-assessment';
import { generateMockSession } from '@/types/mock-adaptive-data';

interface AssessmentSessionPageProps {
  sessionId: string;
}

export default function AssessmentSessionPage({ sessionId }: AssessmentSessionPageProps) {
  const router = useRouter();

  // Session state
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [loading, setLoading] = useState(true);

  // UI state
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Track which questions have been answered
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Initialize session
  useEffect(() => {
    // In a real app, fetch session from API
    // For now, generate a mock session
    const mockSession = generateMockSession('student1', 'config1', 'in-progress');
    setSession(mockSession);
    setLoading(false);
  }, [sessionId]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentQuestion = session?.questions[session.currentQuestionIndex];
  const isLastQuestion = session && session.currentQuestionIndex === session.totalQuestions - 1;
  const canSubmit = selectedOptionIds.length > 0;

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;

    if (currentQuestion.questionType === 'single-answer') {
      setSelectedOptionIds([optionId]);
    } else {
      // Multiple answer - toggle selection
      setSelectedOptionIds((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    if (!session || !currentQuestion || !canSubmit) return;

    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if answer is correct
    const correctAnswerIds = new Set(currentQuestion.correctAnswerIds);
    const selectedAnswerIds = new Set(selectedOptionIds);

    const isCorrect =
      correctAnswerIds.size === selectedAnswerIds.size &&
      [...correctAnswerIds].every((id) => selectedAnswerIds.has(id));

    // Create submission
    const submission: QuestionSubmission = {
      id: `sub-${Date.now()}`,
      sessionId: session.id,
      questionId: currentQuestion.id,
      studentId: session.studentId,
      selectedOptionIds: selectedOptionIds,
      isCorrect,
      score: isCorrect ? 1 : 0,
      timeSpent: 60, // TODO: Calculate actual time spent
      submittedAt: new Date().toISOString(),
      clientTimestamp: new Date().toISOString(),
      syncStatus: 'synced',
    };

    // Prepare feedback
    const feedback = {
      isCorrect,
      studentAnswerIds: selectedOptionIds,
      correctAnswerIds: currentQuestion.correctAnswerIds,
      explanation: currentQuestion.explanation,
      distractorExplanations: currentQuestion.options
        .filter((opt) => !opt.isCorrect && selectedOptionIds.includes(opt.id))
        .map((opt) => opt.distractorRationale || 'This answer is incorrect.')
        .filter(Boolean),
      relatedResources: currentQuestion.relatedResources,
      encouragementMessage: isCorrect
        ? 'Great job! You got it right.'
        : 'Don\'t worry, let\'s learn from this mistake.',
    };

    setCurrentFeedback(feedback);

    // Update session
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        submissions: [...prev.submissions, submission],
        score: prev.score + (isCorrect ? 1 : 0),
      };
    });

    // Mark question as answered
    setAnsweredQuestions((prev) => new Set([...prev, session.currentQuestionIndex]));

    // Show feedback
    setShowFeedback(true);
    setIsSubmitting(false);
  };

  // Handle next question
  const handleNext = () => {
    if (!session) return;

    setShowFeedback(false);
    setCurrentFeedback(null);
    setSelectedOptionIds([]);

    if (isLastQuestion) {
      // Complete assessment
      setShowSubmitDialog(true);
    } else {
      // Move to next question
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      });
    }
  };

  // Handle question navigation from sidebar
  const handleQuestionSelect = (index: number) => {
    if (!session || showFeedback) return; // Don't allow navigation during feedback

    setSelectedOptionIds([]);
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentQuestionIndex: index,
      };
    });
  };

  // Handle time up
  const handleTimeUp = () => {
    setShowSubmitDialog(true);
  };

  // Handle final submission
  const handleFinalSubmit = () => {
    // In real app, submit to API and navigate to results
    router.push(`/student/assessment/${sessionId}/results`);
  };

  // Handle exit
  const handleExit = () => {
    router.push('/student/dashboard');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-body1 text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!session || !currentQuestion) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-body1 text-destructive">Assessment not found</p>
          <Button variant="outline" onClick={handleExit} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit
            </Button>
            <div>
              <h1 className="font-heading text-body1 font-semibold text-foreground">
                Assessment Session
              </h1>
              <p className="text-body2 text-muted-foreground">
                Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <OfflineIndicator
              isOnline={isOnline}
              pendingSyncCount={pendingSyncCount}
            />
            <TimerWidget
              timeRemaining={session.timeRemaining}
              onTimeUp={handleTimeUp}
            />
            <ProgressIndicator
              current={answeredQuestions.size}
              total={session.totalQuestions}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <QuestionSidebar
          totalQuestions={session.totalQuestions}
          currentQuestionIndex={session.currentQuestionIndex}
          answeredQuestions={answeredQuestions}
          onQuestionSelect={handleQuestionSelect}
          className="w-64 flex-shrink-0"
        />

        {/* Question Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            {!showFeedback ? (
              <Card className="p-8">
                <QuestionDisplay
                  question={currentQuestion}
                  selectedOptionIds={selectedOptionIds}
                  onOptionSelect={handleOptionSelect}
                  questionNumber={session.currentQuestionIndex + 1}
                  totalQuestions={session.totalQuestions}
                  disabled={showFeedback}
                />

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Answer
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ) : (
              <FeedbackPanel
                feedback={currentFeedback}
                question={currentQuestion}
                onNext={handleNext}
                isLastQuestion={isLastQuestion}
              />
            )}
          </div>
        </div>
      </div>

      {/* Submit Assessment Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assessment?</DialogTitle>
            <DialogDescription>
              You have answered {answeredQuestions.size} out of {session.totalQuestions}{' '}
              questions. Are you sure you want to submit your assessment?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Review Answers
            </Button>
            <Button onClick={handleFinalSubmit}>Submit Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
