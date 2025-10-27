'use client'

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, CheckSquare, Square, Star } from 'lucide-react';
import { FeedbackSubmission, Student, FeedbackForm } from '@/types';

interface FeedbackSubmissionViewProps {
  submission: FeedbackSubmission;
  student: Student;
  feedbackForm: FeedbackForm;
  onBack: () => void;
}

interface FeedbackQuestion {
  id: string;
  type: 'rating' | 'multiple_choice' | 'checkbox' | 'text' | 'textarea' | 'date';
  question: string;
  options?: string[];
}

// Mock questions data - in real app would come from props or API
const mockFeedbackQuestions: FeedbackQuestion[] = [
  {
    id: '1',
    type: 'rating',
    question: 'How would you rate the overall quality of this module?',
  },
  {
    id: '2',
    type: 'checkbox',
    question: 'Which topics were most helpful? (Select all that apply)',
    options: [
      'DOM Manipulation',
      'Event Handling',
      'Interactive Elements',
      'Performance Optimization'
    ]
  },
  {
    id: '3',
    type: 'textarea',
    question: 'What suggestions do you have for improving this module?',
  },
  {
    id: '4',
    type: 'date',
    question: 'When did you start this module?',
  }
];

export const FeedbackSubmissionView = ({
  submission,
  student,
  feedbackForm,
  onBack
}: FeedbackSubmissionViewProps) => {
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
    return answer?.answer;
  };

  const renderQuestion = (question: FeedbackQuestion, index: number) => {
    const studentAnswer = getStudentAnswer(question.id);

    switch (question.type) {
      case 'rating':
        const rating = typeof studentAnswer === 'number' ? studentAnswer : 3;
        return (
          <Card key={question.id} className="bg-background">
            <CardContent className="p-6">
              <h4 className="font-medium text-lg mb-4">
                {index + 1}. {question.question}
              </h4>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    className="flex items-center gap-1"
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        value <= rating ? 'border-primary bg-primary' : 'border-muted-foreground bg-transparent'
                      }`}
                    />
                    {value === 1 && <span className="text-sm text-muted-foreground">Excellent</span>}
                    {value === 5 && <span className="text-sm text-muted-foreground">Poor</span>}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Selected: {rating === 1 ? 'Excellent' : rating === 2 ? 'Good' : rating === 3 ? 'Average' : rating === 4 ? 'Poor' : 'Very Poor'}
              </div>
            </CardContent>
          </Card>
        );

      case 'multiple_choice':
        return (
          <Card key={question.id} className="bg-background">
            <CardContent className="p-6">
              <h4 className="font-medium text-lg mb-4">
                {index + 1}. {question.question}
              </h4>
              <div className="space-y-2">
                {question.options?.map((option) => {
                  const isSelected = studentAnswer === option;
                  return (
                    <div
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isSelected ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary' : 'border-muted-foreground'
                      }`}>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );

      case 'checkbox':
        const selectedOptions = Array.isArray(studentAnswer) ? studentAnswer : ['Event Handling', 'Interactive Elements'];
        return (
          <Card key={question.id} className="bg-background">
            <CardContent className="p-6">
              <h4 className="font-medium text-lg mb-4">
                {index + 1}. {question.question}
              </h4>
              <div className="space-y-2">
                {question.options?.map((option) => {
                  const isSelected = selectedOptions.includes(option);
                  return (
                    <div
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isSelected ? 'bg-primary/10 border-primary' : 'bg-card border-border'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="flex-1">{option}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );

      case 'text':
        return (
          <Card key={question.id} className="bg-background">
            <CardContent className="p-6">
              <h4 className="font-medium text-lg mb-4">
                {index + 1}. {question.question}
              </h4>
              <Input
                value={String(studentAnswer || '')}
                disabled
                className="bg-muted"
              />
            </CardContent>
          </Card>
        );

      case 'textarea':
        return (
          <Card key={question.id} className="bg-background">
            <CardContent className="p-6">
              <h4 className="font-medium text-lg mb-4">
                {index + 1}. {question.question}
              </h4>
              <Textarea
                value={String(studentAnswer || 'Improve it the way it is')}
                disabled
                className="bg-muted min-h-[100px]"
              />
            </CardContent>
          </Card>
        );

      case 'date':
        return (
          <Card key={question.id} className="bg-background">
            <CardContent className="p-6">
              <h4 className="font-medium text-lg mb-4">
                {index + 1}. {question.question}
              </h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  value="25 September 2025"
                  disabled
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
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

      {/* Feedback Form Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{feedbackForm.title}</h1>
      </div>

      {/* Student Info */}
      <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
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

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Feedback Responses</h3>
              <Badge variant="outline" className="text-success">
                Completed
              </Badge>
            </div>

            {mockFeedbackQuestions.map((question, index) =>
              renderQuestion(question, index)
            )}
          </div>
      </div>
    </div>
  );
};