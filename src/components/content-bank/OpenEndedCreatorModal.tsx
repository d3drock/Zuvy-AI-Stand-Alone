'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OpenEndedCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OpenEndedCreatorModal = ({ isOpen, onClose }: OpenEndedCreatorModalProps) => {
  const [questionData, setQuestionData] = useState({
    question: '',
    difficulty: '',
    topic: ''
  });

  const availableTopics = [
    'JavaScript Basics',
    'React Fundamentals', 
    'Node.js',
    'Algorithms',
    'Data Structures',
    'CSS Layout',
    'TypeScript',
    'Database Concepts',
    'System Design',
    'Web APIs',
    'Testing',
    'Performance Optimization'
  ];

  const handleInputChange = (field: string, value: string) => {
    setQuestionData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateQuestion = () => {
    console.log('Creating open ended question:', questionData);
    // Here you would handle the actual creation logic
    onClose();
    // Reset form
    setQuestionData({
      question: '',
      difficulty: '',
      topic: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-heading text-xl">Create Open Ended Question</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="question" className="font-semibold">Question *</Label>
            <Textarea
              id="question"
              value={questionData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              placeholder="Enter your open ended question..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold">Difficulty *</Label>
              <RadioGroup
                value={questionData.difficulty}
                onValueChange={(value) => handleInputChange('difficulty', value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Easy" id="open-easy" />
                  <Label htmlFor="open-easy" className="font-normal">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="open-medium" />
                  <Label htmlFor="open-medium" className="font-normal">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Hard" id="open-hard" />
                  <Label htmlFor="open-hard" className="font-normal">Hard</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Topic *</Label>
              <Select value={questionData.topic} onValueChange={(value) => handleInputChange('topic', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateQuestion}
              disabled={!questionData.question || !questionData.difficulty || !questionData.topic}
              className="bg-primary hover:bg-primary-dark"
            >
              Create Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenEndedCreatorModal;