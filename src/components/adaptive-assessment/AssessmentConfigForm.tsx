'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AssessmentConfiguration } from '@/types/adaptive-assessment';

interface AssessmentConfigFormProps {
  config?: AssessmentConfiguration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: Partial<AssessmentConfiguration>) => void;
  mode: 'create' | 'edit';
  availableTopics: string[];
}

export function AssessmentConfigForm({
  config,
  open,
  onOpenChange,
  onSave,
  mode,
  availableTopics,
}: AssessmentConfigFormProps) {
  const [formData, setFormData] = useState<Partial<AssessmentConfiguration>>(
    config || {
      title: '',
      description: '',
      totalQuestions: 15,
      timeLimit: 30,
      topics: [],
      passingScore: 60,
      allowRetry: true,
      retryDelay: 24,
      showFeedback: true,
      randomizeOptions: true,
    }
  );

  const [newTopic, setNewTopic] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTopic = (topic: string) => {
    if (topic && !formData.topics?.includes(topic)) {
      setFormData((prev) => ({
        ...prev,
        topics: [...(prev.topics || []), topic],
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics?.filter((t) => t !== topic) || [],
    }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-h5">
            {mode === 'create' ? 'Create Assessment' : 'Edit Assessment'}
          </DialogTitle>
          <DialogDescription>
            Configure the assessment settings and select topics to test
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Assessment Title *</Label>
              <Input
                placeholder="e.g., JavaScript Fundamentals Assessment"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of what this assessment covers..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Topics */}
          <Card className="p-4 bg-muted/50">
            <Label className="mb-3 block">Topics to Test *</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                >
                  <option value="">Select a topic...</option>
                  {availableTopics
                    .filter((t) => !formData.topics?.includes(t))
                    .map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                </select>
                <Button
                  type="button"
                  onClick={() => addTopic(newTopic)}
                  disabled={!newTopic}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {formData.topics && formData.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="gap-2">
                      {topic}
                      <button
                        onClick={() => removeTopic(topic)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {(!formData.topics || formData.topics.length === 0) && (
                <p className="text-sm text-muted-foreground italic">
                  No topics selected. Add at least one topic.
                </p>
              )}
            </div>
          </Card>

          {/* Assessment Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total Questions</Label>
              <Input
                type="number"
                min={5}
                max={50}
                value={formData.totalQuestions}
                onChange={(e) =>
                  handleInputChange('totalQuestions', parseInt(e.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Questions per assessment (5-50)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Time Limit (minutes)</Label>
              <Input
                type="number"
                min={10}
                max={180}
                value={formData.timeLimit}
                onChange={(e) =>
                  handleInputChange('timeLimit', parseInt(e.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Total time allowed (10-180 min)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Passing Score (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.passingScore}
                onChange={(e) =>
                  handleInputChange('passingScore', parseInt(e.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Minimum % to pass (0-100)
              </p>
            </div>

            <div className="space-y-2">
              <Label>Retry Delay (hours)</Label>
              <Input
                type="number"
                min={0}
                max={168}
                value={formData.retryDelay}
                onChange={(e) =>
                  handleInputChange('retryDelay', parseInt(e.target.value))
                }
                disabled={!formData.allowRetry}
              />
              <p className="text-xs text-muted-foreground">
                Wait time before retry (0-168 hrs)
              </p>
            </div>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Allow Retry</Label>
                <p className="text-sm text-muted-foreground">
                  Students can retake the assessment
                </p>
              </div>
              <Switch
                checked={formData.allowRetry}
                onCheckedChange={(checked) => handleInputChange('allowRetry', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Show Instant Feedback</Label>
                <p className="text-sm text-muted-foreground">
                  Display explanations after each question
                </p>
              </div>
              <Switch
                checked={formData.showFeedback}
                onCheckedChange={(checked) => handleInputChange('showFeedback', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label>Randomize Options</Label>
                <p className="text-sm text-muted-foreground">
                  Shuffle answer options for each student
                </p>
              </div>
              <Switch
                checked={formData.randomizeOptions}
                onCheckedChange={(checked) =>
                  handleInputChange('randomizeOptions', checked)
                }
              />
            </div>
          </div>

          {/* Preview Summary */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-semibold text-body2 mb-3">Assessment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Questions:</span>
                <span className="font-medium">{formData.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Limit:</span>
                <span className="font-medium">{formData.timeLimit} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Topics:</span>
                <span className="font-medium">
                  {formData.topics?.length || 0} selected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passing Score:</span>
                <span className="font-medium">{formData.passingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Duration:</span>
                <span className="font-medium">
                  ~{Math.round(formData.totalQuestions! * 1.5)} min
                </span>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !formData.title || !formData.topics || formData.topics.length === 0
            }
          >
            {mode === 'create' ? 'Create Assessment' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
