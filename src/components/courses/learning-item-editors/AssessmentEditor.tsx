'use client'

import React, { useState } from 'react';
import { BaseEditor } from './BaseEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, Search } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface QuestionType {
  id: string;
  type: 'mcq' | 'coding';
  name: string;
}

interface QuestionDistribution {
  questionTypeId: string;
  easy: number;
  medium: number;
  hard: number;
  totalAvailable: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface SectionWeightage {
  questionTypeId: string;
  percentage: number;
}

interface Question {
  id: string;
  type: 'mcq' | 'coding';
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AssessmentData {
  title: string;
  description: string;
  selectedQuestions: Question[];
  questionDistribution: QuestionDistribution[];
  sectionWeightage: SectionWeightage[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  proctoring: {
    disableCopyPaste: boolean;
    trackTabChange: boolean;
  };
}

interface AssessmentEditorProps {
  initialData?: AssessmentData;
  onSave: (data: AssessmentData) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export function AssessmentEditor({ initialData, onSave, onCancel, mode }: AssessmentEditorProps) {
  // Mock question types
  const questionTypes: QuestionType[] = [
    { id: 'mcq', type: 'mcq', name: 'Multiple Choice Questions' },
    { id: 'coding', type: 'coding', name: 'Coding Problems' }
  ];

  // Mock questions from content bank
  const mockContentBankQuestions: Question[] = [
    { id: 'q1', type: 'mcq', title: 'What is React?', difficulty: 'easy' },
    { id: 'q2', type: 'mcq', title: 'Explain useState hook', difficulty: 'medium' },
    { id: 'q3', type: 'mcq', title: 'Advanced React patterns', difficulty: 'hard' },
    { id: 'q4', type: 'coding', title: 'Implement a counter', difficulty: 'easy' },
    { id: 'q5', type: 'coding', title: 'Create a todo list', difficulty: 'medium' },
    { id: 'q6', type: 'coding', title: 'Build a state management system', difficulty: 'hard' },
  ];

  const [data, setData] = useState<AssessmentData>(
    initialData || {
      title: '',
      description: '',
      selectedQuestions: [],
      questionDistribution: questionTypes.map(type => ({
        questionTypeId: type.id,
        easy: 1,
        medium: 1,
        hard: 0,
        totalAvailable: {
          easy: mockContentBankQuestions.filter(q => q.type === type.type && q.difficulty === 'easy').length,
          medium: mockContentBankQuestions.filter(q => q.type === type.type && q.difficulty === 'medium').length,
          hard: mockContentBankQuestions.filter(q => q.type === type.type && q.difficulty === 'hard').length,
        }
      })),
      sectionWeightage: questionTypes.map((type, index) => ({
        questionTypeId: type.id,
        percentage: 100 / questionTypes.length
      })),
      timeLimit: 60,
      passingScore: 70,
      proctoring: {
        disableCopyPaste: false,
        trackTabChange: false
      }
    }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('all');

  const handleChange = (field: keyof AssessmentData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleProctoringChange = (field: keyof AssessmentData['proctoring'], value: boolean) => {
    setData(prev => ({
      ...prev,
      proctoring: {
        ...prev.proctoring,
        [field]: value
      }
    }));
  };

  const updateDistribution = (typeId: string, difficulty: 'easy' | 'medium' | 'hard', value: number) => {
    setData(prev => ({
      ...prev,
      questionDistribution: prev.questionDistribution.map(dist => 
        dist.questionTypeId === typeId 
          ? { ...dist, [difficulty]: value } 
          : dist
      )
    }));
  };

  const updateWeightage = (typeId: string, percentage: number) => {
    // First update the selected type
    const updatedWeightage = data.sectionWeightage.map(w => 
      w.questionTypeId === typeId ? { ...w, percentage } : w
    );
    
    // Calculate the total of all other types
    const selectedType = updatedWeightage.find(w => w.questionTypeId === typeId);
    const otherTypes = updatedWeightage.filter(w => w.questionTypeId !== typeId);
    const otherTypesTotal = otherTypes.reduce((sum, w) => sum + w.percentage, 0);
    
    // If we have other types, adjust their percentages to make total 100%
    if (otherTypes.length > 0 && selectedType) {
      const remainingPercentage = 100 - selectedType.percentage;
      const scaleFactor = remainingPercentage / otherTypesTotal;
      
      const finalWeightage = updatedWeightage.map(w => 
        w.questionTypeId !== typeId 
          ? { ...w, percentage: Math.round(w.percentage * scaleFactor) } 
          : w
      );
      
      setData(prev => ({ ...prev, sectionWeightage: finalWeightage }));
    } else {
      setData(prev => ({ ...prev, sectionWeightage: updatedWeightage }));
    }
  };

  const addQuestion = (question: Question) => {
    if (data.selectedQuestions.some(q => q.id === question.id)) {
      return; // Already added
    }
    
    setData(prev => ({
      ...prev,
      selectedQuestions: [...prev.selectedQuestions, question]
    }));
  };

  const removeQuestion = (id: string) => {
    setData(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.filter(q => q.id !== id)
    }));
  };

  const filteredQuestions = mockContentBankQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedQuestionType === 'all' || question.type === selectedQuestionType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = () => {
    onSave(data);
  };

  return (
    <BaseEditor
      title=""
      type="assessment"
      mode={mode}
      onSave={handleSubmit}
      onCancel={onCancel}
      tabs={[
        {
          id: 'details',
          label: 'Details',
          content: (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">Title</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter assessment title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter assessment description"
                  rows={4}
                />
              </div>
            </div>
          ),
        },
        {
          id: 'questions',
          label: 'Questions',
          content: (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Content Bank Questions */}
                <div className="flex-1 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Content Bank</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search questions..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select 
                        value={selectedQuestionType} 
                        onValueChange={setSelectedQuestionType}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="coding">Coding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="border rounded-md h-[300px] overflow-y-auto">
                      {filteredQuestions.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No questions found
                        </div>
                      ) : (
                        <div className="divide-y">
                          {filteredQuestions.map(question => (
                            <div key={question.id} className="p-3 hover:bg-primary-light">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      question.type === 'mcq' 
                                        ? 'bg-primary-light text-primary' 
                                        : 'bg-info-light text-info'
                                    }`}>
                                      {question.type === 'mcq' ? 'MCQ' : 'Coding'}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      question.difficulty === 'easy' 
                                        ? 'bg-success-light text-success-dark' 
                                        : question.difficulty === 'medium'
                                        ? 'bg-warning-light text-warning-dark'
                                        : 'bg-destructive-light text-destructive-dark'
                                    }`}>
                                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium">{question.title}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => addQuestion(question)}
                                  disabled={data.selectedQuestions.some(q => q.id === question.id)}
                                >
                                  {data.selectedQuestions.some(q => q.id === question.id) 
                                    ? 'Added' 
                                    : 'Add'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Selected Questions */}
                <div className="flex-1 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">
                    Selected Questions ({data.selectedQuestions.length})
                  </h3>
                  
                  <div className="border rounded-md h-[300px] overflow-y-auto">
                    {data.selectedQuestions.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No questions selected
                      </div>
                    ) : (
                      <div className="divide-y">
                        {data.selectedQuestions.map(question => (
                          <div key={question.id} className="p-3 hover:bg-primary-light">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    question.type === 'mcq' 
                                      ? 'bg-primary-light text-primary' 
                                      : 'bg-info-light text-info'
                                  }`}>
                                    {question.type === 'mcq' ? 'MCQ' : 'Coding'}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    question.difficulty === 'easy' 
                                      ? 'bg-success-light text-success-dark' 
                                      : question.difficulty === 'medium'
                                      ? 'bg-warning-light text-warning-dark'
                                      : 'bg-destructive-light text-destructive-dark'
                                  }`}>
                                    {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                                  </span>
                                </div>
                                <p className="text-sm font-medium">{question.title}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'settings',
          label: 'Settings',
          content: (
            <div className="space-y-8">
              {/* Question Distribution */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Question Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Specify how many questions from each difficulty level should be shown to students
                </p>
                
                <div className="space-y-6">
                  {data.questionDistribution.map(dist => {
                    const questionType = questionTypes.find(t => t.id === dist.questionTypeId);
                    return (
                      <div key={dist.questionTypeId} className="border rounded-md p-4">
                        <h4 className="font-medium mb-4">{questionType?.name}</h4>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Easy Questions</Label>
                              <p className="text-xs text-muted-foreground">
                                {dist.totalAvailable.easy} available
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max={dist.totalAvailable.easy}
                                value={dist.easy}
                                onChange={(e) => updateDistribution(
                                  dist.questionTypeId, 
                                  'easy', 
                                  Math.min(parseInt(e.target.value) || 0, dist.totalAvailable.easy)
                                )}
                                className="w-16"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Medium Questions</Label>
                              <p className="text-xs text-muted-foreground">
                                {dist.totalAvailable.medium} available
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max={dist.totalAvailable.medium}
                                value={dist.medium}
                                onChange={(e) => updateDistribution(
                                  dist.questionTypeId, 
                                  'medium', 
                                  Math.min(parseInt(e.target.value) || 0, dist.totalAvailable.medium)
                                )}
                                className="w-16"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Hard Questions</Label>
                              <p className="text-xs text-muted-foreground">
                                {dist.totalAvailable.hard} available
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max={dist.totalAvailable.hard}
                                value={dist.hard}
                                onChange={(e) => updateDistribution(
                                  dist.questionTypeId, 
                                  'hard', 
                                  Math.min(parseInt(e.target.value) || 0, dist.totalAvailable.hard)
                                )}
                                className="w-16"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Section Weightage */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Section Weightage</h3>
                <p className="text-sm text-muted-foreground">
                  Assign percentage weight to each section (total must equal 100%)
                </p>
                
                <div className="space-y-6">
                  {data.sectionWeightage.map(weightage => {
                    const questionType = questionTypes.find(t => t.id === weightage.questionTypeId);
                    return (
                      <div key={weightage.questionTypeId} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label>{questionType?.name}</Label>
                          <span className="font-medium">{weightage.percentage}%</span>
                        </div>
                        <Slider
                          value={[weightage.percentage]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => updateWeightage(weightage.questionTypeId, value[0])}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Time Limit */}
              <div className="space-y-2">
                <Label htmlFor="timeLimit" className="font-semibold">Time Limit (minutes)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  value={data.timeLimit}
                  onChange={(e) => handleChange('timeLimit', parseInt(e.target.value) || 60)}
                />
              </div>
              
              {/* Passing Score */}
              <div className="space-y-2">
                <Label htmlFor="passingScore" className="font-semibold">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min="1"
                  max="100"
                  value={data.passingScore}
                  onChange={(e) => handleChange('passingScore', Math.min(parseInt(e.target.value) || 70, 100))}
                />
              </div>
              
              {/* Proctoring */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Proctoring</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="disableCopyPaste" className="font-semibold">Disable Copy/Paste</Label>
                      <p className="text-sm text-muted-foreground">
                        Prevent students from copying and pasting during the assessment
                      </p>
                    </div>
                    <Switch
                      id="disableCopyPaste"
                      checked={data.proctoring.disableCopyPaste}
                      onCheckedChange={(checked) => handleProctoringChange('disableCopyPaste', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="trackTabChange" className="font-semibold">Track Tab Change</Label>
                      <p className="text-sm text-muted-foreground">
                        Monitor if students navigate away from the assessment tab
                      </p>
                    </div>
                    <Switch
                      id="trackTabChange"
                      checked={data.proctoring.trackTabChange}
                      onCheckedChange={(checked) => handleProctoringChange('trackTabChange', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ]}
    >
      {/* Children is required but not used when tabs are provided */}
      <></>
    </BaseEditor>
  );
} 