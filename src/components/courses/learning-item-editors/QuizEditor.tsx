'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Minus, Search, X, Check } from 'lucide-react';
import { useUnsavedChanges } from '../curriculum/useUnsavedChanges';
import { UnsavedChangesModal } from '../curriculum/UnsavedChangesModal';

// Mock data for content bank MCQ questions
const MOCK_MCQ_QUESTIONS = [
  {
    id: 'mcq-001',
    title: 'JavaScript Variable Declaration',
    difficulty: 'Easy' as const,
    topics: ['JavaScript', 'Variables'],
    question: 'Which of the following is the correct way to declare a variable in JavaScript?',
    image: null,
    options: [
      { id: 'opt-1', text: 'var myVariable = 5;', isCorrect: true },
      { id: 'opt-2', text: 'variable myVariable = 5;', isCorrect: false },
      { id: 'opt-3', text: 'v myVariable = 5;', isCorrect: false },
      { id: 'opt-4', text: 'declare myVariable = 5;', isCorrect: false }
    ]
  },
  {
    id: 'mcq-002',
    title: 'React State Management',
    difficulty: 'Easy' as const,
    topics: ['React', 'State'],
    question: 'What hook is used to manage state in functional React components?',
    image: null,
    options: [
      { id: 'opt-1', text: 'useState', isCorrect: true },
      { id: 'opt-2', text: 'useEffect', isCorrect: false },
      { id: 'opt-3', text: 'useContext', isCorrect: false },
      { id: 'opt-4', text: 'useReducer', isCorrect: false }
    ]
  },
  {
    id: 'mcq-003',
    title: 'CSS Flexbox Layout',
    difficulty: 'Medium' as const,
    topics: ['CSS', 'Layout'],
    question: 'Which CSS property is used to change the direction of flex items?',
    image: null,
    options: [
      { id: 'opt-1', text: 'flex-direction', isCorrect: true },
      { id: 'opt-2', text: 'flex-flow', isCorrect: false },
      { id: 'opt-3', text: 'align-items', isCorrect: false },
      { id: 'opt-4', text: 'justify-content', isCorrect: false }
    ]
  },
  {
    id: 'mcq-004',
    title: 'Node.js Modules',
    difficulty: 'Medium' as const,
    topics: ['Node.js', 'Modules'],
    question: 'How do you import a module in Node.js using CommonJS?',
    image: null,
    options: [
      { id: 'opt-1', text: 'const module = require("module-name")', isCorrect: true },
      { id: 'opt-2', text: 'import module from "module-name"', isCorrect: false },
      { id: 'opt-3', text: 'include module "module-name"', isCorrect: false },
      { id: 'opt-4', text: 'use module "module-name"', isCorrect: false }
    ]
  },
  {
    id: 'mcq-005',
    title: 'Database Normalization',
    difficulty: 'Hard' as const,
    topics: ['Database', 'Normalization'],
    question: 'What is the main purpose of database normalization?',
    image: null,
    options: [
      { id: 'opt-1', text: 'To reduce data redundancy and improve data integrity', isCorrect: true },
      { id: 'opt-2', text: 'To increase query performance', isCorrect: false },
      { id: 'opt-3', text: 'To reduce storage space', isCorrect: false },
      { id: 'opt-4', text: 'To simplify database design', isCorrect: false }
    ]
  },
  {
    id: 'mcq-006',
    title: 'TypeScript Interfaces',
    difficulty: 'Medium' as const,
    topics: ['TypeScript', 'Interfaces'],
    question: 'What is the correct syntax to define an optional property in a TypeScript interface?',
    image: null,
    options: [
      { id: 'opt-1', text: 'propertyName?: type', isCorrect: true },
      { id: 'opt-2', text: 'propertyName: type?', isCorrect: false },
      { id: 'opt-3', text: 'optional propertyName: type', isCorrect: false },
      { id: 'opt-4', text: '?propertyName: type', isCorrect: false }
    ]
  },
  {
    id: 'mcq-007',
    title: 'HTTP Status Codes',
    difficulty: 'Easy' as const,
    topics: ['HTTP', 'Web APIs'],
    question: 'Which HTTP status code indicates that a resource was successfully created?',
    image: null,
    options: [
      { id: 'opt-1', text: '201 Created', isCorrect: true },
      { id: 'opt-2', text: '200 OK', isCorrect: false },
      { id: 'opt-3', text: '204 No Content', isCorrect: false },
      { id: 'opt-4', text: '202 Accepted', isCorrect: false }
    ]
  },
  {
    id: 'mcq-008',
    title: 'Algorithm Complexity',
    difficulty: 'Hard' as const,
    topics: ['Algorithms', 'Big O'],
    question: 'What is the time complexity of binary search in a sorted array?',
    image: null,
    options: [
      { id: 'opt-1', text: 'O(log n)', isCorrect: true },
      { id: 'opt-2', text: 'O(n)', isCorrect: false },
      { id: 'opt-3', text: 'O(n²)', isCorrect: false },
      { id: 'opt-4', text: 'O(1)', isCorrect: false }
    ]
  },
  {
    id: 'mcq-009',
    title: 'Git Version Control',
    difficulty: 'Easy' as const,
    topics: ['Git', 'Version Control'],
    question: 'Which Git command is used to create a new branch?',
    image: null,
    options: [
      { id: 'opt-1', text: 'git checkout -b branch-name', isCorrect: true },
      { id: 'opt-2', text: 'git create branch-name', isCorrect: false },
      { id: 'opt-3', text: 'git new branch-name', isCorrect: false },
      { id: 'opt-4', text: 'git branch create branch-name', isCorrect: false }
    ]
  },
  {
    id: 'mcq-010',
    title: 'REST API Design',
    difficulty: 'Medium' as const,
    topics: ['REST API', 'Web Development'],
    question: 'Which HTTP method should be used to update a partial resource in a REST API?',
    image: null,
    options: [
      { id: 'opt-1', text: 'PATCH', isCorrect: true },
      { id: 'opt-2', text: 'PUT', isCorrect: false },
      { id: 'opt-3', text: 'POST', isCorrect: false },
      { id: 'opt-4', text: 'UPDATE', isCorrect: false }
    ]
  }
];

