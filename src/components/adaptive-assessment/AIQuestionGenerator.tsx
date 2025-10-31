'use client';

import { useState } from 'react';
import { Sparkles, Upload, FileText, Settings, Check, X, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { AdaptiveQuestion, QuestionDifficulty } from '@/types/adaptive-assessment';
import { cn } from '@/lib/utils';

interface AIQuestionGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionsGenerated: (questions: AdaptiveQuestion[]) => void;
}

interface GenerationConfig {
  mode: 'single' | 'bulk' | 'curriculum';
  topic: string;
  subtopic?: string;
  difficultyMin: QuestionDifficulty;
  difficultyMax: QuestionDifficulty;
  questionType: 'single-answer' | 'multiple-answer' | 'mixed';
  count: number;
  learningObjectives?: string;
  referenceText?: string;
  aiProvider: 'openai' | 'anthropic' | 'gemini' | 'mock';
}

interface GeneratedQuestion extends Omit<Partial<AdaptiveQuestion>, 'status'> {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  aiConfidence?: number;
}

export function AIQuestionGenerator({
  open,
  onOpenChange,
  onQuestionsGenerated,
}: AIQuestionGeneratorProps) {
  const [config, setConfig] = useState<GenerationConfig>({
    mode: 'single',
    topic: '',
    difficultyMin: 4,
    difficultyMax: 7,
    questionType: 'single-answer',
    count: 5,
    aiProvider: 'mock',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState<'config' | 'review'>('config');
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate AI generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockQuestions: GeneratedQuestion[] = Array.from({ length: config.count }, (_, i) => ({
      id: `ai-gen-${Date.now()}-${i}`,
      title: `AI Generated: ${config.topic} Question ${i + 1}`,
      questionText: `What is the best practice for ${config.topic.toLowerCase()} in modern web development?`,
      questionType: config.questionType === 'mixed'
        ? (i % 2 === 0 ? 'single-answer' : 'multiple-answer')
        : config.questionType,
      options: [
        { id: 'opt1', text: 'Option A - Correct approach', isCorrect: true },
        { id: 'opt2', text: 'Option B - Alternative approach', isCorrect: false },
        { id: 'opt3', text: 'Option C - Incorrect approach', isCorrect: false },
        { id: 'opt4', text: 'Option D - Outdated approach', isCorrect: false },
      ],
      correctAnswerIds: ['opt1'],
      difficulty: Math.floor(Math.random() * (config.difficultyMax - config.difficultyMin + 1)) + config.difficultyMin as QuestionDifficulty,
      topic: config.topic,
      subtopic: config.subtopic,
      explanation: `This is the correct answer because it follows modern best practices for ${config.topic}.`,
      conceptTested: config.topic,
      relatedResources: [
        {
          id: `resource-${i}`,
          title: `${config.topic} Documentation`,
          url: `https://example.com/docs/${config.topic.toLowerCase()}`,
          type: 'documentation' as const,
        },
      ],
      tags: [config.topic, 'AI Generated'],
      status: 'pending' as const,
      aiConfidence: Math.random() * 30 + 70, // 70-100%
      estimatedTime: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setGeneratedQuestions(mockQuestions);
    setIsGenerating(false);
    setCurrentStep('review');
  };

  const handleAcceptQuestion = (questionId: string) => {
    setGeneratedQuestions(prev =>
      prev.map(q => q.id === questionId ? { ...q, status: 'accepted' } : q)
    );
  };

  const handleRejectQuestion = (questionId: string) => {
    setGeneratedQuestions(prev =>
      prev.map(q => q.id === questionId ? { ...q, status: 'rejected' } : q)
    );
  };

  const handleRegenerateQuestion = async (questionId: string) => {
    // Simulate regeneration
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newQuestion: GeneratedQuestion = {
      ...generatedQuestions.find(q => q.id === questionId)!,
      questionText: `Regenerated: What is another approach to ${config.topic.toLowerCase()}?`,
      aiConfidence: Math.random() * 30 + 70,
      status: 'pending',
    };

    setGeneratedQuestions(prev =>
      prev.map(q => q.id === questionId ? newQuestion : q)
    );
    setIsGenerating(false);
  };

  const handleAcceptAll = () => {
    const acceptedQuestions = generatedQuestions
      .filter(q => q.status !== 'rejected')
      .map(q => ({
        ...q,
        status: 'active',
        id: `q${Date.now()}-${Math.random()}`,
      } as AdaptiveQuestion));

    onQuestionsGenerated(acceptedQuestions);
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setGeneratedQuestions([]);
    setCurrentStep('config');
    setConfig({
      mode: 'single',
      topic: '',
      difficultyMin: 4,
      difficultyMax: 7,
      questionType: 'single-answer',
      count: 5,
      aiProvider: 'mock',
    });
  };

  const getDifficultyBadge = (difficulty: number) => {
    if (difficulty <= 3) return <Badge className="bg-green-500">Easy</Badge>;
    if (difficulty <= 7) return <Badge className="bg-yellow-500">Medium</Badge>;
    return <Badge className="bg-red-500">Hard</Badge>;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Question Generator
          </DialogTitle>
          <DialogDescription>
            Generate questions automatically using AI based on your curriculum and requirements
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'config' ? (
          <div className="space-y-6 mt-4">
            <Tabs value={config.mode} onValueChange={(v) => setConfig({ ...config, mode: v as any })}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="single">Single Question</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Generate</TabsTrigger>
                <TabsTrigger value="curriculum">From Curriculum</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Topic *</Label>
                    <Input
                      placeholder="e.g., React Hooks"
                      value={config.topic}
                      onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Subtopic (Optional)</Label>
                    <Input
                      placeholder="e.g., useState, useEffect"
                      value={config.subtopic || ''}
                      onChange={(e) => setConfig({ ...config, subtopic: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Question Type</Label>
                    <Select value={config.questionType} onValueChange={(v) => setConfig({ ...config, questionType: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-answer">Single Answer</SelectItem>
                        <SelectItem value="multiple-answer">Multiple Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>AI Provider</Label>
                    <Select value={config.aiProvider} onValueChange={(v) => setConfig({ ...config, aiProvider: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mock">Mock (Demo)</SelectItem>
                        <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Difficulty Range: {config.difficultyMin} - {config.difficultyMax}</Label>
                  <div className="flex gap-4 items-center mt-2">
                    <span className="text-sm text-muted-foreground w-12">Min</span>
                    <Slider
                      value={[config.difficultyMin]}
                      onValueChange={(v) => setConfig({ ...config, difficultyMin: v[0] as QuestionDifficulty })}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">Max</span>
                    <Slider
                      value={[config.difficultyMax]}
                      onValueChange={(v) => setConfig({ ...config, difficultyMax: v[0] as QuestionDifficulty })}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Learning Objectives (Optional)</Label>
                  <Textarea
                    placeholder="Describe what students should learn from this question..."
                    value={config.learningObjectives || ''}
                    onChange={(e) => setConfig({ ...config, learningObjectives: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Reference Material (Optional)</Label>
                  <Textarea
                    placeholder="Paste relevant text, documentation, or context..."
                    value={config.referenceText || ''}
                    onChange={(e) => setConfig({ ...config, referenceText: e.target.value })}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Topic *</Label>
                    <Input
                      placeholder="e.g., JavaScript ES6"
                      value={config.topic}
                      onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={config.count}
                      onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Question Type Distribution</Label>
                    <Select value={config.questionType} onValueChange={(v) => setConfig({ ...config, questionType: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-answer">All Single Answer</SelectItem>
                        <SelectItem value="multiple-answer">All Multiple Answer</SelectItem>
                        <SelectItem value="mixed">Mixed Types</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>AI Provider</Label>
                    <Select value={config.aiProvider} onValueChange={(v) => setConfig({ ...config, aiProvider: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mock">Mock (Demo)</SelectItem>
                        <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Difficulty Range: {config.difficultyMin} - {config.difficultyMax}</Label>
                  <div className="flex gap-4 items-center mt-2">
                    <span className="text-sm text-muted-foreground w-12">Min</span>
                    <Slider
                      value={[config.difficultyMin]}
                      onValueChange={(v) => setConfig({ ...config, difficultyMin: v[0] as QuestionDifficulty })}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">Max</span>
                    <Slider
                      value={[config.difficultyMax]}
                      onValueChange={(v) => setConfig({ ...config, difficultyMax: v[0] as QuestionDifficulty })}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Reference Material (Optional)</Label>
                  <Textarea
                    placeholder="Paste relevant text, documentation, or context for generating questions..."
                    value={config.referenceText || ''}
                    onChange={(e) => setConfig({ ...config, referenceText: e.target.value })}
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4 mt-4">
                <Card className="p-6 border-2 border-dashed border-muted-foreground/25 bg-muted/10">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Upload Curriculum Document</h3>
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Upload a PDF, DOCX, or text file containing your curriculum
                    </p>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Questions per Topic</Label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={config.count}
                      onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                  <div>
                    <Label>AI Provider</Label>
                    <Select value={config.aiProvider} onValueChange={(v) => setConfig({ ...config, aiProvider: v as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mock">Mock (Demo)</SelectItem>
                        <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                        <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!config.topic || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Questions
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Review Generated Questions</h3>
                <p className="text-sm text-muted-foreground">
                  {generatedQuestions.filter(q => q.status === 'accepted').length} accepted, {' '}
                  {generatedQuestions.filter(q => q.status === 'rejected').length} rejected, {' '}
                  {generatedQuestions.filter(q => q.status === 'pending').length} pending review
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep('config')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Back to Config
                </Button>
                <Button onClick={handleAcceptAll} disabled={generatedQuestions.every(q => q.status === 'rejected')}>
                  <Check className="h-4 w-4 mr-2" />
                  Accept Selected ({generatedQuestions.filter(q => q.status !== 'rejected').length})
                </Button>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {generatedQuestions.map((question) => (
                <Card
                  key={question.id}
                  className={cn(
                    'p-6 transition-all',
                    question.status === 'accepted' && 'border-green-500 bg-green-50',
                    question.status === 'rejected' && 'border-red-500 bg-red-50 opacity-50'
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getDifficultyBadge(question.difficulty!)}
                          <Badge variant="outline">{question.questionType}</Badge>
                          <span className={cn('text-sm font-medium', getConfidenceColor(question.aiConfidence!))}>
                            {question.aiConfidence!.toFixed(0)}% confidence
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1">{question.title}</h4>
                        <p className="text-sm text-muted-foreground">{question.questionText}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant={question.status === 'accepted' ? 'default' : 'outline'}
                          onClick={() => handleAcceptQuestion(question.id)}
                          disabled={question.status === 'rejected'}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant={question.status === 'rejected' ? 'destructive' : 'outline'}
                          onClick={() => handleRejectQuestion(question.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleRegenerateQuestion(question.id)}
                          disabled={isGenerating}
                        >
                          <RefreshCw className={cn('h-4 w-4', isGenerating && 'animate-spin')} />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Options:</p>
                      {question.options?.map((option, idx) => (
                        <div
                          key={option.id}
                          className={cn(
                            'p-2 rounded text-sm',
                            option.isCorrect ? 'bg-green-100 border border-green-500' : 'bg-muted'
                          )}
                        >
                          {String.fromCharCode(65 + idx)}. {option.text}
                          {option.isCorrect && <Badge className="ml-2 bg-green-500">Correct</Badge>}
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
