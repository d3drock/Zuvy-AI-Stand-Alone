'use client'

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Minus, Search, X } from 'lucide-react';
import { useUnsavedChanges } from '../curriculum/useUnsavedChanges';
import { UnsavedChangesModal } from '../curriculum/UnsavedChangesModal';

// Mock data for content bank coding problems
const MOCK_CODING_PROBLEMS = [
  {
    id: 'cp-001',
    title: 'Two Sum',
    difficulty: 'Easy' as const,
    topics: ['Arrays', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    problemStatement: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

**Example 2:**
Input: nums = [3,2,4], target = 6
Output: [1,2]`,
    constraints: `• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.`,
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' }
    ]
  },
  {
    id: 'cp-002',
    title: 'Valid Parentheses',
    difficulty: 'Easy' as const,
    topics: ['String', 'Stack'],
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    problemStatement: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
Input: s = "()"
Output: true

**Example 2:**
Input: s = "()[]{}"
Output: true

**Example 3:**
Input: s = "(]"
Output: false`,
    constraints: `• 1 <= s.length <= 10^4
• s consists of parentheses only '()[]{}'.`,
    testCases: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ]
  },
  {
    id: 'cp-003',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy' as const,
    topics: ['Linked List', 'Recursion'],
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.',
    problemStatement: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

**Example 1:**
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

**Example 2:**
Input: list1 = [], list2 = []
Output: []

**Example 3:**
Input: list1 = [], list2 = [0]
Output: [0]`,
    constraints: `• The number of nodes in both lists is in the range [0, 50].
• -100 <= Node.val <= 100
• Both list1 and list2 are sorted in non-decreasing order.`,
    testCases: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' }
    ]
  },
  {
    id: 'cp-004',
    title: 'Container With Most Water',
    difficulty: 'Medium' as const,
    topics: ['Arrays', 'Two Pointers'],
    description: 'Given n non-negative integers representing heights, find two lines that together with the x-axis form a container with the most water.',
    problemStatement: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that, together with the x-axis, form a container that contains the most water.

Return the maximum amount of water a container can store.

**Notice** that you may not slant the container.

**Example 1:**
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.`,
    constraints: `• n == height.length
• 2 <= n <= 10^5
• 0 <= height[i] <= 10^4`,
    testCases: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' }
    ]
  },
  {
    id: 'cp-005',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium' as const,
    topics: ['String', 'Dynamic Programming'],
    description: 'Given a string s, return the longest palindromic substring in s.',
    problemStatement: `Given a string s, return the longest palindromic substring in s.

**Example 1:**
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.

**Example 2:**
Input: s = "cbbd"
Output: "bb"`,
    constraints: `• 1 <= s.length <= 1000
• s consist of only digits and English letters.`,
    testCases: [
      { input: 's = "babad"', output: '"bab"' },
      { input: 's = "cbbd"', output: '"bb"' }
    ]
  },
  {
    id: 'cp-006',
    title: 'N-Queens',
    difficulty: 'Hard' as const,
    topics: ['Backtracking', 'Arrays'],
    description: 'The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other.',
    problemStatement: `The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other.

Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.

Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.

**Example 1:**
Input: n = 4
Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above

**Example 2:**
Input: n = 1
Output: [["Q"]]`,
    constraints: `• 1 <= n <= 9`,
    testCases: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: 'n = 1', output: '[["Q"]]' }
    ]
  }
];

// Define the coding problem data structure
export interface CodingProblemData {
  id?: string;
  title: string;
  selectedProblem?: typeof MOCK_CODING_PROBLEMS[0];
}

interface CodingProblemEditorProps {
  initialData?: CodingProblemData;
  mode: 'create' | 'edit';
  onSave: (data: CodingProblemData) => void;
  onCancel: () => void;
}

const DEFAULT_CODING_PROBLEM_DATA: CodingProblemData = {
  title: '',
  selectedProblem: undefined,
};

interface ProblemPreviewModalProps {
  problem: typeof MOCK_CODING_PROBLEMS[0];
  isOpen: boolean;
  onClose: () => void;
}

