'use client';

import { CheckCircle2, XCircle, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdaptiveQuestion, FeedbackData } from '@/types/adaptive-assessment';
import { cn } from '@/lib/utils';

interface FeedbackPanelProps {
  feedback: FeedbackData;
  question: AdaptiveQuestion;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function FeedbackPanel({
  feedback,
  question,
  onNext,
  isLastQuestion,
}: FeedbackPanelProps) {
  // Determine if answer is correct by comparing student answers with correct answers
  const isCorrect = feedback.studentAnswerIds.length === feedback.correctAnswerIds.length &&
    feedback.studentAnswerIds.every(id => feedback.correctAnswerIds.includes(id));

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <Card
        className={cn(
          'p-6 border-2',
          isCorrect
            ? 'bg-success/5 border-success'
            : 'bg-destructive/5 border-destructive'
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
              isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
            )}
          >
            {isCorrect ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-heading text-h5 font-semibold mb-2">
              {isCorrect ? 'Correct! Well done.' : 'Incorrect'}
            </h3>
            <p className="text-body1 text-muted-foreground">
              {feedback.encouragementMessage}
            </p>
          </div>
        </div>
      </Card>

      {/* Answer Comparison */}
      <Card className="p-6">
        <h4 className="font-heading text-body1 font-semibold mb-4">Your Answer</h4>

        <div className="space-y-4">
          {question.options.map((option) => {
            const isSelected = feedback.studentAnswerIds.includes(option.id);
            const isCorrectOption = feedback.correctAnswerIds.includes(option.id);

            if (!isSelected && !isCorrectOption) return null;

            return (
              <div
                key={option.id}
                className={cn(
                  'p-4 rounded-lg border-2',
                  isSelected && isCorrectOption && 'bg-success/10 border-success',
                  isSelected && !isCorrectOption && 'bg-destructive/10 border-destructive',
                  !isSelected && isCorrectOption && 'bg-primary/10 border-primary'
                )}
              >
                <div className="flex items-start gap-3">
                  <div>
                    {isSelected && isCorrectOption && (
                      <Badge className="bg-success">Your answer (Correct)</Badge>
                    )}
                    {isSelected && !isCorrectOption && (
                      <Badge className="bg-destructive">Your answer (Incorrect)</Badge>
                    )}
                    {!isSelected && isCorrectOption && (
                      <Badge className="bg-primary">Correct answer</Badge>
                    )}
                  </div>
                </div>

                <p className="text-body1 mt-3">{option.text}</p>

                {option.imageUrl && (
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className="mt-3 w-full h-auto rounded-md max-h-[200px] object-contain"
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Explanation Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h4 className="font-heading text-body1 font-semibold">Explanation</h4>
        </div>

        <div className="space-y-4">
          {/* Why correct answer is correct */}
          <div>
            <h5 className="text-body2 font-semibold text-foreground mb-2">
              Why this is correct:
            </h5>
            <p className="text-body1 text-muted-foreground leading-relaxed">
              {feedback.explanation}
            </p>
          </div>

          {/* Why wrong answers were tempting (if any) */}
          {!isCorrect && feedback.distractorExplanations.length > 0 && (
            <>
              <Separator />
              <div>
                <h5 className="text-body2 font-semibold text-foreground mb-2">
                  Common misconception:
                </h5>
                {feedback.distractorExplanations.map((explanation, index) => (
                  <p
                    key={index}
                    className="text-body1 text-muted-foreground leading-relaxed mb-2"
                  >
                    {explanation}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Concept being tested */}
          <Separator />
          <div>
            <h5 className="text-body2 font-semibold text-foreground mb-2">
              Concept tested:
            </h5>
            <p className="text-body1 text-muted-foreground">{question.conceptTested}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{question.topic}</Badge>
              {question.subtopic && (
                <Badge variant="outline">{question.subtopic}</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Related Resources */}
      {feedback.relatedResources && feedback.relatedResources.length > 0 && (
        <Card className="p-6">
          <h4 className="font-heading text-body1 font-semibold mb-4">
            Learn More
          </h4>
          <div className="space-y-3">
            {feedback.relatedResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-body2 font-medium text-foreground group-hover:text-primary transition-colors">
                      {resource.title}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {resource.type}
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={onNext} className="gap-2">
          {isLastQuestion ? 'Finish Assessment' : 'Next Question'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
