"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import "../../app/style.css";

import {
  useQuestionsByLLM,
  QuestionByLLM,
} from "@/lib/hooks/useQuestionsByLLM";
import { AdaptiveQuestion } from "@/types/adaptive-assessment";
import { api } from "@/utils/axios.config";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionDisplay } from "@/components/adaptive-assessment/QuestionDisplay";
import { QuestionSidebar } from "@/components/adaptive-assessment/QuestionSidebar";
import { ProgressIndicator } from "@/components/adaptive-assessment/ProgressIndicator";
import {
  AssessmentSession,
  QuestionSubmission,
} from "@/types/adaptive-assessment";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AssessmentSessionPageProps {
  sessionId: string;
}

// API Payload interfaces
interface AssessmentAnswerPayload {
  id: number;
  question: string;
  topic: string;
  difficulty: string;
  options: {
    id: number;
    questionId: number;
    optionText: string;
    optionNumber: number;
  }[];
  correctOption: number;
  selectedAnswerByStudent: {
    id: number;
    questionId: number;
    optionText: string;
    optionNumber: number;
  };
  language: string;
}

interface SubmitAssessmentPayload {
  answers: AssessmentAnswerPayload[];
  aiAssessmentId: number;
}

export default function AssessmentSessionPage({
  sessionId,
}: AssessmentSessionPageProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Session state
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    questions: apiQuestions,
    loading: questionLoading,
    error,
    refetch,
  } = useQuestionsByLLM({ sessionId });
  const [adaptiveQuestions, setAdaptiveQuestions] = useState<
    AdaptiveQuestion[]
  >([]);
  // Store mapping between question index and original API question
  const [questionMapping, setQuestionMapping] = useState<
    Map<number, QuestionByLLM>
  >(new Map());

  // Helper function to transform API questions to AdaptiveQuestion format
  const transformToAdaptiveQuestion = (
    llmQuestion: QuestionByLLM
  ): AdaptiveQuestion => {
    // Convert options array to QuestionOption format
    const optionsArray = llmQuestion.options.map((opt) => ({
      id: `option-${llmQuestion.id}-${opt.optionNumber}`,
      text: opt.optionText,
      isCorrect: opt.optionNumber === llmQuestion.correctOption.optionNumber,
      distractorRationale:
        opt.optionNumber !== llmQuestion.correctOption.optionNumber
          ? "This answer is incorrect. Please review the concept."
          : undefined,
    }));

    const correctOption = optionsArray.find((opt) => opt.isCorrect);

    // Map difficulty to numeric scale (1-10)
    const difficultyMap: {
      [key: string]: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    } = {
      "very easy": 2,
      easy: 3,
      basic: 4,
      medium: 5,
      intermediate: 5,
      advanced: 7,
      hard: 8,
      expert: 10,
    };

    return {
      id: `q-${llmQuestion.id}`,
      title: llmQuestion.topic,
      questionText: llmQuestion.question,
      questionType: "single-answer",
      options: optionsArray,
      correctAnswerIds: correctOption ? [correctOption.id] : [],
      difficulty: difficultyMap[llmQuestion.difficulty.toLowerCase()] || 5,
      topic: llmQuestion.topic,
      subtopic: llmQuestion.language,
      tags: [llmQuestion.language, llmQuestion.difficulty, llmQuestion.topic],
      explanation: `The correct answer is "${llmQuestion.correctOption.optionText}". This tests your understanding of ${llmQuestion.topic} in ${llmQuestion.language}.`,
      conceptTested: llmQuestion.topic,
      estimatedTime: 120, // 2 minutes default
      relatedResources: [],
      createdAt: llmQuestion.createdAt,
      updatedAt: llmQuestion.updatedAt,
      createdBy: "system",
      status: "active",
    };
  };

  // Transform API questions when they load
  useEffect(() => {
    if (apiQuestions && apiQuestions.length > 0) {
      const transformed = apiQuestions.map(transformToAdaptiveQuestion);
      setAdaptiveQuestions(transformed);

      // Create mapping for original questions
      const mapping = new Map<number, QuestionByLLM>();
      apiQuestions.forEach((q, index) => {
        mapping.set(index, q);
      });
      setQuestionMapping(mapping);
    }
  }, [apiQuestions]);

  // UI state
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, string[]>>(
    new Map()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Track which questions have been answered
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  // Initialize session
  useEffect(() => {
    if (adaptiveQuestions.length > 0) {
      // Create session with transformed questions
      const newSession: AssessmentSession = {
        id: sessionId,
        studentId: "student1",
        assessmentConfigId: "config1",
        status: "in-progress",
        currentQuestionIndex: 0,
        questions: adaptiveQuestions,
        submissions: [],
        currentDifficulty: 5,
        proficiencyEstimate: undefined,
        score: 0,
        totalQuestions: adaptiveQuestions.length,
        timeRemaining: 0, // Timer removed
        startTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSession(newSession);
      setLoading(false);
    }
  }, [sessionId, adaptiveQuestions]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const currentQuestion = session?.questions[session.currentQuestionIndex];
  const isLastQuestion =
    session && session.currentQuestionIndex === session.totalQuestions - 1;
  const currentQuestionAnswers =
    selectedAnswers.get(session?.currentQuestionIndex ?? -1) || [];

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion || !session) return;

    const currentIndex = session.currentQuestionIndex;

    if (currentQuestion.questionType === "single-answer") {
      setSelectedAnswers((prev) => new Map(prev).set(currentIndex, [optionId]));
    } else {
      // Multiple answer - toggle selection
      const current = selectedAnswers.get(currentIndex) || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setSelectedAnswers((prev) => new Map(prev).set(currentIndex, updated));
    }

    // Mark question as answered
    setAnsweredQuestions((prev) => new Set([...prev, currentIndex]));
  };

  // Handle submission of all answers
  const handleSubmitAssessment = async () => {
    if (!session) return;

    console.log("=== DEBUG: Starting submission ===");
    console.log("Selected Answers:", selectedAnswers);
    console.log("Question Mapping:", questionMapping);
    console.log("API Questions:", apiQuestions);

    // Validate that at least one question has been answered
    if (selectedAnswers.size === 0) {
      toast({
        title: "No Answers",
        description: "Please answer at least one question before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload for API - only include answered questions
      const answers: AssessmentAnswerPayload[] = Array.from(
        selectedAnswers.entries()
      )
        .filter(([_, selectedOptionIds]) => selectedOptionIds.length > 0) // Only answered questions
        .map(([questionIndex, selectedOptionIds]) => {
          console.log(
            `Processing question ${questionIndex}:`,
            selectedOptionIds
          );
          const originalQuestion = questionMapping.get(questionIndex);
          console.log("Original question:", originalQuestion);

          if (!originalQuestion) {
            console.warn(
              `No original question found for index ${questionIndex}`
            );
            return null;
          }

          // Extract the option number from the selected option ID (e.g., "option-67-2" -> 2)
          const selectedOptionNumber = parseInt(
            selectedOptionIds[0].split("-")[2]
          );
          console.log("Selected option number:", selectedOptionNumber);

          // Find the full option object for the selected option number
          const selectedOptionObj = originalQuestion.options.find(
            (opt) => opt.optionNumber === selectedOptionNumber
          );

          if (!selectedOptionObj) {
            console.warn(
              `Selected option object not found for question ${originalQuestion.id} option number ${selectedOptionNumber}`
            );
            return null;
          }

          const answer: AssessmentAnswerPayload = {
            id: originalQuestion.id,
            question: originalQuestion.question,
            topic: originalQuestion.topic,
            difficulty: originalQuestion.difficulty,
            options: originalQuestion.options,
            correctOption: originalQuestion.correctOption.optionNumber,
            selectedAnswerByStudent: selectedOptionObj,
            language: originalQuestion.language,
          };

          console.log("Prepared answer:", answer);

          return answer;
        })
        .filter((answer): answer is AssessmentAnswerPayload => answer !== null);

      const payload: SubmitAssessmentPayload = {
        answers,
        aiAssessmentId: +sessionId,
      };

      console.log("Final payload:", JSON.stringify(payload, null, 2));

      // Call the API
      const response = await api.post("/ai-assessment/submit", payload);

      console.log("Assessment submitted successfully:", response.data);

      // Update session with submissions
      const submissions: QuestionSubmission[] = [];
      let totalScore = 0;

      selectedAnswers.forEach((selectedOptionIds, questionIndex) => {
        const question = session.questions[questionIndex];
        if (!question) return;

        const correctAnswerIds = new Set(question.correctAnswerIds);
        const selectedAnswerIds = new Set(selectedOptionIds);

        const isCorrect =
          correctAnswerIds.size === selectedAnswerIds.size &&
          [...correctAnswerIds].every((id) => selectedAnswerIds.has(id));

        if (isCorrect) totalScore++;

        const submission: QuestionSubmission = {
          id: `sub-${Date.now()}-${questionIndex}`,
          sessionId: session.id,
          questionId: question.id,
          studentId: session.studentId,
          selectedOptionIds: selectedOptionIds,
          isCorrect,
          score: isCorrect ? 1 : 0,
          timeSpent: 60,
          submittedAt: new Date().toISOString(),
          clientTimestamp: new Date().toISOString(),
          syncStatus: "synced",
        };

        submissions.push(submission);
      });

      // Update session with all submissions
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          submissions: submissions,
          score: totalScore,
          status: "completed",
          completedAt: new Date().toISOString(),
        };
      });

      // Show success message
      toast({
        title: "Assessment Submitted",
        description: `You answered ${answeredQuestions.size} out of ${session.totalQuestions} questions.`,
        variant: "default",
      });

      setIsSubmitting(false);
      setShowSubmitDialog(false);

      // Navigate to results
      setTimeout(() => {
        router.push(
          `/student/studentAssessment/studentResults?assessmentId=${sessionId}`
        );
      }, 1000);
    } catch (error: any) {
      console.error("Error submitting assessment:", error);

      setIsSubmitting(false);

      // Show error message
      toast({
        title: "Submission Failed",
        description:
          error?.response?.data?.message ||
          "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle next question
  const handleNext = () => {
    if (!session) return;

    if (isLastQuestion) {
      // Move to next question or stay on last
      return;
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

  // Handle previous question
  const handlePrevious = () => {
    if (!session || session.currentQuestionIndex === 0) return;

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      };
    });
  };

  // Handle question navigation from sidebar
  const handleQuestionSelect = (index: number) => {
    if (!session) return;

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentQuestionIndex: index,
      };
    });
  };

  // Handle exit
  const handleExit = () => {
    router.push("/student");
  };

  if (loading || questionLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-body1 text-muted-foreground">
            {questionLoading ? "Loading questions..." : "Loading assessment..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-body1 text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={handleExit} className="mt-4">
            Go Back
          </Button>
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
                Question {session.currentQuestionIndex + 1} of{" "}
                {session.totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* <OfflineIndicator
              isOnline={isOnline}
              pendingSyncCount={pendingSyncCount}
            /> */}
            <ProgressIndicator
              current={answeredQuestions.size}
              total={session.totalQuestions}
            />
            <Button
              size="lg"
              onClick={() => setShowSubmitDialog(true)}
              disabled={answeredQuestions.size === 0 || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  {/* <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting... */}
                  <Dialog
                    open={isSubmitting}
                    onOpenChange={(val) => setIsSubmitting(val)}
                  >
                    <DialogContent className="max-w-lg">
                      {/* Visually hidden title for accessibility */}
                      <VisuallyHidden>
                        <DialogTitle>Reviewing Assessment</DialogTitle>
                      </VisuallyHidden>

                      <div className="flex flex-col items-center justify-center p-8">
                        <div className="doc-loader">
                          <div className="document">
                            <div className="doc-lines">
                              <div className="doc-line"></div>
                              <div className="doc-line"></div>
                              <div className="doc-line"></div>
                            </div>
                          </div>
                          <div className="sparkles">
                            <div className="sparkle"></div>
                            <div className="sparkle"></div>
                            <div className="sparkle"></div>
                            <div className="sparkle"></div>
                          </div>
                        </div>

                        <div className="pt-3 text-lg font-medium text-center">
                          Please wait. Your assessment is being reviewed
                          <span className="loading-dots"></span>
                        </div>
                      </div>

                      {/* Optional Footer — can be uncommented if needed */}
                      {/* <DialogFooter>
      <Button variant="outline" onClick={() => setIsSubmitting(false)}>
        Go Back
      </Button>
    </DialogFooter> */}
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  Submit Assessment
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
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
            <Card className="p-8">
              <QuestionDisplay
                question={currentQuestion}
                selectedOptionIds={currentQuestionAnswers}
                onOptionSelect={handleOptionSelect}
                questionNumber={session.currentQuestionIndex + 1}
                totalQuestions={session.totalQuestions}
                disabled={false}
              />

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={session.currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isLastQuestion ?? false}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Assessment Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assessment?</DialogTitle>
            <DialogDescription>
              You have answered {answeredQuestions.size} out of{" "}
              {session.totalQuestions} questions. Are you sure you want to
              submit your assessment?
              {answeredQuestions.size < session.totalQuestions && (
                <span className="block mt-2 text-amber-600 font-medium">
                  Warning: You have not answered all questions!
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Review Answers
            </Button>
            <Button onClick={handleSubmitAssessment} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
