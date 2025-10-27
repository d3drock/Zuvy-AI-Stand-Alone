'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QuestionEditor } from '@/components/adaptive-assessment/QuestionEditor';
import { AIQuestionGenerator } from '@/components/adaptive-assessment/AIQuestionGenerator';
import { mockAdaptiveQuestions } from '@/types/mock-adaptive-data';
import { AdaptiveQuestion } from '@/types/adaptive-assessment';
import { cn } from '@/lib/utils';

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<AdaptiveQuestion[]>(mockAdaptiveQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<AdaptiveQuestion | undefined>();
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');

  // Get unique topics
  const topics = Array.from(new Set(questions.map((q) => q.topic)));

  // Filter questions
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.questionText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === 'all' || question.topic === topicFilter;
    const matchesDifficulty =
      difficultyFilter === 'all' ||
      (difficultyFilter === 'easy' && question.difficulty <= 3) ||
      (difficultyFilter === 'medium' && question.difficulty >= 4 && question.difficulty <= 7) ||
      (difficultyFilter === 'hard' && question.difficulty >= 8);
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter;

    return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus;
  });

  const handleCreateQuestion = () => {
    setSelectedQuestion(undefined);
    setEditorMode('create');
    setEditorOpen(true);
  };

  const handleEditQuestion = (question: AdaptiveQuestion) => {
    setSelectedQuestion(question);
    setEditorMode('edit');
    setEditorOpen(true);
  };

  const handleDuplicateQuestion = (question: AdaptiveQuestion) => {
    const duplicated = {
      ...question,
      id: `q${Date.now()}`,
      title: `${question.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setQuestions([...questions, duplicated]);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    }
  };

  const handleSaveQuestion = (questionData: Partial<AdaptiveQuestion>) => {
    if (editorMode === 'create') {
      const newQuestion: AdaptiveQuestion = {
        ...questionData,
        id: `q${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as AdaptiveQuestion;
      setQuestions([...questions, newQuestion]);
    } else if (selectedQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === selectedQuestion.id
            ? { ...q, ...questionData, updatedAt: new Date().toISOString() }
            : q
        )
      );
    }
  };

  const handleAIGeneratedQuestions = (generatedQuestions: AdaptiveQuestion[]) => {
    setQuestions([...questions, ...generatedQuestions]);
  };

  const getDifficultyBadge = (difficulty: number) => {
    if (difficulty <= 3) return <Badge className="bg-green-500">Easy</Badge>;
    if (difficulty <= 7) return <Badge className="bg-yellow-500">Medium</Badge>;
    return <Badge className="bg-red-500">Hard</Badge>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'draft':
        return 'bg-warning text-warning-foreground';
      case 'archived':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-heading text-h5 text-foreground mb-2">
              Question Bank
            </h1>
            <p className="text-body2 text-muted-foreground">
              Manage your adaptive assessment questions
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setAiGeneratorOpen(true)}
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary/10"
            >
              <Sparkles className="h-4 w-4" />
              AI Generate
            </Button>
            <Button onClick={handleCreateQuestion} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Question
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Topic Filter */}
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Difficulty Filter */}
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulty</SelectItem>
              <SelectItem value="easy">Easy (1-3)</SelectItem>
              <SelectItem value="medium">Medium (4-7)</SelectItem>
              <SelectItem value="hard">Hard (8-10)</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Total Questions</p>
          <p className="text-h5 font-semibold">{questions.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Active</p>
          <p className="text-h5 font-semibold text-success">
            {questions.filter((q) => q.status === 'active').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Draft</p>
          <p className="text-h5 font-semibold text-warning">
            {questions.filter((q) => q.status === 'draft').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-body2 text-muted-foreground mb-1">Topics</p>
          <p className="text-h5 font-semibold">{topics.length}</p>
        </Card>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-body1 font-semibold mb-2">
              No questions found
            </h3>
            <p className="text-body2 text-muted-foreground">
              Try adjusting your filters or create a new question
            </p>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id} className="p-6 hover:shadow-4dp transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-heading text-body1 font-semibold mb-1">
                        {question.title}
                      </h3>
                      <p className="text-body2 text-muted-foreground line-clamp-2">
                        {question.questionText}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{question.topic}</Badge>
                    {question.subtopic && (
                      <Badge variant="outline">{question.subtopic}</Badge>
                    )}
                    {getDifficultyBadge(question.difficulty)}
                    <Badge className={getStatusColor(question.status)}>
                      {question.status}
                    </Badge>
                    <Badge variant="outline">
                      {question.questionType === 'single-answer'
                        ? 'Single Answer'
                        : 'Multiple Answer'}
                    </Badge>
                    <span className="text-body2 text-muted-foreground">
                      {question.options.length} options
                    </span>
                    <span className="text-body2 text-muted-foreground">
                      ~{Math.ceil(question.estimatedTime / 60)} min
                    </span>
                  </div>

                  {/* Tags */}
                  {question.tags && question.tags.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditQuestion(question)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateQuestion(question)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Question Editor Dialog */}
      <QuestionEditor
        question={selectedQuestion}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSave={handleSaveQuestion}
        mode={editorMode}
      />

      {/* AI Question Generator Dialog */}
      <AIQuestionGenerator
        open={aiGeneratorOpen}
        onOpenChange={setAiGeneratorOpen}
        onQuestionsGenerated={handleAIGeneratedQuestions}
      />
    </div>
  );
}
