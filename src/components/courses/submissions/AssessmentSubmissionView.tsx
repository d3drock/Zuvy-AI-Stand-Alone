'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  ArrowLeft,
  Clock,
  Code,
  CheckSquare,
  FileText,
  Eye,
  AlertTriangle,
  Monitor,
  Copy,
  Trophy,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { AssessmentSubmission, Student, Assessment } from '@/types';

interface AssessmentSubmissionViewProps {
  submission: AssessmentSubmission;
  student: Student;
  assessment: Assessment;
  onBack: () => void;
}

interface QuestionCard {
  id: string;
  type: 'coding' | 'mcq' | 'open_ended';
  title: string;
  score: number;
  maxScore: number;
}

// Mock question data
const mockQuestions: QuestionCard[] = [
  { id: '1', type: 'coding', title: 'Maximum Subarray Sum', score: 8, maxScore: 10 },
  { id: '2', type: 'coding', title: 'Binary Tree Traversal', score: 9, maxScore: 10 },
  { id: '3', type: 'mcq', title: 'Data Structures Knowledge', score: 7, maxScore: 10 },
  { id: '4', type: 'mcq', title: 'Algorithm Complexity', score: 9, maxScore: 10 },
  { id: '5', type: 'open_ended', title: 'System Design Questions', score: 8, maxScore: 10 },
  { id: '6', type: 'open_ended', title: 'Programming Concepts', score: 6, maxScore: 10 }
];

// Mock quiz data with multiple questions
const mockQuizQuestions = [
  {
    id: '1',
    question: 'What does DOM stand for?',
    userAnswer: 'Dynamic Object Method',
    correctAnswer: 'Document Object Model',
    options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Document Oriented Markup'],
    isCorrect: false
  },
  {
    id: '2',
    question: 'Which method is used to select an element by ID?',
    userAnswer: 'document.getElementById()',
    correctAnswer: 'document.getElementById()',
    options: ['document.getElement()', 'document.getElementById()', 'document.selectId()', 'document.findById()'],
    isCorrect: true
  },
  {
    id: '3',
    question: 'How do you add an event listener to an element?',
    userAnswer: 'element.addEventListener()',
    correctAnswer: 'element.addEventListener()',
    options: ['element.addListener()', 'element.addEventListener()', 'element.on()', 'element.bind()'],
    isCorrect: true
  }
];

// Mock open ended questions
const mockOpenEndedQuestions = [
  {
    id: '1',
    question: 'Explain the concept of closures in JavaScript.',
    answer: 'A closure is a function that has access to variables in its outer scope even after the outer function has returned. This creates a persistent scope that can be used for data privacy and creating function factories.'
  },
  {
    id: '2',
    question: 'What are the benefits of using async/await over promises?',
    answer: 'Async/await provides cleaner, more readable code that looks synchronous while being asynchronous. It eliminates callback hell and makes error handling easier with try/catch blocks.'
  },
  {
    id: '3',
    question: 'Describe how you would optimize a React application for performance.',
    answer: 'I would use React.memo for component memoization, useMemo and useCallback for expensive computations, implement code splitting with lazy loading, optimize bundle size, and use profiling tools to identify bottlenecks.'
  }
];

// Mock coding problem test results
const mockTestResults = [
  {
    testCase: 1,
    status: 'passed',
    input: '[2, -1, 2, 3, 4, -5]',
    expectedOutput: '10',
    actualOutput: '10',
    executionTime: '12ms',
    memoryUsage: '8.2KB'
  },
  {
    testCase: 2,
    status: 'passed',
    input: '[-1, -2, -3, -4]',
    expectedOutput: '-1',
    actualOutput: '-1',
    executionTime: '8ms',
    memoryUsage: '7.8KB'
  },
  {
    testCase: 3,
    status: 'passed',
    input: '[5, 4, -1, 7, 8]',
    expectedOutput: '23',
    actualOutput: '23',
    executionTime: '15ms',
    memoryUsage: '9.1KB'
  },
  {
    testCase: 4,
    status: 'failed',
    input: '[-1]',
    expectedOutput: '-1',
    actualOutput: '0',
    executionTime: '10ms',
    memoryUsage: '7.5KB'
  }
];

