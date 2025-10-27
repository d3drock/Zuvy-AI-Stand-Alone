'use client'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { QuizSubmission, Student, Quiz } from '@/types';

interface QuizModalViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: QuizSubmission;
  student: Student;
  quiz: Quiz;
}

export const QuizModalView = ({
  open,
  onOpenChange,
  submission,
  student,
  quiz
}: QuizModalViewProps) => {
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

  // Mock correct answers for demonstration
  const correctAnswers = {
    '1': 'Document Object Model',
    '2': 'document.getElementById()',
    '3': 'addEventListener()'
  };

  const isCorrectAnswer = (questionId: string, answer: string | string[]) => {
    const correct = correctAnswers[questionId as keyof typeof correctAnswers];
    if (Array.isArray(answer)) {
      return answer.includes(correct);
    }
    return answer === correct;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{quiz.title}</DialogTitle>
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

          {/* Questions and Answers */}
          <div className="space-y-6">
            {submission.answers.map((answer, index) => {
              const isCorrect = isCorrectAnswer(answer.questionId, answer.answer);

              return (
                <div key={answer.questionId} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <p className="text-base font-medium">What does DOM stand for?</p>
                    {isCorrect ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Correct
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                        Incorrect
                      </span>
                    )}
                  </div>

                  {/* Answer choices without card boundaries */}
                  <div className="space-y-2">
                    {['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Digital Output Mode'].map((choice, choiceIndex) => {
                      const isSelected = Array.isArray(answer.answer)
                        ? answer.answer.includes(choice)
                        : answer.answer === choice;
                      const isCorrectChoice = choice === correctAnswers[answer.questionId as keyof typeof correctAnswers];

                      let textColor = '';

                      if (isCorrectChoice) {
                        textColor = 'text-green-600 font-medium';
                      } else if (isSelected && !isCorrectChoice) {
                        textColor = 'text-red-600';
                      } else {
                        textColor = 'text-muted-foreground';
                      }

                      return (
                        <div key={choiceIndex} className="flex items-center gap-3 py-1">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? isCorrectChoice
                                ? 'border-green-600 bg-green-600'
                                : 'border-red-600 bg-red-600'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                          <span className={`text-sm ${textColor}`}>{choice}</span>
                        </div>
                      );
                    })}
                  </div>

                  {!isCorrect && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-green-800 font-medium text-sm">
                        Correct Answer: {correctAnswers[answer.questionId as keyof typeof correctAnswers]}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};