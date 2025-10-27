'use client';

import { AdaptiveQuestion, QuestionOption } from '@/types/adaptive-assessment';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface QuestionDisplayProps {
  question: AdaptiveQuestion;
  selectedOptionIds: string[];
  onOptionSelect: (optionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
  disabled?: boolean;
}

export function QuestionDisplay({
  question,
  selectedOptionIds,
  onOptionSelect,
  questionNumber,
  totalQuestions,
  disabled = false,
}: QuestionDisplayProps) {
  const isSingleAnswer = question.questionType === 'single-answer';

  const handleOptionChange = (optionId: string) => {
    if (disabled) return;
    onOptionSelect(optionId);
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline" className="text-body2">
          Question {questionNumber} of {totalQuestions}
        </Badge>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-body2">
            {question.topic}
          </Badge>
          {question.subtopic && (
            <Badge variant="outline" className="text-body2">
              {question.subtopic}
            </Badge>
          )}
        </div>
      </div>

      {/* Question Image (if exists) */}
      {question.imageUrl && (
        <div className="w-full rounded-lg overflow-hidden mb-6">
          <img
            src={question.imageUrl}
            alt="Question"
            className="w-full h-auto object-contain max-h-[400px]"
          />
        </div>
      )}

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="font-heading text-h5 text-foreground mb-2">
          {question.title}
        </h2>
        <p className="text-body1 text-foreground whitespace-pre-wrap leading-relaxed">
          {question.questionText}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {isSingleAnswer ? (
          // Single Answer (Radio buttons)
          <RadioGroup
            value={selectedOptionIds[0] || ''}
            onValueChange={handleOptionChange}
            disabled={disabled}
          >
            {question.options.map((option) => (
              <Card
                key={option.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-4dp ${
                  selectedOptionIds.includes(option.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && handleOptionChange(option.id)}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="mt-1"
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={option.id}
                    className={`flex-1 cursor-pointer text-body1 ${
                      disabled ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    {option.imageUrl ? (
                      <div className="space-y-2">
                        <img
                          src={option.imageUrl}
                          alt={option.text}
                          className="w-full h-auto rounded-md max-h-[200px] object-contain"
                        />
                        {option.text && (
                          <p className="text-body2 text-muted-foreground">
                            {option.text}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span>{option.text}</span>
                    )}
                  </Label>
                </div>
              </Card>
            ))}
          </RadioGroup>
        ) : (
          // Multiple Answer (Checkboxes)
          <div className="space-y-4">
            {question.options.map((option) => (
              <Card
                key={option.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-4dp ${
                  selectedOptionIds.includes(option.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && handleOptionChange(option.id)}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptionIds.includes(option.id)}
                    onCheckedChange={() => handleOptionChange(option.id)}
                    className="mt-1"
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={option.id}
                    className={`flex-1 cursor-pointer text-body1 ${
                      disabled ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    {option.imageUrl ? (
                      <div className="space-y-2">
                        <img
                          src={option.imageUrl}
                          alt={option.text}
                          className="w-full h-auto rounded-md max-h-[200px] object-contain"
                        />
                        {option.text && (
                          <p className="text-body2 text-muted-foreground">
                            {option.text}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span>{option.text}</span>
                    )}
                  </Label>
                </div>
              </Card>
            ))}
            <p className="text-body2 text-muted-foreground italic">
              Select all that apply
            </p>
          </div>
        )}
      </div>

      {/* Estimated Time */}
      <div className="text-body2 text-muted-foreground text-right">
        Estimated time: {Math.ceil(question.estimatedTime / 60)} min
      </div>
    </div>
  );
}
