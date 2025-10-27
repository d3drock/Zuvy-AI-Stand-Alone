'use client';

import { useState } from 'react';
import { Plus, X, Star, MoreVertical, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { AdaptiveQuestion, QuestionOption, QuestionDifficulty } from '@/types/adaptive-assessment';
import { cn } from '@/lib/utils';

interface QuestionEditorProps {
  question?: AdaptiveQuestion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (question: Partial<AdaptiveQuestion>) => void;
  mode: 'create' | 'edit';
}

export function QuestionEditor({
  question,
  open,
  onOpenChange,
  onSave,
  mode,
}: QuestionEditorProps) {
  const [questionData, setQuestionData] = useState<Partial<AdaptiveQuestion>>(
    question || {
      title: '',
      questionText: '',
      questionType: 'single-answer',
      options: [
        { id: 'opt1', text: '', isCorrect: false },
        { id: 'opt2', text: '', isCorrect: false },
        { id: 'opt3', text: '', isCorrect: false },
      ],
      difficulty: 5,
      topic: '',
      tags: [],
      explanation: '',
      conceptTested: '',
      estimatedTime: 60,
      status: 'draft',
    }
  );

  const handleInputChange = (field: string, value: any) => {
    setQuestionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...(questionData.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuestionData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    const newOption: QuestionOption = {
      id: `opt${Date.now()}`,
      text: '',
      isCorrect: false,
    };
    setQuestionData((prev) => ({
      ...prev,
      options: [...(prev.options || []), newOption],
    }));
  };

  const removeOption = (index: number) => {
    const newOptions = [...(questionData.options || [])];
    newOptions.splice(index, 1);
    setQuestionData((prev) => ({ ...prev, options: newOptions }));
  };

  const toggleCorrectAnswer = (index: number) => {
    const newOptions = [...(questionData.options || [])];
    if (questionData.questionType === 'single-answer') {
      // Only one correct answer for single-answer
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      // Multiple answers allowed
      newOptions[index].isCorrect = !newOptions[index].isCorrect;
    }
    setQuestionData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSave = () => {
    // Update correctAnswerIds based on selected options
    const correctAnswerIds = (questionData.options || [])
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id);

    const dataToSave = {
      ...questionData,
      correctAnswerIds,
      createdAt: questionData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: questionData.createdBy || 'admin',
    };

    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-h5">
            {mode === 'create' ? 'Create New Question' : 'Edit Question'}
          </DialogTitle>
          <DialogDescription>
            Add a new question to the question bank with difficulty level and topic
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question Type */}
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select
              value={questionData.questionType}
              onValueChange={(value) => handleInputChange('questionType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-answer">Single Answer</SelectItem>
                <SelectItem value="multiple-answer">Multiple Answer</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Title */}
          <div className="space-y-2">
            <Label>Question Title</Label>
            <Input
              placeholder="Brief title for the question"
              value={questionData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
              placeholder="Type your question here..."
              value={questionData.questionText}
              onChange={(e) => handleInputChange('questionText', e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Question Image (Optional) */}
          <div className="space-y-2">
            <Label>Question Image (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Image URL"
                value={questionData.imageUrl || ''}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {questionData.imageUrl && (
              <div className="relative w-full max-w-md">
                <img
                  src={questionData.imageUrl}
                  alt="Question preview"
                  className="w-full h-auto rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label>Answer Options</Label>
            <div className="space-y-3">
              {questionData.options?.map((option, index) => (
                <div
                  key={option.id}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    option.isCorrect
                      ? 'border-success bg-success/5'
                      : 'border-border bg-card'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Option Text */}
                    <div className="flex-1">
                      <Input
                        placeholder="Type in answer option"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, 'text', e.target.value)
                        }
                      />
                      {option.imageUrl && (
                        <img
                          src={option.imageUrl}
                          alt="Option"
                          className="mt-2 w-full max-w-xs h-auto rounded-md"
                        />
                      )}
                    </div>

                    {/* Mark Correct Button */}
                    <Button
                      variant={option.isCorrect ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => toggleCorrectAnswer(index)}
                      className={cn(
                        option.isCorrect && 'bg-success hover:bg-success/90'
                      )}
                    >
                      <Star
                        className={cn(
                          'h-4 w-4',
                          option.isCorrect && 'fill-current'
                        )}
                      />
                    </Button>

                    {/* More Options */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            const url = prompt('Enter image URL:');
                            if (url) handleOptionChange(index, 'imageUrl', url);
                          }}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Add Image
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => removeOption(index)}
                          className="text-destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove Option
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Distractor Rationale (for wrong answers) */}
                  {!option.isCorrect && (
                    <div className="mt-3">
                      <Label className="text-xs text-muted-foreground">
                        Why is this wrong? (Optional)
                      </Label>
                      <Input
                        placeholder="Explain why students might choose this..."
                        value={option.distractorRationale || ''}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            'distractorRationale',
                            e.target.value
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addOption}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label>Explanation (Why the correct answer is right)</Label>
            <Textarea
              placeholder="Explain the concept and why the correct answer is right..."
              value={questionData.explanation}
              onChange={(e) => handleInputChange('explanation', e.target.value)}
              rows={3}
            />
          </div>

          {/* Concept Tested */}
          <div className="space-y-2">
            <Label>Concept Being Tested</Label>
            <Input
              placeholder="e.g., Understanding React hooks"
              value={questionData.conceptTested}
              onChange={(e) => handleInputChange('conceptTested', e.target.value)}
            />
          </div>

          {/* Topic & Subtopic */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Select
                value={questionData.topic}
                onValueChange={(value) => handleInputChange('topic', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="React">React</SelectItem>
                  <SelectItem value="Node.js">Node.js</SelectItem>
                  <SelectItem value="Data Structures">Data Structures</SelectItem>
                  <SelectItem value="Algorithms">Algorithms</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="System Design">System Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subtopic (Optional)</Label>
              <Input
                placeholder="e.g., Array Methods, Closures"
                value={questionData.subtopic || ''}
                onChange={(e) => handleInputChange('subtopic', e.target.value)}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Difficulty Level</Label>
              <Badge variant="outline">
                Level {questionData.difficulty} / 10
              </Badge>
            </div>
            <Slider
              value={[questionData.difficulty || 5]}
              onValueChange={(value) => handleInputChange('difficulty', value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Easy</span>
              <span>Medium</span>
              <span>Hard</span>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="space-y-2">
            <Label>Estimated Time (seconds)</Label>
            <Input
              type="number"
              placeholder="60"
              value={questionData.estimatedTime}
              onChange={(e) =>
                handleInputChange('estimatedTime', parseInt(e.target.value))
              }
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              placeholder="e.g., loops, arrays, ES6"
              value={questionData.tags?.join(', ')}
              onChange={(e) =>
                handleInputChange(
                  'tags',
                  e.target.value.split(',').map((t) => t.trim())
                )
              }
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={questionData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === 'create' ? 'Create Question' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
