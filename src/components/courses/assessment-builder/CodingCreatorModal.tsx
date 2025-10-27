
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { Question, TestCase } from './types';

interface CodingCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onQuestionCreated: (question: Question) => void;
  setIsCreating: (creating: boolean) => void;
  isCreating: boolean;
}

const CodingCreatorModal = ({ isOpen, onClose, onBack, onQuestionCreated, setIsCreating, isCreating }: CodingCreatorModalProps) => {
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    topic: '',
    difficulty: '',
    points: 20,
    timeLimit: 1800,
    memoryLimit: 256,
    language: 'javascript'
  });

  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', input: '', expectedOutput: '', isHidden: false },
    { id: '2', input: '', expectedOutput: '', isHidden: true }
  ]);

  const [starterCode, setStarterCode] = useState('// Write your solution here\nfunction solve() {\n    \n}');
  const [solutionCode, setSolutionCode] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  const topics = ['Algorithms', 'Data Structures', 'JavaScript', 'React', 'Node.js'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setProblemData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestCaseChange = (testCaseId: string, field: string, value: string | boolean) => {
    setTestCases(prev => prev.map(tc =>
      tc.id === testCaseId ? { ...tc, [field]: value } : tc
    ));
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: Date.now().toString(),
      input: '',
      expectedOutput: '',
      isHidden: false
    };
    setTestCases([...testCases, newTestCase]);
  };

  const removeTestCase = (testCaseId: string) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter(tc => tc.id !== testCaseId));
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'Coding',
      title: problemData.title,
      description: problemData.description,
      topic: problemData.topic,
      difficulty: problemData.difficulty as 'Easy' | 'Medium' | 'Hard',
      points: problemData.points,
      testCases: testCases
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
            <DialogTitle className="font-heading text-xl">Create Coding Problem</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Problem Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="problem-title" className="font-semibold">Problem Title *</Label>
                <Input
                  id="problem-title"
                  placeholder="e.g., Two Sum, Reverse Linked List"
                  value={problemData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem-description" className="font-semibold">Problem Description *</Label>
                <Textarea
                  id="problem-description"
                  placeholder="Describe the problem, including constraints and examples..."
                  value={problemData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[120px]"
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
                      <Select value={problemData.topic} onValueChange={(value) => handleInputChange('topic', value)}>
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
                  <Select value={problemData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
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
                    value={problemData.points}
                    onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-limit" className="font-semibold">Time Limit (seconds)</Label>
                  <Input
                    id="time-limit"
                    type="number"
                    min="60"
                    value={problemData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memory-limit" className="font-semibold">Memory Limit (MB)</Label>
                  <Input
                    id="memory-limit"
                    type="number"
                    min="64"
                    value={problemData.memoryLimit}
                    onChange={(e) => handleInputChange('memoryLimit', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Programming Language</Label>
                <Select value={problemData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Accordion type="multiple" defaultValue={["test-cases"]} className="space-y-4">
            <AccordionItem value="test-cases">
              <Card>
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <CardTitle className="text-lg">Test Cases</CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Define input/output pairs to validate solutions
                        </p>
                        <Button variant="outline" size="sm" onClick={addTestCase}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Test Case
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {testCases.map((testCase, index) => (
                          <Card key={testCase.id} className="border-dashed">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-sm">
                                  Test Case {index + 1}
                                  {testCase.isHidden && (
                                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Hidden</span>
                                  )}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleTestCaseChange(testCase.id, 'isHidden', !testCase.isHidden)}
                                  >
                                    {testCase.isHidden ? 'Make Visible' : 'Make Hidden'}
                                  </Button>
                                  {testCases.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeTestCase(testCase.id)}
                                      className="text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold">Input</Label>
                                  <Textarea
                                    placeholder="Enter test input..."
                                    value={testCase.input}
                                    onChange={(e) => handleTestCaseChange(testCase.id, 'input', e.target.value)}
                                    className="min-h-[80px] font-mono text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-semibold">Expected Output</Label>
                                  <Textarea
                                    placeholder="Enter expected output..."
                                    value={testCase.expectedOutput}
                                    onChange={(e) => handleTestCaseChange(testCase.id, 'expectedOutput', e.target.value)}
                                    className="min-h-[80px] font-mono text-sm"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

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
                'Create Problem'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodingCreatorModal;
