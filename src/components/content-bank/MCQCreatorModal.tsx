'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Upload, Bot, CheckCircle, X, RefreshCw, Sparkles } from 'lucide-react';

interface MCQCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionVariant {
  id: string;
  question: string;
  options: Option[];
}

interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: string;
  topic: string;
  selected: boolean;
}

const MCQCreatorModal = ({ isOpen, onClose }: MCQCreatorModalProps) => {
  const [activeTab, setActiveTab] = useState('one-at-a-time');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  
  // One at a time tab state
  const [variants, setVariants] = useState<QuestionVariant[]>([
    {
      id: 'variant-1',
      question: '',
      options: [
        { id: 'opt-1', text: '', isCorrect: false },
        { id: 'opt-2', text: '', isCorrect: false },
        { id: 'opt-3', text: '', isCorrect: false },
        { id: 'opt-4', text: '', isCorrect: false }
      ]
    }
  ]);
  const [activeVariant, setActiveVariant] = useState('variant-1');

  // Bulk upload state
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Generate with AI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDifficulties, setAIDifficulties] = useState<string[]>([]);
  const [aiTopics, setAITopics] = useState<{ name: string; count: number }[]>([{ name: '', count: 1 }]);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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

  // Sample generated questions
  const dummyGeneratedQuestions: GeneratedQuestion[] = [
    {
      id: '1',
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: ['var name = value', 'let name = value', 'const name = value', 'All of the above'],
      correctAnswer: 'All of the above',
      difficulty: 'Easy',
      topic: 'JavaScript Basics',
      selected: true
    },
    {
      id: '2',
      question: 'Which method is used to add elements to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctAnswer: 'push()',
      difficulty: 'Easy',
      topic: 'JavaScript Basics',
      selected: true
    }
  ];

  const addVariant = () => {
    const newVariant: QuestionVariant = {
      id: `variant-${Date.now()}`,
      question: '',
      options: [
        { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
        { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
        { id: `opt-${Date.now()}-3`, text: '', isCorrect: false },
        { id: `opt-${Date.now()}-4`, text: '', isCorrect: false }
      ]
    };
    setVariants([...variants, newVariant]);
    setActiveVariant(newVariant.id);
  };

  const removeVariant = (variantId: string) => {
    if (variants.length > 1) {
      const newVariants = variants.filter(v => v.id !== variantId);
      setVariants(newVariants);
      if (activeVariant === variantId) {
        setActiveVariant(newVariants[0].id);
      }
    }
  };

  const updateVariant = (variantId: string, field: 'question', value: string) => {
    setVariants(variants.map(v => 
      v.id === variantId ? { ...v, [field]: value } : v
    ));
  };

  const updateOption = (variantId: string, optionId: string, field: 'text' | 'isCorrect', value: string | boolean) => {
    setVariants(variants.map(v => 
      v.id === variantId ? {
        ...v,
        options: v.options.map(opt => 
          opt.id === optionId ? { ...opt, [field]: value } : opt
        )
      } : v
    ));
  };

  const addOption = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (variant && variant.options.length < 6) {
      const newOption: Option = {
        id: `opt-${Date.now()}`,
        text: '',
        isCorrect: false
      };
      setVariants(variants.map(v => 
        v.id === variantId ? { ...v, options: [...v.options, newOption] } : v
      ));
    }
  };

  const removeOption = (variantId: string, optionId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (variant && variant.options.length > 2) {
      setVariants(variants.map(v => 
        v.id === variantId ? {
          ...v,
          options: v.options.filter(opt => opt.id !== optionId)
        } : v
      ));
    }
  };

  const handleFileUpload = (file: File) => {
    setBulkFile(file);
    console.log('File uploaded:', file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDifficultyToggle = (difficulty: string, checked: boolean) => {
    if (checked) {
      setAIDifficulties([...aiDifficulties, difficulty]);
    } else {
      setAIDifficulties(aiDifficulties.filter(d => d !== difficulty));
    }
  };

  const addAITopic = () => {
    if (aiTopics.length < 3) {
      setAITopics([...aiTopics, { name: '', count: 1 }]);
    }
  };

  const removeAITopic = (index: number) => {
    if (aiTopics.length > 1) {
      setAITopics(aiTopics.filter((_, i) => i !== index));
    }
  };

  const updateAITopic = (index: number, field: 'name' | 'count', value: string | number) => {
    setAITopics(aiTopics.map((topic, i) => 
      i === index ? { ...topic, [field]: value } : topic
    ));
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedQuestions(dummyGeneratedQuestions);
      setIsGenerating(false);
      setShowPreview(true);
    }, 3000);
  };

  const toggleQuestionSelection = (questionId: string, selected: boolean) => {
    setGeneratedQuestions(generatedQuestions.map(q => 
      q.id === questionId ? { ...q, selected } : q
    ));
  };

  const handleCreateQuestions = () => {
    console.log('Creating questions...');
    // Handle question creation logic here
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success-light text-success-dark border-success';
      case 'Medium': return 'bg-warning-light text-warning-dark border-warning';
      case 'Hard': return 'bg-destructive-light text-destructive-dark border-destructive';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const currentVariant = variants.find(v => v.id === activeVariant) || variants[0];
  const selectedCount = generatedQuestions.filter(q => q.selected).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Create Multiple Choice Questions</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="one-at-a-time">One at a Time</TabsTrigger>
            <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
            <TabsTrigger value="generate-ai">Generate with AI</TabsTrigger>
          </TabsList>

          <TabsContent value="one-at-a-time" className="space-y-6">
            {/* Topic and Difficulty at the top */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-semibold">Topic *</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTopics.map((topicOption) => (
                      <SelectItem key={topicOption} value={topicOption}>
                        {topicOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Difficulty *</Label>
                <RadioGroup
                  value={difficulty}
                  onValueChange={setDifficulty}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Easy" id="mcq-easy" />
                    <Label htmlFor="mcq-easy" className="font-normal">Easy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="mcq-medium" />
                    <Label htmlFor="mcq-medium" className="font-normal">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hard" id="mcq-hard" />
                    <Label htmlFor="mcq-hard" className="font-normal">Hard</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Variants section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Variants</Label>
                <Button
                  variant="ghost"
                  onClick={addVariant}
                  className="text-primary hover:text-primary-dark"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Variant
                </Button>
              </div>
              
              <Tabs value={activeVariant} onValueChange={setActiveVariant}>
                <TabsList className={`grid w-full`} style={{ gridTemplateColumns: `repeat(${variants.length}, 1fr)` }}>
                  {variants.map((variant, index) => (
                    <TabsTrigger key={variant.id} value={variant.id} className="relative">
                      Variant {index + 1}
                      {variants.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVariant(variant.id);
                          }}
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive-dark p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {variants.map((variant) => (
                  <TabsContent key={variant.id} value={variant.id} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="font-semibold">Question Text</Label>
                        <Textarea
                          value={variant.question}
                          onChange={(e) => updateVariant(variant.id, 'question', e.target.value)}
                          placeholder="Start typing..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label className="font-semibold">Answer Choices</Label>
                        <div className="space-y-3">
                          {variant.options.map((option, index) => (
                            <div key={option.id} className="flex items-center gap-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={option.isCorrect}
                                  onCheckedChange={(checked) => updateOption(variant.id, option.id, 'isCorrect', checked as boolean)}
                                />
                                <Label className="text-sm text-muted-foreground">
                                  Correct
                                </Label>
                              </div>
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option.text}
                                onChange={(e) => updateOption(variant.id, option.id, 'text', e.target.value)}
                                className="flex-1"
                              />
                              {variant.options.length > 2 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(variant.id, option.id)}
                                  className="text-destructive hover:text-destructive-dark"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                              {index === variant.options.length - 1 && variant.options.length < 6 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addOption(variant.id)}
                                  className="text-primary hover:text-primary-dark"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="bulk-upload" className="space-y-6">
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Upload Or Drag File</p>
                <p className="text-sm text-muted-foreground mb-4">.csv files are supported</p>
                
                {bulkFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm font-medium">{bulkFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBulkFile(null)}
                      className="text-destructive hover:text-destructive-dark"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden"
                      id="bulk-file-upload"
                    />
                    <Label
                      htmlFor="bulk-file-upload"
                      className="cursor-pointer inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary-dark"
                    >
                      Choose File
                    </Label>
                  </div>
                )}
              </div>
              
              {bulkFile && (
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary-dark">
                    Add Questions
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="generate-ai" className="space-y-6">
            {!showPreview ? (
              <div className="space-y-6">
                <Card className="bg-primary-light/20 border-primary-light">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">AI-Powered MCQ Generation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generate high-quality multiple choice questions automatically. Select difficulty levels and topics to get started.
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-semibold">Difficulty</Label>
                    <div className="flex space-x-6">
                      {['Easy', 'Medium', 'Hard'].map((diff) => (
                        <div key={diff} className="flex items-center space-x-2">
                          <Checkbox
                            checked={aiDifficulties.includes(diff)}
                            onCheckedChange={(checked) => handleDifficultyToggle(diff, checked as boolean)}
                          />
                          <Label className="font-normal">{diff}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="font-semibold">Topic Name and No. of Questions</Label>
                    <div className="space-y-3">
                      {aiTopics.map((topic, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Select 
                            value={topic.name} 
                            onValueChange={(value) => updateAITopic(index, 'name', value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Choose Topic" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTopics.map((topicOption) => (
                                <SelectItem key={topicOption} value={topicOption}>
                                  {topicOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={topic.count}
                            onChange={(e) => updateAITopic(index, 'count', parseInt(e.target.value) || 1)}
                            placeholder="Min 1 to Max 10"
                            className="w-40"
                          />
                          
                          {aiTopics.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAITopic(index)}
                              className="text-destructive hover:text-destructive-dark"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {aiTopics.length < 3 && (
                      <Button
                        variant="ghost"
                        onClick={addAITopic}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Topic
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGenerateQuestions}
                    disabled={aiDifficulties.length === 0 || aiTopics.some(t => !t.name) || isGenerating}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="bg-success-light/20 border-success-light">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="font-medium">
                          Generated {generatedQuestions.length} questions successfully
                        </span>
                      </div>
                      <Badge className="bg-primary-light text-primary-dark">
                        {selectedCount} selected
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {generatedQuestions.map((question) => (
                    <Card key={question.id} className={question.selected ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={question.selected}
                            onCheckedChange={(checked) => 
                              toggleQuestionSelection(question.id, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">MCQ</Badge>
                              <Badge className={getDifficultyColor(question.difficulty)} variant="outline">
                                {question.difficulty}
                              </Badge>
                              <Badge variant="secondary">{question.topic}</Badge>
                            </div>
                            
                            <p className="font-medium text-sm mb-2">{question.question}</p>
                            
                            <div className="space-y-1 mb-2">
                              {question.options.map((option, index) => (
                                <div key={index} className="text-xs flex items-center gap-2">
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                                    option === question.correctAnswer 
                                      ? 'bg-success text-success-foreground' 
                                      : 'bg-muted text-muted-foreground'
                                  }`}>
                                    {String.fromCharCode(65 + index)}
                                  </span>
                                  <span>{option}</span>
                                  {option === question.correctAnswer && (
                                    <CheckCircle className="h-3 w-3 text-success" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => console.log('Regenerate question:', question.id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Back to Setup
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateQuestions}
                      disabled={selectedCount === 0}
                      className="bg-primary hover:bg-primary-dark"
                    >
                      Generate {selectedCount} Questions
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer for One at a Time and Bulk Upload tabs */}
        {activeTab !== 'generate-ai' && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateQuestions}
              disabled={
                (activeTab === 'one-at-a-time' && (!topic || !difficulty || currentVariant?.question === '')) ||
                (activeTab === 'bulk-upload' && !bulkFile)
              }
              className="bg-primary hover:bg-primary-dark"
            >
              Create Question{activeTab === 'one-at-a-time' && variants.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MCQCreatorModal;