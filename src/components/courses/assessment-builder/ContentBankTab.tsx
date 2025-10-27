
'use client'

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Question } from './types';

interface ContentBankTabProps {
  onQuestionSelect: (question: Question) => void;
}

const ContentBankTab = ({ onQuestionSelect }: ContentBankTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // Mock questions data
  const availableQuestions: Question[] = [
    {
      id: '1',
      type: 'MCQ',
      title: 'What is the correct way to declare a variable in JavaScript?',
      difficulty: 'Easy',
      topic: 'JavaScript Basics',
      points: 5,
      options: ['var x = 5', 'let x = 5', 'const x = 5', 'All of the above'],
      correctAnswers: ['All of the above']
    },
    {
      id: '2',
      type: 'Coding',
      title: 'Implement a function to reverse a string',
      difficulty: 'Medium',
      topic: 'Algorithms',
      points: 15,
      description: 'Write a function that takes a string and returns it reversed',
      testCases: [
        { id: '1', input: 'hello', expectedOutput: 'olleh', isHidden: false },
        { id: '2', input: 'world', expectedOutput: 'dlrow', isHidden: true }
      ]
    },
    {
      id: '3',
      type: 'Open Ended',
      title: 'Explain the concept of closures in JavaScript',
      difficulty: 'Hard',
      topic: 'JavaScript Advanced',
      points: 10,
      description: 'Provide a detailed explanation of closures with examples',
      expectedAnswer: 'A closure is a function that has access to variables in its outer scope...'
    },
    {
      id: '4',
      type: 'MCQ',
      title: 'Which of the following is NOT a JavaScript data type?',
      difficulty: 'Easy',
      topic: 'JavaScript Basics',
      points: 3,
      options: ['string', 'boolean', 'integer', 'undefined'],
      correctAnswers: ['integer']
    }
  ];

  const filteredQuestions = availableQuestions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success-light text-success-dark border-success';
      case 'Medium': return 'bg-warning-light text-warning-dark border-warning';
      case 'Hard': return 'bg-destructive-light text-destructive-dark border-destructive';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="MCQ">MCQ</SelectItem>
            <SelectItem value="Coding">Coding</SelectItem>
            <SelectItem value="Open Ended">Open Ended</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="p-4 border rounded-lg hover:bg-primary-light cursor-pointer transition-colors"
            onClick={() => onQuestionSelect(question)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-sm">{question.title}</h4>
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{question.type}</Badge>
              <span>{question.topic}</span>
              <span>•</span>
              <span>{question.points} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentBankTab;
