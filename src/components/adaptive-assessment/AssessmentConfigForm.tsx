'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { api } from '@/utils/axios.config';
import { useBootcamp } from '@/lib/hooks/useBootcamp';
import TypingSkeleton from './LoadingSkeletion';
import { useAiAssessment } from '@/lib/hooks/useAiAssessment';

interface Bootcamp {
  id: number;
  name: string;
  [key: string]: any;
}

// Available topics for the assessment
const AVAILABLE_TOPICS = [
  'Arrays',
  'Loops',
  'Objects',
  'Functions',
  'Promises',
  'Async/Await',
  'DOM Manipulation',
  'Event Handling',
  'Closures',
  'Prototypes',
  'ES6 Features',
  'Data Structures',
  'Algorithms',
  'Sorting',
  'Searching',
  'Trees',
  'Graphs',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Recursion',
  'Dynamic Programming',
  'Hash Tables',
  'Binary Search',
  'String Manipulation',
  'OOP Concepts',
  'Design Patterns',
];

interface TopicWithCount {
  topic: string;
  count: number;
}

interface AssessmentFormData {
  title: string;
  description: string;
  difficulty: string;
  topics: TopicWithCount[];
  audience: string;
  bootcampId: number | null;
  assessmentId?: number | null;
}

interface AssessmentConfigFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: any) => void;
  mode: 'create' | 'edit';
  bootcamps: Bootcamp[];
  bootcampsLoading: boolean;
}

