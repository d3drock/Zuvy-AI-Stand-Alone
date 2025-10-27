'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { QuizSubmission, Student, Quiz } from '@/types';

interface QuizSubmissionViewProps {
  submission: QuizSubmission;
  student: Student;
  quiz: Quiz;
  onBack: () => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  image?: string;
}

// Mock questions data - in real app would come from props or API
const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What does DOM stand for?',
    options: [
      'Document Object Model',
      'Data Object Management',
      'Dynamic Object Method',
      'Document Oriented Markup'
    ],
    correctAnswer: 'Document Object Model'
  },
  {
    id: '2',
    question: 'Which method is used to select an element by ID?',
    options: [
      'document.getElement()',
      'document.getElementById()',
      'document.selectId()',
      'document.findById()'
    ],
    correctAnswer: 'document.getElementById()'
  },
  {
    id: '3',
    question: 'How do you add an event listener to an element?',
    options: [
      'element.addListener()',
      'element.addEventListener()',
      'element.on()',
      'element.bind()'
    ],
    correctAnswer: 'element.addEventListener()'
  }
];

export const QuizSubmissionView = ({
  submission,
  student,
  quiz,
  onBack
}: QuizSubmissionViewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStudentAnswer = (questionId: string) => {
    const answer = submission.answers.find(a => a.questionId === questionId);
    return Array.isArray(answer?.answer) ? answer.answer[0] : answer?.answer;
  };

  const isCorrectAnswer = (questionId: string) => {
    const question = mockQuizQuestions.find(q => q.id === questionId);
    const studentAnswer = getStudentAnswer(questionId);
    return question?.correctAnswer === studentAnswer;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submissions
        </Button>
      </div>

      {/* Quiz Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
      </div>

      {/* Student Info & Score */}
      <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
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
              <p className="text-sm text-muted-foreground">Final Score</p>
              <p className="text-2xl font-bold text-primary">
                {submission.score}/{submission.totalPossible}
              </p>
              <p className="text-sm text-muted-foreground">
                ({Math.round((submission.score / submission.totalPossible) * 100)}%)
              </p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quiz Answers</h3>

            {mockQuizQuestions.map((question, index) => {
              const studentAnswer = getStudentAnswer(question.id);
              const isCorrect = isCorrectAnswer(question.id);

              return (
                <Card key={question.id} className="bg-background">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-lg">
                        {index + 1}. {question.question}
                      </h4>
                      <Badge variant={isCorrect ? "default" : "destructive"} className="ml-4">
                        {isCorrect ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Incorrect
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isStudentChoice = studentAnswer === option;
                        const isCorrectOption = option === question.correctAnswer;

                        let className = "flex items-center gap-3 p-3 rounded-lg border";

                        if (isCorrectOption) {
                          className += " bg-success-light border-success text-success-dark";
                        } else if (isStudentChoice && !isCorrectOption) {
                          className += " bg-destructive-light border-destructive text-destructive-dark";
                        } else {
                          className += " bg-card border-border";
                        }

                        return (
                          <div key={optionIndex} className={className}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isStudentChoice ? 'border-current' : 'border-muted-foreground'
                            }`}>
                              {isStudentChoice && (
                                <div className={`w-2 h-2 rounded-full ${
                                  isCorrectOption ? 'bg-success' : 'bg-destructive'
                                }`} />
                              )}
                            </div>
                            <span className="flex-1">{option}</span>
                            {isCorrectOption && (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!isCorrect && (
                      <div className="mt-4 p-3 bg-success-light/50 border border-success/20 rounded-lg">
                        <p className="text-sm text-success-dark">
                          <strong>Correct Answer:</strong> {question.correctAnswer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
      </div>
    </div>
  );
};