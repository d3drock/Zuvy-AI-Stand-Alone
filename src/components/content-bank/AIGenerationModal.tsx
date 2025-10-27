
'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Bot, Sparkles, RefreshCw, CheckCircle, X } from 'lucide-react';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  difficulty: string;
  topic: string;
  selected: boolean;
}

const AIGenerationModal = ({ isOpen, onClose }: AIGenerationModalProps) => {
  const [step, setStep] = useState<'setup' | 'review'>('setup');
  const [isGenerating, setIsGenerating] = useState(false);
  const [setupData, setSetupData] = useState({
    topics: '',
    questionTypes: [] as string[],
    difficulty: '',
    quantity: 5,
    context: ''
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);

  // Dummy generated questions for demonstration
  const dummyGeneratedQuestions: GeneratedQuestion[] = [
    {
      id: '1',
      question: 'What is the primary purpose of React hooks?',
      type: 'MCQ',
      options: [
        'To replace class components entirely',
        'To use state and lifecycle features in functional components',
        'To improve performance of React applications',
        'To handle routing in React applications'
      ],
      correctAnswer: 'To use state and lifecycle features in functional components',
      difficulty: 'Medium',
      topic: 'React Hooks',
      selected: true
    },
    {
      id: '2',
      question: 'Which hook is used to perform side effects in functional components?',
      type: 'MCQ',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      correctAnswer: 'useEffect',
      difficulty: 'Easy',
      topic: 'React Hooks',
      selected: true
    },
    {
      id: '3',
      question: 'Implement a custom hook that manages a counter with increment and decrement functionality.',
      type: 'Coding',
      options: undefined,
      correctAnswer: 'function useCounter(initialValue = 0) { const [count, setCount] = useState(initialValue); const increment = () => setCount(count + 1); const decrement = () => setCount(count - 1); return { count, increment, decrement }; }',
      difficulty: 'Medium',
      topic: 'React Hooks',
      selected: true
    }
  ];

  const questionTypes = [
    { value: 'MCQ', label: 'Multiple Choice' },
    { value: 'True/False', label: 'True/False' },
    { value: 'Fill in the Blank', label: 'Fill in the Blank' },
    { value: 'Coding', label: 'Coding Problem' }
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleInputChange = (field: string, value: any) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionTypeToggle = (type: string, checked: boolean) => {
    setSetupData(prev => ({
      ...prev,
      questionTypes: checked 
        ? [...prev.questionTypes, type]
        : prev.questionTypes.filter(t => t !== type)
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedQuestions(dummyGeneratedQuestions);
      setIsGenerating(false);
      setStep('review');
    }, 3000);
  };

  const handleQuestionToggle = (questionId: string, selected: boolean) => {
    setGeneratedQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, selected } : q
    ));
  };

  const handleRegenerateQuestion = (questionId: string) => {
    console.log('Regenerating question:', questionId);
    // In a real app, this would call the AI API to regenerate the specific question
  };

  const handleImportSelected = () => {
    const selectedQuestions = generatedQuestions.filter(q => q.selected);
    console.log('Importing selected questions:', selectedQuestions);
    onClose();
    resetModal();
  };

  const resetModal = () => {
    setStep('setup');
    setGeneratedQuestions([]);
    setSetupData({
      topics: '',
      questionTypes: [],
      difficulty: '',
      quantity: 5,
      context: ''
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success-light text-success-dark border-success';
      case 'Medium': return 'bg-warning-light text-warning-dark border-warning';
      case 'Hard': return 'bg-destructive-light text-destructive-dark border-destructive';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const selectedCount = generatedQuestions.filter(q => q.selected).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {step === 'setup' ? 'Generate Questions with AI' : 'Review Generated Questions'}
          </DialogTitle>
        </DialogHeader>

        {step === 'setup' && (
          <div className="space-y-6 py-4">
            <Card className="bg-primary-light/20 border-primary-light">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">AI-Powered Question Generation</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Provide the topics and requirements, and our AI will generate high-quality questions for your assessments.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topics" className="font-semibold">Topics *</Label>
                  <Textarea
                    id="topics"
                    placeholder="e.g., React Hooks, JavaScript ES6, Async Programming"
                    value={setupData.topics}
                    onChange={(e) => handleInputChange('topics', e.target.value)}
                    className="min-h-[80px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter topics separated by commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Question Types *</Label>
                  <div className="space-y-2">
                    {questionTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          checked={setupData.questionTypes.includes(type.value)}
                          onCheckedChange={(checked) => 
                            handleQuestionTypeToggle(type.value, checked as boolean)
                          }
                        />
                        <Label className="text-sm font-semibold">{type.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Difficulty Level</Label>
                  <Select value={setupData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty or leave blank for mixed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Mixed Difficulty</SelectItem>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="font-semibold">Number of Questions</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="20"
                    value={setupData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context" className="font-semibold">Additional Context (Optional)</Label>
                  <Textarea
                    id="context"
                    placeholder="Any specific requirements or context for the questions..."
                    value={setupData.context}
                    onChange={(e) => handleInputChange('context', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={!setupData.topics || setupData.questionTypes.length === 0 || isGenerating}
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
        )}

        {step === 'review' && (
          <div className="space-y-6 py-4">
            {/* Summary */}
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

            {/* Generated Questions */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedQuestions.map((question) => (
                <Card key={question.id} className={question.selected ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={question.selected}
                        onCheckedChange={(checked) => 
                          handleQuestionToggle(question.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{question.type}</Badge>
                          <Badge className={getDifficultyColor(question.difficulty)} variant="outline">
                            {question.difficulty}
                          </Badge>
                          <Badge variant="secondary">{question.topic}</Badge>
                        </div>
                        
                        <p className="font-medium text-sm mb-2">{question.question}</p>
                        
                        {question.options && (
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
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerateQuestion(question.id)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep('setup')}>
                Back to Setup
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImportSelected}
                  disabled={selectedCount === 0}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Import {selectedCount} Questions
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerationModal;