export function AssessmentConfigForm({
  open,
  onOpenChange,
  onSave,
  mode,
  bootcamps,
  bootcampsLoading,
}: AssessmentConfigFormProps) {
  const [formData, setFormData] = useState<AssessmentFormData>({
    title: '',
    description: '',
    difficulty: 'Medium',
    topics: [],
    audience: '',
    bootcampId: null,
  assessmentId: null,
  });
    const [selectedBootcampForAssessment, setSelectedBootcampForAssessment] = useState<number | null>(null);
    const { assessment } = useAiAssessment({ bootcampId: selectedBootcampForAssessment });
    const [assessmentId, setAssessmentId] = useState<number | null>(null);


    console.log(bootcamps)
    console.log('assessment', assessment)


  const [newTopic, setNewTopic] = useState('');
  const [newTopicCount, setNewTopicCount] = useState<number>(1);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleDifficultyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, difficulty: value }));
  };

  const handleAudienceChange = (value: string) => {
    const parsedId = value ? parseInt(value) : null;
    setAssessmentId(parsedId);
    const selected = assessment?.find((a: any) => String(a.id) === String(value));
    setFormData((prev) => ({ ...prev, audience: selected?.title || '' }));
  };

  const handleBootcampChange = (value: string) => {
    console.log("Selected Bootcamp ID:", value);
    const bootcampId = value ? parseInt(value) : null;
    setSelectedBootcampForAssessment(bootcampId);
    setFormData((prev) => ({ ...prev, bootcampId, assessmentId: null, audience: '' }));
  };

  const handleAssessmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, assessment: value }));
  }

  const [loading, setLoading] = useState(false);

  const addTopic = () => {
    if (newTopic && newTopicCount > 0) {
      const topicExists = formData.topics.find((t) => t.topic === newTopic);
      if (!topicExists) {
        setFormData((prev) => ({
          ...prev,
          topics: [...prev.topics, { topic: newTopic, count: newTopicCount }],
        }));
        setNewTopic('');
        setNewTopicCount(1);
      }
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((t) => t.topic !== topicToRemove),
    }));
  };

  const handleSave = async () => {
    // Transform topics array to object format
    const topicsObject: { [key: string]: number } = {};
    formData.topics.forEach((t) => {
      topicsObject[t.topic] = t.count;
    });

    const dataToSave = {
      bootcampId: formData.bootcampId,
      title: formData.title,
      description: formData.description,
      difficulty: formData.difficulty,
      topics: topicsObject,
      audience: formData.audience,
      totalNumberOfQuestions: formData.topics.reduce((sum, t) => sum + t.count, 0),
    };

    console.log('dataToSave:', dataToSave);

    setLoading(true);
    try {
      // await api.post('/content/generate-mcqs', dataToSave);
      await api.post('/ai-assessment', dataToSave);
      await api.post('/ai-assessment/generate/all', { aiAssessmentId: assessmentId });
      setLoading(false);
    }
    catch(error){
      setLoading(false);
      console.error('Error saving assessment config:', error);
    }

    // onSave(dataToSave);
    onOpenChange(false);
    setFormData({
      title: '',
      description: '',
      difficulty: 'Medium',
      topics: [],
      audience: '',
      bootcampId: null,
      assessmentId: null,
    });
  };

  const selectedTopicNames = formData.topics.map((t) => t.topic);
  const availableTopicsFiltered = AVAILABLE_TOPICS.filter(
    (t) => !selectedTopicNames.includes(t)
  );

  console.log(bootcamps)

  console.log('formData', formData);

  return (
    <>

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-h5">
            {mode === 'create' ? 'Create Assessment' : 'Edit Assessment'}
          </DialogTitle>
          <DialogDescription>
            Configure the assessment settings for bootcamp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Assessment Title *</Label>
            <Input
              placeholder="e.g., JavaScript Fundamentals Assessment"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Brief description of what this assessment covers..."
              value={formData.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>

          {/* Bootcamp Selection */}
          <div className="space-y-2">
            <Label>Bootcamp *</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.bootcampId || ''}
              onChange={(e) => handleBootcampChange(e.target.value)}
            >
              <option value="">Select a bootcamp...</option>
              {bootcamps.map((bootcamp) => (
                <option key={bootcamp.id} value={bootcamp.id}>
                  {bootcamp.name}
                </option>
              ))}
            </select>
          </div>

          {
            formData.bootcampId && assessment && assessment?.length > 0 &&
             (
              <div className="space-y-2">
                <Label>Audience*</Label>
                <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.audience || ''}
                onChange={(e) => handleAudienceChange(e.target.value)}
              >
                <option value="">Select an Assessment...</option>
                {
                  assessment && assessment.map((assess: any) => (
                    <option key={assess.id} value={assess.id}>
                      {assess.title}
                    </option>
                  ))
                }
              </select>
            </div>
            )
          }

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <Label>Difficulty Level *</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Topics with Question Count */}
          <Card className="p-4 bg-muted/50">
            <Label className="mb-3 block">Topics with Question Count *</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                >
                  <option value="">Select a topic...</option>
                  {availableTopicsFiltered.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={newTopicCount}
                  onChange={(e) => setNewTopicCount(parseInt(e.target.value) || 1)}
                  placeholder="Count"
                  className="w-24"
                />
                <Button
                  type="button"
                  onClick={addTopic}
                  disabled={!newTopic}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {formData.topics && formData.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.topics.map((topicItem) => (
                    <Badge key={topicItem.topic} variant="secondary" className="gap-2">
                      {topicItem.topic} ({topicItem.count} questions)
                      <button
                        onClick={() => removeTopic(topicItem.topic)}
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
                  No topics selected. Add at least one topic with question count.
                </p>
              )}
            </div>
          </Card>

          {/* Audience */}
          {/* <div className="space-y-2">
            <Label>Audience *</Label>
            <Textarea
              placeholder="e.g., Assessment for AFE cohort, semester 2 and 3 CSE"
              value={formData.audience}
              onChange={(e) => handleAudienceChange(e.target.value)}
              rows={3}
            />
          </div> */}

          {/* Preview Summary */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-semibold text-body2 mb-3">Assessment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="font-medium">{formData.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Topics:</span>
                <span className="font-medium">
                  {formData.topics?.length || 0} selected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Questions:</span>
                <span className="font-medium">
                  {formData.topics.reduce((sum, t) => sum + t.count, 0)}
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
              !formData.title ||
              !formData.bootcampId ||
              !formData.difficulty ||
              !formData.topics ||
              formData.topics.length === 0
            }
          >
            {!loading ? 'Create Assessment' : 'Loading...'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