export const AssessmentSubmissionView = ({
  submission,
  student,
  assessment,
  onBack
}: AssessmentSubmissionViewProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionCard | null>(null);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [codingModalOpen, setCodingModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [openEndedModalOpen, setOpenEndedModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate section scores
  const codingQuestions = mockQuestions.filter(q => q.type === 'coding');
  const mcqQuestions = mockQuestions.filter(q => q.type === 'mcq');
  const openEndedQuestions = mockQuestions.filter(q => q.type === 'open_ended');

  const codingScore = codingQuestions.reduce((sum, q) => sum + q.score, 0);
  const codingMaxScore = codingQuestions.reduce((sum, q) => sum + q.maxScore, 0);
  const mcqScore = mcqQuestions.reduce((sum, q) => sum + q.score, 0);
  const mcqMaxScore = mcqQuestions.reduce((sum, q) => sum + q.maxScore, 0);
  const openEndedScore = openEndedQuestions.reduce((sum, q) => sum + q.score, 0);
  const openEndedMaxScore = openEndedQuestions.reduce((sum, q) => sum + q.maxScore, 0);

  const handleViewQuestion = (question: QuestionCard) => {
    setSelectedQuestion(question);
    setQuestionDialogOpen(true);
  };

  const renderQuestionContent = (question: QuestionCard) => {
    switch (question.type) {
      case 'coding':
        return (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-600">Test Cases</span>
                  </div>
                  <p className="text-lg font-bold text-orange-700">3/6</p>
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">Partial</Badge>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Monitor className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Memory Usage</span>
                  </div>
                  <p className="text-lg font-bold text-blue-700">142.5 KB</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Execution Time</span>
                  </div>
                  <p className="text-lg font-bold text-green-700">0.45ms</p>
                </CardContent>
              </Card>
            </div>

            {/* Solution */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Your Solution
                <Badge variant="outline" className="bg-orange-100 text-orange-700">JavaScript</Badge>
                <Button variant="ghost" size="sm" className="ml-auto">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </h4>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg">
                <pre className="text-sm">
                  <code>{`*color: #569CD6;">function maxSubarraySum(nums) {
  *color: #569CD6;">let maxSum = nums[*color: #B5CEA8;">0];
  *color: #569CD6;">let currentSum = nums[*color: #B5CEA8;">0];

  *color: #569CD6;">for (*color: #569CD6;">let i = *color: #B5CEA8;">1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  *color: #569CD6;">return maxSum;
}`}</code>
                </pre>
              </div>
            </div>

            {/* Test Results */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Test Results</h4>
              <div className="space-y-3">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-700">Test Case 3</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700">PASSED</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Input</p>
                        <p className="font-mono">[5, 4, -1, 7, 8]</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Expected Output</p>
                        <p className="font-mono">23</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Your Output</p>
                        <p className="font-mono text-green-600">23</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>⏱ 127 ms</span>
                      <span>📊 8.26 KB</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-700">Test Case 4</span>
                      </div>
                      <Badge className="bg-red-100 text-red-700">FAILED</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground mb-1">Input</p>
                        <p className="font-mono">[-1]</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Expected Output</p>
                        <p className="font-mono">-1</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Your Output</p>
                        <p className="font-mono text-red-600">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'mcq':
        return (
          <div className="space-y-6">
            {mockQuizQuestions.map((q, index) => (
              <div key={q.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-base">{index + 1}. {q.question}</h4>
                  {q.isCorrect ? (
                    <Badge className="bg-green-100 text-green-700 border-green-300">Correct</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-red-300">Incorrect</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  {q.options.map((option, optionIndex) => {
                    const isUserSelected = option === q.userAnswer;
                    const isCorrect = option === q.correctAnswer;

                    let textColor = '';

                    if (isCorrect) {
                      textColor = 'text-green-800';
                    } else if (isUserSelected && !isCorrect) {
                      textColor = 'text-red-800';
                    }

                    return (
                      <div key={optionIndex} className="flex items-center gap-3 py-1">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          isUserSelected
                            ? (isCorrect ? 'border-green-600 bg-green-600' : 'border-red-600 bg-red-600')
                            : isCorrect
                            ? 'border-green-600 bg-green-600'
                            : 'border-gray-400'
                        }`} />
                        <span className={`${textColor} ${isCorrect ? 'font-medium' : ''}`}>
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {!q.isCorrect && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">
                      Correct Answer: {q.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'open_ended':
        return (
          <div className="space-y-6">
            {mockOpenEndedQuestions.map((q, index) => (
              <div key={q.id} className="space-y-3">
                <h4 className="font-semibold text-base">{index + 1}. {q.question}</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {q.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <p>Question content not available</p>;
    }
  };

  const renderSection = (questions: QuestionCard[], title: string, icon: React.ReactNode) => {
    if (questions.length === 0) return null;

    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="outline">
            {questions.length} question{questions.length > 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questions.map((question) => (
            <Card key={question.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="mb-4">
                  <h4 className="text-base font-bold mb-1">{question.title}</h4>
                  {question.type !== 'open_ended' && (
                    <p className="text-sm text-muted-foreground">
                      Score: {question.score}/{question.maxScore}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewQuestion(question)}
                  className="w-full"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Answer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 pt-12 pb-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="mt-4">
          <Button variant="link" size="sm" onClick={onBack} className="p-0 h-auto font-normal">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Submissions
          </Button>
        </div>

        {/* Assessment Title */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-left">{assessment.title}</h1>
        </div>
      </div>

      {/* Student Info & Time Taken */}
      <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={(student as any).avatarUrl} alt={student.name} />
                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{student.name}</h2>
                <p className="text-muted-foreground">
                  Submitted on {formatDate(submission.submissionDate)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Time Taken</span>
              </div>
              <p className="text-base font-bold">{formatDuration(submission.timeTaken)}</p>
            </div>
          </div>

          {/* Score Card */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Score Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Total Score */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground mb-1">Total Score</p>
                    <p className="text-2xl font-bold text-primary">
                      {submission.percentageObtained}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {submission.score}/{submission.totalPossible} points
                    </p>
                  </CardContent>
                </Card>

                {/* Coding Problems Score */}
                {codingQuestions.length > 0 && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Code className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">Coding Problems</p>
                      <p className="text-xl font-bold">
                        {Math.round((codingScore / codingMaxScore) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {codingScore}/{codingMaxScore} points
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* MCQ Score */}
                {mcqQuestions.length > 0 && (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckSquare className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">MCQs</p>
                      <p className="text-xl font-bold">
                        {Math.round((mcqScore / mcqMaxScore) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {mcqScore}/{mcqMaxScore} points
                      </p>
                    </CardContent>
                  </Card>
                )}

              </div>
            </div>

            {/* Proctoring Report */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Proctoring Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4 text-center">
                    <Copy className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
                    <p className="text-xl font-bold text-yellow-700">3</p>
                    <p className="text-sm text-yellow-600">Copy/Paste Events</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4 text-center">
                    <Monitor className="h-5 w-5 mx-auto mb-2 text-orange-600" />
                    <p className="text-xl font-bold text-orange-700">7</p>
                    <p className="text-sm text-orange-600">Tab Changes</p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-red-600" />
                    <p className="text-xl font-bold text-red-700">2</p>
                    <p className="text-sm text-red-600">Full Screen Exits</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Question Sections */}
            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Question Breakdown</h3>

              {renderSection(
                codingQuestions,
                'Coding Problems',
                <Code className="h-5 w-5 text-primary" />
              )}

              {renderSection(
                mcqQuestions,
                'Multiple Choice Questions',
                <CheckSquare className="h-5 w-5 text-primary" />
              )}

              {renderSection(
                openEndedQuestions,
                'Open Ended Questions',
                <FileText className="h-5 w-5 text-primary" />
              )}
            </div>
          </div>
      </div>

      {/* Question Detail Dialog */}
      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedQuestion?.type === 'coding' && <Code className="h-5 w-5" />}
              {selectedQuestion?.type === 'mcq' && <CheckSquare className="h-5 w-5" />}
              {selectedQuestion?.type === 'open_ended' && <FileText className="h-5 w-5" />}
              {selectedQuestion?.title}
            </DialogTitle>
            {selectedQuestion?.type !== 'open_ended' && (
              <DialogDescription>
                Score: {selectedQuestion?.score}/{selectedQuestion?.maxScore} points
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="py-4">
            {selectedQuestion && renderQuestionContent(selectedQuestion)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};