function ProblemPreviewModal({ problem, isOpen, onClose }: ProblemPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{problem.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={
                problem.difficulty === 'Easy' ? 'default' :
                problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
              }>
                {problem.difficulty}
              </Badge>
              {problem.topics.map(topic => (
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
              <h3 className="font-semibold mb-2">Problem Statement</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">{problem.problemStatement}</div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Constraints</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">{problem.constraints}</div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Test Cases</h3>
              <div className="space-y-3">
                {problem.testCases.map((testCase, index) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="text-sm">
                      <div className="mb-1"><strong>Input:</strong> {testCase.input}</div>
                      <div><strong>Output:</strong> {testCase.output}</div>
                    </div>
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
 * CodingProblemEditor
 *
 * Editor component for selecting coding problems from content bank with 4:6 split layout.
 * Left side shows searchable/filterable list, right side shows selected problem details.
 */
export function CodingProblemEditor({
  initialData = DEFAULT_CODING_PROBLEM_DATA,
  mode,
  onSave,
  onCancel,
}: CodingProblemEditorProps) {
  const [codingProblemData, setCodingProblemData] = useState<CodingProblemData>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [previewProblem, setPreviewProblem] = useState<typeof MOCK_CODING_PROBLEMS[0] | null>(null);

  const unsavedChanges = useUnsavedChanges();

  // Handle input changes
  const handleInputChange = (field: keyof CodingProblemData, value: any) => {
    setCodingProblemData(prev => ({ ...prev, [field]: value }));
    unsavedChanges.markAsUnsaved();
  };

  // Watch for data changes to mark as unsaved
  useEffect(() => {
    const hasChanges = JSON.stringify(codingProblemData) !== JSON.stringify(initialData);
    if (hasChanges) {
      unsavedChanges.markAsUnsaved();
    }
  }, [codingProblemData, initialData, unsavedChanges]);

  // Get unique topics and difficulties for filters
  const allTopics = Array.from(new Set(MOCK_CODING_PROBLEMS.flatMap(p => p.topics)));
  const allDifficulties = Array.from(new Set(MOCK_CODING_PROBLEMS.map(p => p.difficulty)));

  // Filter problems based on search and filters
  const filteredProblems = MOCK_CODING_PROBLEMS.filter(problem => {
    const matchesSearch = !searchTerm ||
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTopic = !topicFilter || problem.topics.includes(topicFilter);
    const matchesDifficulty = !difficultyFilter || problem.difficulty === difficultyFilter;

    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  // Handle problem selection
  const handleSelectProblem = (problem: typeof MOCK_CODING_PROBLEMS[0]) => {
    handleInputChange('selectedProblem', problem);
  };

  // Handle problem deselection
  const handleDeselectProblem = () => {
    handleInputChange('selectedProblem', undefined);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      onSave(codingProblemData);
      unsavedChanges.markAsSaved();
    } catch (error) {
      console.error('Error saving coding problem:', error);
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
              value={codingProblemData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Coding Problem Title"
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
                    placeholder="Search coding problems..."
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
            {/* Left Panel (4/10) - Problems List */}
            <div className="w-2/5 border rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-sm">Content Bank ({filteredProblems.length} problems)</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {filteredProblems.map(problem => (
                    <div
                      key={problem.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        codingProblemData.selectedProblem?.id === problem.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">{problem.title}</h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{problem.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              problem.difficulty === 'Easy' ? 'default' :
                              problem.difficulty === 'Medium' ? 'secondary' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {problem.difficulty}
                          </Badge>
                          {problem.topics.slice(0, 2).map(topic => (
                            <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                          ))}
                          {problem.topics.length > 2 && (
                            <span className="text-xs text-gray-500">+{problem.topics.length - 2}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewProblem(problem)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>

                          {codingProblemData.selectedProblem?.id === problem.id ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleDeselectProblem}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <Minus className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectProblem(problem)}
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

            {/* Right Panel (6/10) - Selected Problem Details */}
            <div className="w-3/5 border rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-sm">Selected Problem</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {codingProblemData.selectedProblem ? (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{codingProblemData.selectedProblem.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={
                            codingProblemData.selectedProblem.difficulty === 'Easy' ? 'default' :
                            codingProblemData.selectedProblem.difficulty === 'Medium' ? 'secondary' : 'destructive'
                          }>
                            {codingProblemData.selectedProblem.difficulty}
                          </Badge>
                          {codingProblemData.selectedProblem.topics.map(topic => (
                            <Badge key={topic} variant="outline">{topic}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectProblem}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Problem Statement</h5>
                      <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded border whitespace-pre-line">
                        {codingProblemData.selectedProblem.problemStatement.substring(0, 500)}
                        {codingProblemData.selectedProblem.problemStatement.length > 500 && '...'}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Constraints</h5>
                      <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded border whitespace-pre-line">
                        {codingProblemData.selectedProblem.constraints}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Test Cases ({codingProblemData.selectedProblem.testCases.length})</h5>
                      <div className="space-y-2">
                        {codingProblemData.selectedProblem.testCases.slice(0, 2).map((testCase, index) => (
                          <div key={index} className="border rounded p-3 bg-gray-50">
                            <div className="text-sm">
                              <div className="mb-1"><strong>Input:</strong> {testCase.input}</div>
                              <div><strong>Output:</strong> {testCase.output}</div>
                            </div>
                          </div>
                        ))}
                        {codingProblemData.selectedProblem.testCases.length > 2 && (
                          <div className="text-sm text-gray-500 text-center py-2">
                            +{codingProblemData.selectedProblem.testCases.length - 2} more test cases
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-sm">Select a coding problem from the content bank</p>
                      <p className="text-xs mt-1">Only one problem can be selected at a time</p>
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
          {mode === 'create' ? 'Add Coding Problem' : 'Edit Coding Problem'}
        </Button>
      </div>

      {/* Preview Modal */}
      {previewProblem && (
        <ProblemPreviewModal
          problem={previewProblem}
          isOpen={!!previewProblem}
          onClose={() => setPreviewProblem(null)}
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