// Define the quiz data structure
export interface QuizData {
  id?: string;
  title: string;
  description?: string;
  selectedQuestions?: typeof MOCK_MCQ_QUESTIONS;
  questionIds?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topics?: string[];
  timeLimit?: number;
  randomizeQuestions?: boolean;
  allowMultipleAttempts?: boolean;
}

interface QuizEditorProps {
  initialData?: QuizData;
  mode: 'create' | 'edit';
  onSave: (data: QuizData) => void;
  onCancel: () => void;
}

const DEFAULT_QUIZ_DATA: QuizData = {
  title: '',
  selectedQuestions: [],
};

interface QuestionPreviewModalProps {
  question: typeof MOCK_MCQ_QUESTIONS[0];
  isOpen: boolean;
  onClose: () => void;
}

function QuestionPreviewModal({ question, isOpen, onClose }: QuestionPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{question.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={
                question.difficulty === 'Easy' ? 'default' :
                question.difficulty === 'Medium' ? 'secondary' : 'destructive'
              }>
                {question.difficulty}
              </Badge>
              {question.topics.map(topic => (
                <Badge key={topic} variant="outline">{topic}</Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Question</h3>
              <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded border">
                {question.question}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Answer Options</h3>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div key={option.id} className={`border rounded p-3 flex items-center gap-3 ${
                    option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1 text-sm">{option.text}</div>
                    {option.isCorrect && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-xs font-medium">Correct</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * QuizEditor
 *
 * Editor component for selecting MCQ questions from content bank with 4:6 split layout.
 * Left side shows searchable/filterable list, right side shows selected questions.
 */
export function QuizEditor({
  initialData = DEFAULT_QUIZ_DATA,
  mode,
  onSave,
  onCancel,
}: QuizEditorProps) {
  const [quizData, setQuizData] = useState<QuizData>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [previewQuestion, setPreviewQuestion] = useState<typeof MOCK_MCQ_QUESTIONS[0] | null>(null);

  const unsavedChanges = useUnsavedChanges();

  // Handle input changes
  const handleInputChange = (field: keyof QuizData, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
    unsavedChanges.markAsUnsaved();
  };

  // Watch for data changes to mark as unsaved
  useEffect(() => {
    const hasChanges = JSON.stringify(quizData) !== JSON.stringify(initialData);
    if (hasChanges) {
      unsavedChanges.markAsUnsaved();
    }
  }, [quizData, initialData, unsavedChanges]);

  // Get unique topics and difficulties for filters
  const allTopics = Array.from(new Set(MOCK_MCQ_QUESTIONS.flatMap(q => q.topics)));
  const allDifficulties = Array.from(new Set(MOCK_MCQ_QUESTIONS.map(q => q.difficulty)));

  // Filter questions based on search and filters
  const filteredQuestions = MOCK_MCQ_QUESTIONS.filter(question => {
    const matchesSearch = !searchTerm ||
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.question.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTopic = !topicFilter || question.topics.includes(topicFilter);
    const matchesDifficulty = !difficultyFilter || question.difficulty === difficultyFilter;

    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  // Handle question selection
  const handleSelectQuestion = (question: typeof MOCK_MCQ_QUESTIONS[0]) => {
    const updatedQuestions = [...(quizData.selectedQuestions || []), question];
    handleInputChange('selectedQuestions', updatedQuestions);
  };

  // Handle question deselection
  const handleDeselectQuestion = (questionId: string) => {
    const updatedQuestions = (quizData.selectedQuestions || []).filter(q => q.id !== questionId);
    handleInputChange('selectedQuestions', updatedQuestions);
  };

  // Check if question is selected
  const isQuestionSelected = (questionId: string) => {
    return (quizData.selectedQuestions || []).some(q => q.id === questionId);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      onSave(quizData);
      unsavedChanges.markAsSaved();
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  // Handle cancel with unsaved changes check
  const handleCancel = () => {
    if (unsavedChanges.hasUnsavedChanges) {
      unsavedChanges.attemptAction(onCancel);
    } else {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="p-6 h-full flex flex-col">
          {/* Title - Underlined style as per design specs */}
          <div className="mb-6">
            <input
              type="text"
              value={quizData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Quiz Title"
              className="text-xl font-semibold bg-transparent border-none outline-none border-b-2 border-border focus:border-primary transition-colors w-full pb-1"
              style={{ fontSize: '1.25rem' }} // h5 size as per specs
            />
          </div>

          {/* Search and Filters */}
          <div className="mb-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Topics</SelectItem>
                  {allTopics.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Difficulties</SelectItem>
                  {allDifficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4:6 Split Layout */}
          <div className="flex-1 flex gap-6 min-h-0">
            {/* Left Panel (4/10) - Questions List */}
            <div className="w-2/5 border rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-sm">Content Bank ({filteredQuestions.length} questions)</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {filteredQuestions.map(question => (
                    <div
                      key={question.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        isQuestionSelected(question.id)
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">{question.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{question.question}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              question.difficulty === 'Easy' ? 'default' :
                              question.difficulty === 'Medium' ? 'secondary' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {question.difficulty}
                          </Badge>
                          {question.topics.slice(0, 2).map(topic => (
                            <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                          ))}
                          {question.topics.length > 2 && (
                            <span className="text-xs text-gray-500">+{question.topics.length - 2}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewQuestion(question)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>

                          {isQuestionSelected(question.id) ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeselectQuestion(question.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectQuestion(question)}
                              className="text-xs text-primary hover:text-primary/80"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel (6/10) - Selected Questions */}
            <div className="w-3/5 border rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-sm">Selected Questions ({(quizData.selectedQuestions || []).length})</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {(quizData.selectedQuestions || []).length > 0 ? (
                  <div className="space-y-4">
                    {(quizData.selectedQuestions || []).map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">Question {index + 1}</span>
                                <Badge variant={
                                  question.difficulty === 'Easy' ? 'default' :
                                  question.difficulty === 'Medium' ? 'secondary' : 'destructive'
                                } className="text-xs">
                                  {question.difficulty}
                                </Badge>
                                {question.topics.map(topic => (
                                  <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                                ))}
                              </div>
                              <h4 className="font-medium text-sm">{question.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{question.question}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeselectQuestion(question.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Minus className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-500">Answer Options:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {question.options.slice(0, 2).map((option, optIndex) => (
                                <div key={option.id} className={`text-xs p-2 rounded border ${
                                  option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                                }`}>
                                  <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option.text}
                                  {option.isCorrect && <span className="text-green-600 ml-2">✓</span>}
                                </div>
                              ))}
                              {question.options.length > 2 && (
                                <div className="text-xs text-gray-500 text-center py-1">
                                  +{question.options.length - 2} more options
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-sm">Select questions from the content bank</p>
                      <p className="text-xs mt-1">Multiple questions can be added with no upper limit</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with CTA buttons */}
      <div className="flex justify-between items-center p-6 border-t bg-background">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {mode === 'create' ? 'Add Quiz' : 'Edit Quiz'}
        </Button>
      </div>

      {/* Preview Modal */}
      {previewQuestion && (
        <QuestionPreviewModal
          question={previewQuestion}
          isOpen={!!previewQuestion}
          onClose={() => setPreviewQuestion(null)}
        />
      )}

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={unsavedChanges.showWarningModal}
        onClose={unsavedChanges.closeModal}
        onDiscard={unsavedChanges.discardChanges}
        onSave={() => unsavedChanges.saveAndContinue(handleSubmit)}
      />
    </div>
  );
}