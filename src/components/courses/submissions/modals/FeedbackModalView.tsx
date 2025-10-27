'use client'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Star } from 'lucide-react';
import { FeedbackSubmission, Student, FeedbackForm } from '@/types';

interface FeedbackModalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: FeedbackSubmission;
  student: Student;
  feedbackForm: FeedbackForm;
}

export const FeedbackModalView = ({
  open,
  onOpenChange,
  submission,
  student,
  feedbackForm
}: FeedbackModalViewProps) => {
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

  // Comprehensive mock feedback data with all question types
  const mockFeedbackQuestions = [
    {
      id: '1',
      text: 'Describe your overall experience with this course',
      type: 'long_answer',
      answer: 'This course was incredibly comprehensive and well-structured. I particularly enjoyed the hands-on projects that allowed me to apply theoretical concepts in real-world scenarios. The instructor explanations were clear and the pacing was just right for my learning style. I would definitely recommend this course to others looking to advance their skills in this area.'
    },
    {
      id: '2',
      text: 'What\'s your preferred learning method?',
      type: 'short_answer',
      answer: 'Video tutorials with practice exercises'
    },
    {
      id: '3',
      text: 'When did you start your programming journey?',
      type: 'date',
      answer: '2020-03-15'
    },
    {
      id: '4',
      text: 'What time of day do you prefer studying?',
      type: 'time',
      answer: '09:30'
    },
    {
      id: '5',
      text: 'How would you rate the course difficulty? (1-10)',
      type: 'rating',
      answer: 8
    },
    {
      id: '6',
      text: 'Which topics were most helpful? (Select multiple)',
      type: 'multiple_choice',
      answer: ['React Hooks', 'State Management', 'API Integration'],
      options: ['React Hooks', 'Component Architecture', 'State Management', 'API Integration', 'Testing', 'Deployment']
    },
    {
      id: '7',
      text: 'How did you hear about this course?',
      type: 'single_choice',
      answer: 'Social Media',
      options: ['Search Engine', 'Social Media', 'Friend Recommendation', 'Email Newsletter', 'Online Advertisement']
    }
  ];

  const renderAnswer = (question: any) => {
    const { type, answer, options } = question;

    switch (type) {
      case 'long_answer':
        return (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <p className="text-sm text-blue-900 leading-relaxed">{answer}</p>
          </div>
        );

      case 'short_answer':
        return (
          <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-md inline-block">
            <p className="text-sm text-blue-900 font-medium">{answer}</p>
          </div>
        );

      case 'date':
        return (
          <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-md inline-block">
            <p className="text-sm text-blue-900 font-medium">
              {new Date(answer).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        );

      case 'time':
        return (
          <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-md inline-block">
            <p className="text-sm text-blue-900 font-medium">
              {new Date(`2000-01-01T${answer}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array(10).fill(0).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    i < answer
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-300'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold text-blue-600">{answer}/10</span>
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {options?.map((option: string, index: number) => {
              const isSelected = Array.isArray(answer) && answer.includes(option);
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 border-2 rounded ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  } flex items-center justify-center`}>
                    {isSelected && (
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case 'single_choice':
        return (
          <div className="space-y-2">
            {options?.map((option: string, index: number) => {
              const isSelected = answer === option;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  } flex items-center justify-center`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-sm ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        );

      default:
        return (
          <div className="text-sm text-blue-900">
            {String(answer)}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{feedbackForm.title}</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
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

          {/* Feedback Responses */}
          <div className="space-y-6">
            {mockFeedbackQuestions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <h4 className="text-base font-medium">{question.text}</h4>
                <div className="pl-4">
                  {renderAnswer(question)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};