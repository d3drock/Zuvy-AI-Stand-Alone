
export interface Question {
  id: string;
  type: 'MCQ' | 'Coding' | 'Open Ended';
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  points: number;
  description?: string;
  options?: string[];
  correctAnswers?: string[];
  testCases?: TestCase[];
  expectedAnswer?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Topic {
  id: string;
  name: string;
}
