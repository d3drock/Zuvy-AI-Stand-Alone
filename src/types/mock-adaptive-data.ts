import {
  AdaptiveQuestion,
  AssessmentConfiguration,
  AssessmentSession,
  StudentMetrics,
  TopicPerformance,
  MentorInsight,
  QuestionDifficulty,
  ProficiencyLevel,
} from './adaptive-assessment';

// ==========================================
// Mock Questions
// ==========================================

export const mockAdaptiveQuestions: AdaptiveQuestion[] = [
  // JavaScript Questions - Difficulty 1-3 (Basic)
  {
    id: 'q1',
    title: 'JavaScript Basics - Variables',
    questionText: 'What keyword is used to declare a variable in JavaScript that can be reassigned?',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt1-1',
        text: 'const',
        isCorrect: false,
        distractorRationale: 'const creates a constant variable that cannot be reassigned',
      },
      {
        id: 'opt1-2',
        text: 'let',
        isCorrect: true,
      },
      {
        id: 'opt1-3',
        text: 'var',
        isCorrect: false,
        distractorRationale: 'While var can be reassigned, let is the modern ES6 way with block scope',
      },
      {
        id: 'opt1-4',
        text: 'variable',
        isCorrect: false,
        distractorRationale: 'variable is not a valid JavaScript keyword',
      },
    ],
    correctAnswerIds: ['opt1-2'],
    difficulty: 2,
    topic: 'JavaScript',
    subtopic: 'Variables & Data Types',
    tags: ['ES6', 'basics', 'syntax'],
    explanation: 'let is the modern ES6 keyword for declaring variables that can be reassigned and have block scope.',
    conceptTested: 'Understanding variable declaration keywords in JavaScript',
    estimatedTime: 30,
    relatedResources: [
      {
        id: 'res1',
        title: 'MDN: let statement',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let',
        type: 'documentation',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  {
    id: 'q2',
    title: 'React Basics - Components',
    questionText: 'What is the correct way to create a functional component in React?',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt2-1',
        text: 'function MyComponent() { return <div>Hello</div>; }',
        isCorrect: true,
      },
      {
        id: 'opt2-2',
        text: 'const MyComponent = <div>Hello</div>;',
        isCorrect: false,
        distractorRationale: 'This creates a JSX element, not a reusable component',
      },
      {
        id: 'opt2-3',
        text: 'class MyComponent { render() { return <div>Hello</div>; } }',
        isCorrect: false,
        distractorRationale: 'This is a class component syntax, not a functional component',
      },
      {
        id: 'opt2-4',
        text: 'component MyComponent() { return <div>Hello</div>; }',
        isCorrect: false,
        distractorRationale: 'component is not a valid JavaScript keyword',
      },
    ],
    correctAnswerIds: ['opt2-1'],
    difficulty: 3,
    topic: 'React',
    subtopic: 'Components',
    tags: ['functional-components', 'basics', 'JSX'],
    explanation: 'Functional components are JavaScript functions that return JSX. The function syntax is the standard way to create them.',
    conceptTested: 'Creating functional components in React',
    estimatedTime: 45,
    relatedResources: [
      {
        id: 'res2',
        title: 'React Docs: Your First Component',
        url: 'https://react.dev/learn/your-first-component',
        type: 'documentation',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  // Medium difficulty questions (4-6)
  {
    id: 'q3',
    title: 'JavaScript - Closures',
    questionText: 'What will be the output of this code?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt3-1',
        text: '0 1 2',
        isCorrect: false,
        distractorRationale: 'var has function scope, not block scope, so i is shared',
      },
      {
        id: 'opt3-2',
        text: '3 3 3',
        isCorrect: true,
      },
      {
        id: 'opt3-3',
        text: 'undefined undefined undefined',
        isCorrect: false,
        distractorRationale: 'i is defined, just has the final value from the loop',
      },
      {
        id: 'opt3-4',
        text: 'Error',
        isCorrect: false,
        distractorRationale: 'This code runs without errors',
      },
    ],
    correctAnswerIds: ['opt3-2'],
    difficulty: 5,
    topic: 'JavaScript',
    subtopic: 'Closures & Scope',
    tags: ['closures', 'async', 'var-vs-let'],
    explanation: 'By the time setTimeout callbacks execute, the loop has finished and i equals 3. Using let instead of var would create block scope and log 0 1 2.',
    conceptTested: 'Understanding closures and variable scope in asynchronous code',
    estimatedTime: 90,
    relatedResources: [
      {
        id: 'res3',
        title: 'JavaScript Closures Explained',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
        type: 'documentation',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  {
    id: 'q4',
    title: 'React - Hooks',
    questionText: 'When should you use useEffect with an empty dependency array []?',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt4-1',
        text: 'When you want the effect to run on every render',
        isCorrect: false,
        distractorRationale: 'Empty array means run once, not on every render',
      },
      {
        id: 'opt4-2',
        text: 'When you want the effect to run only once after initial mount',
        isCorrect: true,
      },
      {
        id: 'opt4-3',
        text: 'When you want to prevent the effect from running',
        isCorrect: false,
        distractorRationale: 'Empty array still runs once; removing useEffect would prevent it',
      },
      {
        id: 'opt4-4',
        text: 'When you want the effect to run before render',
        isCorrect: false,
        distractorRationale: 'useEffect runs after render, not before',
      },
    ],
    correctAnswerIds: ['opt4-2'],
    difficulty: 4,
    topic: 'React',
    subtopic: 'Hooks',
    tags: ['useEffect', 'lifecycle', 'dependencies'],
    explanation: 'An empty dependency array [] tells useEffect to run only once after the initial mount, similar to componentDidMount in class components.',
    conceptTested: 'Understanding useEffect dependency arrays',
    estimatedTime: 60,
    relatedResources: [
      {
        id: 'res4',
        title: 'React Docs: useEffect',
        url: 'https://react.dev/reference/react/useEffect',
        type: 'documentation',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  // Advanced questions (7-10)
  {
    id: 'q5',
    title: 'JavaScript - Event Loop',
    questionText: 'What is the order of execution?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt5-1',
        text: '1 4 2 3',
        isCorrect: false,
        distractorRationale: 'Microtasks (Promises) execute before macrotasks (setTimeout)',
      },
      {
        id: 'opt5-2',
        text: '1 4 3 2',
        isCorrect: true,
      },
      {
        id: 'opt5-3',
        text: '1 2 3 4',
        isCorrect: false,
        distractorRationale: 'Async operations execute after synchronous code',
      },
      {
        id: 'opt5-4',
        text: '1 3 4 2',
        isCorrect: false,
        distractorRationale: 'Synchronous code executes first before any async operations',
      },
    ],
    correctAnswerIds: ['opt5-2'],
    difficulty: 8,
    topic: 'JavaScript',
    subtopic: 'Event Loop & Async',
    tags: ['event-loop', 'promises', 'setTimeout', 'microtasks'],
    explanation: 'Synchronous code (1, 4) runs first. Then microtasks (Promise - 3) execute before macrotasks (setTimeout - 2).',
    conceptTested: 'Understanding the JavaScript event loop and task queue prioritization',
    estimatedTime: 120,
    relatedResources: [
      {
        id: 'res5',
        title: 'JavaScript Event Loop Explained',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop',
        type: 'documentation',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  {
    id: 'q6',
    title: 'Data Structures - Big O',
    questionText: 'What is the time complexity of searching for an element in a balanced Binary Search Tree?',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt6-1',
        text: 'O(1)',
        isCorrect: false,
        distractorRationale: 'O(1) is only possible with direct access like hash tables',
      },
      {
        id: 'opt6-2',
        text: 'O(log n)',
        isCorrect: true,
      },
      {
        id: 'opt6-3',
        text: 'O(n)',
        isCorrect: false,
        distractorRationale: 'O(n) would be linear search; BST is more efficient',
      },
      {
        id: 'opt6-4',
        text: 'O(n²)',
        isCorrect: false,
        distractorRationale: 'O(n²) is too slow; BST provides logarithmic search',
      },
    ],
    correctAnswerIds: ['opt6-2'],
    difficulty: 6,
    topic: 'Data Structures',
    subtopic: 'Binary Search Trees',
    tags: ['BST', 'time-complexity', 'big-o'],
    explanation: 'A balanced BST has O(log n) search complexity because it eliminates half the remaining elements at each step.',
    conceptTested: 'Understanding time complexity of tree data structures',
    estimatedTime: 75,
    relatedResources: [
      {
        id: 'res6',
        title: 'Binary Search Trees Explained',
        url: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/',
        type: 'tutorial',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  {
    id: 'q7',
    title: 'React - Performance Optimization',
    questionText: 'Which React hook should you use to memoize an expensive calculation?',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt7-1',
        text: 'useEffect',
        isCorrect: false,
        distractorRationale: 'useEffect is for side effects, not memoization',
      },
      {
        id: 'opt7-2',
        text: 'useMemo',
        isCorrect: true,
      },
      {
        id: 'opt7-3',
        text: 'useCallback',
        isCorrect: false,
        distractorRationale: 'useCallback memoizes functions, not calculation results',
      },
      {
        id: 'opt7-4',
        text: 'useState',
        isCorrect: false,
        distractorRationale: 'useState manages state, not memoization',
      },
    ],
    correctAnswerIds: ['opt7-2'],
    difficulty: 5,
    topic: 'React',
    subtopic: 'Performance',
    tags: ['useMemo', 'optimization', 'hooks'],
    explanation: 'useMemo caches the result of expensive calculations and only recalculates when dependencies change.',
    conceptTested: 'Understanding React performance optimization techniques',
    estimatedTime: 60,
    relatedResources: [
      {
        id: 'res7',
        title: 'React Docs: useMemo',
        url: 'https://react.dev/reference/react/useMemo',
        type: 'documentation',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  {
    id: 'q8',
    title: 'Algorithms - Dynamic Programming',
    questionText: 'What technique does dynamic programming primarily use to optimize recursive algorithms?',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt8-1',
        text: 'Divide and conquer',
        isCorrect: false,
        distractorRationale: 'Divide and conquer splits problems but doesn\'t cache results',
      },
      {
        id: 'opt8-2',
        text: 'Memoization and tabulation',
        isCorrect: true,
      },
      {
        id: 'opt8-3',
        text: 'Greedy approach',
        isCorrect: false,
        distractorRationale: 'Greedy makes local optimal choices, different from DP',
      },
      {
        id: 'opt8-4',
        text: 'Backtracking',
        isCorrect: false,
        distractorRationale: 'Backtracking explores all paths, while DP avoids redundant computation',
      },
    ],
    correctAnswerIds: ['opt8-2'],
    difficulty: 7,
    topic: 'Algorithms',
    subtopic: 'Dynamic Programming',
    tags: ['DP', 'memoization', 'optimization'],
    explanation: 'Dynamic programming uses memoization (top-down) and tabulation (bottom-up) to store and reuse solutions to subproblems.',
    conceptTested: 'Understanding core principles of dynamic programming',
    estimatedTime: 90,
    relatedResources: [
      {
        id: 'res8',
        title: 'Introduction to Dynamic Programming',
        url: 'https://www.geeksforgeeks.org/dynamic-programming/',
        type: 'tutorial',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  {
    id: 'q9',
    title: 'JavaScript - Prototypes',
    questionText: 'What will obj.hasOwnProperty(\'toString\') return for const obj = {}?',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt9-1',
        text: 'true',
        isCorrect: false,
        distractorRationale: 'toString is inherited from Object.prototype, not an own property',
      },
      {
        id: 'opt9-2',
        text: 'false',
        isCorrect: true,
      },
      {
        id: 'opt9-3',
        text: 'undefined',
        isCorrect: false,
        distractorRationale: 'hasOwnProperty returns a boolean, not undefined',
      },
      {
        id: 'opt9-4',
        text: 'Error',
        isCorrect: false,
        distractorRationale: 'This is valid code and doesn\'t throw an error',
      },
    ],
    correctAnswerIds: ['opt9-2'],
    difficulty: 6,
    topic: 'JavaScript',
    subtopic: 'Prototypes & Inheritance',
    tags: ['prototypes', 'inheritance', 'hasOwnProperty'],
    explanation: 'hasOwnProperty returns false because toString is inherited from Object.prototype, not directly defined on obj.',
    conceptTested: 'Understanding JavaScript prototype chain and own properties',
    estimatedTime: 75,
    relatedResources: [
      {
        id: 'res9',
        title: 'JavaScript Prototypes',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain',
        type: 'documentation',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
  {
    id: 'q10',
    title: 'React - Advanced Patterns',
    questionText: 'What is the purpose of React.memo()?',
    questionType: 'single-answer',
    options: [
      {
        id: 'opt10-1',
        text: 'To memoize expensive calculations',
        isCorrect: false,
        distractorRationale: 'That\'s useMemo\'s purpose, not React.memo',
      },
      {
        id: 'opt10-2',
        text: 'To prevent unnecessary re-renders of functional components',
        isCorrect: true,
      },
      {
        id: 'opt10-3',
        text: 'To cache API responses',
        isCorrect: false,
        distractorRationale: 'React.memo is for component rendering, not API caching',
      },
      {
        id: 'opt10-4',
        text: 'To store component state',
        isCorrect: false,
        distractorRationale: 'State is managed by useState/useReducer, not React.memo',
      },
    ],
    correctAnswerIds: ['opt10-2'],
    difficulty: 6,
    topic: 'React',
    subtopic: 'Performance',
    tags: ['React.memo', 'optimization', 'rendering'],
    explanation: 'React.memo is a higher-order component that prevents re-renders when props haven\'t changed, improving performance.',
    conceptTested: 'Understanding React component optimization techniques',
    estimatedTime: 60,
    relatedResources: [
      {
        id: 'res10',
        title: 'React Docs: React.memo',
        url: 'https://react.dev/reference/react/memo',
        type: 'documentation',
      },
    ],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    createdBy: 'admin',
    status: 'active',
  },
];

// ==========================================
// Mock Assessment Configurations
// ==========================================

export const mockAssessmentConfigs: AssessmentConfiguration[] = [
  {
    id: 'config1',
    title: 'JavaScript Fundamentals Assessment',
    description: 'Test your understanding of core JavaScript concepts including variables, functions, and scope.',
    totalQuestions: 15,
    timeLimit: 30, // 30 minutes
    topics: ['JavaScript'],
    passingScore: 60,
    allowRetry: true,
    retryDelay: 24, // 24 hours
    showFeedback: true,
    randomizeOptions: true,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'config2',
    title: 'React Mastery Challenge',
    description: 'Advanced React concepts including hooks, performance optimization, and component patterns.',
    totalQuestions: 15,
    timeLimit: 45, // 45 minutes
    topics: ['React'],
    passingScore: 70,
    allowRetry: true,
    retryDelay: 48, // 48 hours
    showFeedback: true,
    randomizeOptions: true,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'config3',
    title: 'Full Stack Developer Assessment',
    description: 'Comprehensive assessment covering JavaScript, React, Data Structures, and Algorithms.',
    totalQuestions: 20,
    timeLimit: 60, // 60 minutes
    topics: ['JavaScript', 'React', 'Data Structures', 'Algorithms'],
    passingScore: 65,
    allowRetry: true,
    retryDelay: 24,
    showFeedback: true,
    randomizeOptions: true,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
];

// ==========================================
// Mock Student Metrics
// ==========================================

export const mockStudentMetrics: StudentMetrics[] = [
  {
    studentId: 'student1',
    overallProficiency: 'intermediate',
    topicPerformance: [
      {
        topic: 'JavaScript',
        questionsAnswered: 45,
        correctAnswers: 32,
        accuracyRate: 71,
        averageDifficulty: 5.2,
        proficiencyLevel: 'intermediate',
        lastAttemptDate: '2025-01-20T14:30:00Z',
      },
      {
        topic: 'React',
        questionsAnswered: 30,
        correctAnswers: 24,
        accuracyRate: 80,
        averageDifficulty: 6.1,
        proficiencyLevel: 'advanced',
        lastAttemptDate: '2025-01-21T10:15:00Z',
      },
    ],
    totalAssessmentsTaken: 5,
    totalQuestionsAnswered: 75,
    accuracyRate: 74,
    averageDifficulty: 5.5,
    averageTimePerQuestion: 65,
    questionHistory: ['q10', 'q9', 'q8', 'q7', 'q6', 'q5', 'q4', 'q3', 'q2', 'q1'],
    lastAssessmentDate: '2025-01-21T10:15:00Z',
    updatedAt: '2025-01-21T10:15:00Z',
  },
  {
    studentId: 'student2',
    overallProficiency: 'basic',
    topicPerformance: [
      {
        topic: 'JavaScript',
        questionsAnswered: 20,
        correctAnswers: 11,
        accuracyRate: 55,
        averageDifficulty: 3.5,
        proficiencyLevel: 'basic',
        lastAttemptDate: '2025-01-19T16:45:00Z',
      },
    ],
    totalAssessmentsTaken: 2,
    totalQuestionsAnswered: 20,
    accuracyRate: 55,
    averageDifficulty: 3.5,
    averageTimePerQuestion: 95,
    questionHistory: ['q4', 'q3', 'q2', 'q1'],
    lastAssessmentDate: '2025-01-19T16:45:00Z',
    updatedAt: '2025-01-19T16:45:00Z',
  },
];

// ==========================================
// Mock Mentor Insights
// ==========================================

export const mockMentorInsights: MentorInsight[] = [
  {
    studentId: 'student2',
    studentName: 'Priya Sharma',
    alertType: 'struggling',
    message: 'Struggling with JavaScript closures and scope concepts',
    proficiencyLevel: 'basic',
    recentAccuracy: 55,
    assessmentsCompleted: 2,
    lastActivityDate: '2025-01-19T16:45:00Z',
    recommendedAction: 'Schedule 1-on-1 session to review closure concepts and provide additional practice problems',
  },
  {
    studentId: 'student3',
    studentName: 'Rahul Kumar',
    alertType: 'abandoned',
    message: 'Started assessment but abandoned after 3 questions',
    proficiencyLevel: 'intermediate',
    recentAccuracy: 67,
    assessmentsCompleted: 1,
    lastActivityDate: '2025-01-18T09:20:00Z',
    recommendedAction: 'Send reminder email and check if technical issues prevented completion',
  },
  {
    studentId: 'student1',
    studentName: 'Amit Patel',
    alertType: 'excelling',
    message: 'Consistently scoring above 80% on advanced React topics',
    proficiencyLevel: 'advanced',
    recentAccuracy: 80,
    assessmentsCompleted: 5,
    lastActivityDate: '2025-01-21T10:15:00Z',
    recommendedAction: 'Offer advanced learning track or mentorship opportunities',
  },
];

// ==========================================
// Helper functions to generate mock sessions
// ==========================================

export function generateMockSession(
  studentId: string,
  configId: string,
  status: 'not-started' | 'in-progress' | 'completed' = 'in-progress'
): AssessmentSession {
  const config = mockAssessmentConfigs.find((c) => c.id === configId) || mockAssessmentConfigs[0];

  // Select 15 random questions for this session
  const selectedQuestions = [...mockAdaptiveQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, config.totalQuestions);

  return {
    id: `session-${Date.now()}`,
    studentId,
    assessmentConfigId: configId,
    status,
    currentQuestionIndex: status === 'not-started' ? 0 : 3,
    questions: selectedQuestions,
    submissions: [],
    currentDifficulty: 5,
    proficiencyEstimate: undefined,
    score: 0,
    totalQuestions: config.totalQuestions,
    timeRemaining: config.timeLimit * 60, // Convert to seconds
    startTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getQuestionsByDifficulty(difficulty: QuestionDifficulty): AdaptiveQuestion[] {
  return mockAdaptiveQuestions.filter((q) => q.difficulty === difficulty);
}

export function getQuestionsByTopic(topic: string): AdaptiveQuestion[] {
  return mockAdaptiveQuestions.filter((q) => q.topic === topic);
}

export function getQuestionById(id: string): AdaptiveQuestion | undefined {
  return mockAdaptiveQuestions.find((q) => q.id === id);
}
