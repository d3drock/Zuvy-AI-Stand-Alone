'use client';

import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionSidebarProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Set<number>;
  onQuestionSelect: (index: number) => void;
  className?: string;
}

export function QuestionSidebar({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  onQuestionSelect,
  className,
}: QuestionSidebarProps) {
  return (
    <div className={cn('bg-card border-r border-border', className)}>
      <div className="p-4 border-b border-border">
        <h3 className="font-heading text-body1 font-semibold text-foreground">
          Questions
        </h3>
        <p className="text-body2 text-muted-foreground mt-1">
          {answeredQuestions.size} of {totalQuestions} answered
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4 space-y-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const questionNumber = index + 1;
            const isAnswered = answeredQuestions.has(index);
            const isCurrent = currentQuestionIndex === index;

            return (
              <button
                key={index}
                onClick={() => onQuestionSelect(index)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-lg transition-all',
                  'hover:bg-accent hover:shadow-2dp',
                  isCurrent && 'bg-primary/10 border border-primary',
                  !isCurrent && !isAnswered && 'bg-muted/30',
                  !isCurrent && isAnswered && 'bg-success/10 border border-success/20'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0',
                    isCurrent && 'bg-primary text-primary-foreground',
                    !isCurrent && isAnswered && 'bg-success text-success-foreground',
                    !isCurrent && !isAnswered && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isAnswered ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-body2 font-semibold">{questionNumber}</span>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p
                    className={cn(
                      'text-body2 font-medium',
                      isCurrent ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    Question {questionNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAnswered ? 'Answered' : isCurrent ? 'Current' : 'Not answered'}
                  </p>
                </div>

                {isCurrent && (
                  <Circle className="h-2 w-2 fill-primary text-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
