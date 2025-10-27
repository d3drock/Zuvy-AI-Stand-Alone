'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useUnsavedChanges } from '../curriculum/useUnsavedChanges';
import { UnsavedChangesModal } from '../curriculum/UnsavedChangesModal';
import type { FeedbackFormData, FeedbackQuestion } from '../curriculum/types';

interface FeedbackFormEditorProps {
  initialData?: FeedbackFormData;
  onSave: (data: FeedbackFormData) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const createDefaultFeedbackFormData = (): FeedbackFormData => ({
  id: `feedback-${Date.now()}`,
  type: 'feedback-form',
  title: '',
  description: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'draft',
  questions: [
    {
      id: 'question-1',
      questionType: 'short-text',
      questionText: '',
      required: true,
      ratingScale: {
        min: 1,
        max: 10,
        minLabel: '',
        midLabel: '',
        maxLabel: ''
      }
    }
  ]
});

/**
 * FeedbackFormEditor
 *
 * Editor component for creating and editing feedback forms.
 * Supports various question types including rating, multiple choice, and text inputs.
 */
export function FeedbackFormEditor({
  initialData,
  onSave,
  onCancel,
  mode
}: FeedbackFormEditorProps) {
  const [feedbackFormData, setFeedbackFormData] = useState<FeedbackFormData>(
    initialData || createDefaultFeedbackFormData()
  );

  const unsavedChanges = useUnsavedChanges();

  // Handle input changes
  const handleInputChange = (field: keyof FeedbackFormData, value: any) => {
    setFeedbackFormData(prev => ({ ...prev, [field]: value }));
    unsavedChanges.markAsUnsaved();
  };

  // Watch for data changes to mark as unsaved
  useEffect(() => {
    const hasChanges = JSON.stringify(feedbackFormData) !== JSON.stringify(initialData);
    if (hasChanges) {
      unsavedChanges.markAsUnsaved();
    }
  }, [feedbackFormData, initialData, unsavedChanges]);

  const questionTypes: { value: FeedbackQuestion['questionType']; label: string }[] = [
    { value: 'short-text', label: 'Short Text' },
    { value: 'long-text', label: 'Long Text' },
    { value: 'rating', label: 'Rating' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'single-choice', label: 'Single Choice' }
  ];

  const addQuestion = () => {
    const newQuestion: FeedbackQuestion = {
      id: `question-${Date.now()}`,
      questionType: 'short-text',
      questionText: '',
      required: true,
      options: [],
      ratingScale: {
        min: 1,
        max: 10,
        minLabel: '',
        midLabel: '',
        maxLabel: ''
      }
    };

    const updatedQuestions = [...(feedbackFormData.questions || []), newQuestion];
    handleInputChange('questions', updatedQuestions);
  };

  const updateQuestion = (id: string, field: keyof FeedbackQuestion, value: any) => {
    const updatedQuestions = (feedbackFormData.questions || []).map(q =>
      q.id === id ? { ...q, [field]: value } : q
    );
    handleInputChange('questions', updatedQuestions);
  };

  const removeQuestion = (id: string) => {
    const updatedQuestions = (feedbackFormData.questions || []).filter(q => q.id !== id);
    handleInputChange('questions', updatedQuestions);
  };

  const addOption = (questionId: string) => {
    const updatedQuestions = (feedbackFormData.questions || []).map(q =>
      q.id === questionId
        ? { ...q, options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`] }
        : q
    );
    handleInputChange('questions', updatedQuestions);
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const updatedQuestions = (feedbackFormData.questions || []).map(q =>
      q.id === questionId
        ? {
            ...q,
            options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt)
          }
        : q
    );
    handleInputChange('questions', updatedQuestions);
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const updatedQuestions = (feedbackFormData.questions || []).map(q =>
      q.id === questionId
        ? {
            ...q,
            options: q.options?.filter((_, idx) => idx !== optionIndex)
          }
        : q
    );
    handleInputChange('questions', updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      onSave(feedbackFormData);
      unsavedChanges.markAsSaved();
    } catch (error) {
      console.error('Error saving feedback form:', error);
    }
  };

  // Handle cancel with unsaved changes check
  const handleCancel = () => {
    if (unsavedChanges.hasUnsavedChanges) {
      unsavedChanges.attemptAction(onCancel);
    } else {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {/* Title - Underlined style as per design specs */}
            <div className="space-y-3">
              <input
                type="text"
                value={feedbackFormData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Feedback Form Title"
                className="text-xl font-semibold bg-transparent border-none outline-none border-b-2 border-border focus:border-primary transition-colors w-full pb-1"
                style={{ fontSize: '1.25rem' }} // h5 size as per specs
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Questions ({feedbackFormData.questions?.length || 0})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addQuestion}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-6">
                {(feedbackFormData.questions || []).map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">Question {index + 1}</span>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                              className="text-destructive hover:text-destructive-dark"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Question Type and Required Toggle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="font-semibold">Question Type</Label>
                            <Select
                              value={question.questionType}
                              onValueChange={(value) => updateQuestion(question.id, 'questionType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                              <SelectContent>
                                {questionTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold">Required</Label>
                              <Switch
                                checked={question.required}
                                onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-2">
                          <Label className="font-semibold">Question Text</Label>
                          <Textarea
                            value={question.questionText}
                            onChange={(e) => updateQuestion(question.id, 'questionText', e.target.value)}
                            placeholder="Enter question text"
                            rows={3}
                          />
                        </div>

                        {/* Multiple/Single Choice Options */}
                        {(question.questionType === 'multiple-choice' || question.questionType === 'single-choice') && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-semibold">Answer Options</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(question.id)}
                              >
                                <PlusCircle className="mr-2 h-3 w-3" />
                                Add Option
                              </Button>
                            </div>

                            {question.options && question.options.length > 0 ? (
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-3">
                                    <div className="w-6 flex justify-center">
                                      {question.questionType === 'multiple-choice' ? (
                                        <div className="h-4 w-4 border-2 border-gray-300 rounded" />
                                      ) : (
                                        <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                                      )}
                                    </div>
                                    <Input
                                      value={option}
                                      onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                      placeholder={`Option ${optionIndex + 1}`}
                                      className="flex-1"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeOption(question.id, optionIndex)}
                                      className="text-destructive hover:text-destructive-dark"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-3 text-sm text-muted-foreground border rounded">
                                No options added yet
                              </div>
                            )}
                          </div>
                        )}

                        {/* Rating Scale Configuration */}
                        {question.questionType === 'rating' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="font-semibold">Rating Scale (1 to 10 default)</Label>
                              <p className="text-sm text-muted-foreground">
                                Rating will be from 1 to 10. You can add labels for 1, 5, and 10.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label className="font-semibold">Label for 1 (Lowest)</Label>
                                <Input
                                  value={question.ratingScale?.minLabel || ''}
                                  onChange={(e) =>
                                    updateQuestion(question.id, 'ratingScale', {
                                      min: 1,
                                      max: 10,
                                      minLabel: e.target.value,
                                      midLabel: question.ratingScale?.midLabel || '',
                                      maxLabel: question.ratingScale?.maxLabel || ''
                                    })
                                  }
                                  placeholder="e.g., Poor, Never, Strongly Disagree"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="font-semibold">Label for 5 (Middle)</Label>
                                <Input
                                  value={question.ratingScale?.midLabel || ''}
                                  onChange={(e) =>
                                    updateQuestion(question.id, 'ratingScale', {
                                      min: 1,
                                      max: 10,
                                      minLabel: question.ratingScale?.minLabel || '',
                                      midLabel: e.target.value,
                                      maxLabel: question.ratingScale?.maxLabel || ''
                                    })
                                  }
                                  placeholder="e.g., Average, Sometimes, Neutral"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="font-semibold">Label for 10 (Highest)</Label>
                                <Input
                                  value={question.ratingScale?.maxLabel || ''}
                                  onChange={(e) =>
                                    updateQuestion(question.id, 'ratingScale', {
                                      min: 1,
                                      max: 10,
                                      minLabel: question.ratingScale?.minLabel || '',
                                      midLabel: question.ratingScale?.midLabel || '',
                                      maxLabel: e.target.value
                                    })
                                  }
                                  placeholder="e.g., Excellent, Always, Strongly Agree"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with CTA buttons */}
      <div className="flex justify-between items-center p-6 border-t bg-background sticky bottom-0">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {mode === 'create' ? 'Add Feedback Form' : 'Edit Feedback Form'}
        </Button>
      </div>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={unsavedChanges.showWarningModal}
        onClose={unsavedChanges.closeModal}
        onDiscard={unsavedChanges.discardChanges}
        onSave={() => unsavedChanges.saveAndContinue(handleSubmit)}
      />
    </div>
  );
}