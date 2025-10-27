'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { Question } from './types';

interface MCQCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onQuestionCreated: (question: Question) => void;
  setIsCreating: (creating: boolean) => void;
  isCreating: boolean;
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

const MCQCreatorModal = ({ isOpen, onClose, onBack, onQuestionCreated, setIsCreating, isCreating }: MCQCreatorModalProps) => {
  const [questionData, setQuestionData] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: '',
    points: 5,
    timeLimit: 60
  });
  
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: false },
    { id: '3', text: '', isCorrect: false },
    { id: '4', text: '', isCorrect: false }
  ]);

  const [newTopic, setNewTopic] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const topics = ['JavaScript Basics', 'React Fundamentals', 'Node.js', 'Algorithms', 'Data Structures'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleInputChange = (field: string, value: string | number) => {
    setQuestionData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (optionId: string, text: string) => {
    setOptions(prev => prev.map(option =>
      option.id === optionId ? { ...option, text } : option
    ));
  };

  const handleCorrectChange = (optionId: string, isCorrect: boolean) => {
    setOptions(prev => prev.map(option =>
      option.id === optionId ? { ...option, isCorrect } : option
    ));
  };

  const addOption = () => {
    const newOption: Option = {
      id: Date.now().toString(),
      text: '',
      isCorrect: false
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (optionId: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== optionId));
    }
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
      type: 'MCQ',
      title: questionData.title,
      description: questionData.description,
      topic: questionData.topic,
      difficulty: questionData.difficulty as 'Easy' | 'Medium' | 'Hard',
      points: questionData.points,
      options: options.map(opt => opt.text),
      correctAnswers: options.filter(opt => opt.isCorrect).map(opt => opt.text)
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
            <DialogTitle className="font-heading text-xl">Create MCQ Question</DialogTitle>
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
                <Label htmlFor="description" className="font-semibold">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add context or additional information..."
                  value={questionData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[60px]"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    min="30"
                    value={questionData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium font-semibold">Answer Options *</Label>
                  <Button variant="outline" size="sm" onClick={addOption}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={option.isCorrect}
                          onCheckedChange={(checked) => handleCorrectChange(option.id, checked as boolean)}
                        />
                        <Label className="text-sm text-muted-foreground font-semibold">
                          Correct
                        </Label>
                      </div>
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(option.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Check the box next to correct answer(s). Multiple correct answers are allowed.
                </p>
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

export default MCQCreatorModal;
