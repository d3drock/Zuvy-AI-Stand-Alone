
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Plus, Loader2 } from 'lucide-react';
import { Question } from './types';

interface OpenEndedCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onQuestionCreated: (question: Question) => void;
  setIsCreating: (creating: boolean) => void;
  isCreating: boolean;
}

const OpenEndedCreatorModal = ({ isOpen, onClose, onBack, onQuestionCreated, setIsCreating, isCreating }: OpenEndedCreatorModalProps) => {
  const [questionData, setQuestionData] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: '',
    points: 10,
    timeLimit: 1800,
    expectedAnswer: '',
    wordLimit: 500
  });

  const [newTopic, setNewTopic] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const topics = ['JavaScript Basics', 'React Fundamentals', 'Node.js', 'Algorithms', 'Data Structures', 'System Design'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleInputChange = (field: string, value: string | number) => {
    setQuestionData(prev => ({ ...prev, [field]: value }));
  };

  const handleTopicKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTopic.trim()) {
      handleInputChange('topic', newTopic.trim());
      setNewTopic('');
      setIsCreatingTopic(false);
    }
  };

  const handleSave = async () => {
    setIsCreating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'Open Ended',
      title: questionData.title,
      description: questionData.description,
      topic: questionData.topic,
      difficulty: questionData.difficulty as 'Easy' | 'Medium' | 'Hard',
      points: questionData.points,
      expectedAnswer: questionData.expectedAnswer
    };
    
    onQuestionCreated(newQuestion);
    setIsCreating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack} disabled={isCreating}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="font-heading text-xl">Create Open Ended Question</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question-title" className="font-semibold">Question Title *</Label>
                <Textarea
                  id="question-title"
                  placeholder="Enter your question..."
                  value={questionData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">Description/Context</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional context, examples, or instructions..."
                  value={questionData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Topic *</Label>
                  {isCreatingTopic ? (
                    <Input
                      placeholder="Enter new topic and press Enter"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={handleTopicKeyPress}
                      onBlur={() => setIsCreatingTopic(false)}
                      autoFocus
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Select value={questionData.topic || undefined} onValueChange={(value) => handleInputChange('topic', value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select or create topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {topics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setIsCreatingTopic(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Difficulty *</Label>
                  <Select value={questionData.difficulty || undefined} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="points" className="font-semibold">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    value={questionData.points}
                    onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-limit" className="font-semibold">Time Limit (seconds)</Label>
                  <Input
                    id="time-limit"
                    type="number"
                    min="300"
                    value={questionData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="word-limit" className="font-semibold">Word Limit</Label>
                  <Input
                    id="word-limit"
                    type="number"
                    min="50"
                    value={questionData.wordLimit}
                    onChange={(e) => handleInputChange('wordLimit', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-answer" className="font-semibold">Expected Answer/Rubric (Optional)</Label>
                <Textarea
                  id="expected-answer"
                  placeholder="Provide a sample answer or grading rubric to help with evaluation..."
                  value={questionData.expectedAnswer}
                  onChange={(e) => handleInputChange('expectedAnswer', e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onBack} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isCreating} className="bg-primary hover:bg-primary-dark">
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Question'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenEndedCreatorModal;
