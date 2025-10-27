// Course Studio Data Types

// ==========================================
// Course Structure Types
// ==========================================

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string[];
  tags: string[];
  startDate?: string; // ISO date string
  duration: number; // in weeks
  language: 'English' | 'Hindi' | 'Kannada';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  modules: Module[];
  projects: Project[];
  type: 'Private' | 'Public';
  moduleLock: boolean; // If true, modules must be completed in linear order
}

export interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  position: number; // For ordering within course
  duration?: string;
  items: LearningItem[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  courseId: string;
  position: number; // For ordering within course
  instructions?: string;
  allowedSubmissionTypes: ('file' | 'text' | 'url')[];
  dueDate?: string; // ISO date string
}

// Base learning item interface
export interface BaseLearningItem {
  id: string;
  title: string;
  type: LearningItemType;
  moduleId: string;
  position: number; // For ordering within module
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Learning item types
export type LearningItemType = 'article' | 'video' | 'quiz' | 'assignment' | 'coding' | 'live-class' | 'feedback' | 'assessment';

// Article specific properties
export interface Article extends BaseLearningItem {
  type: 'article';
  content?: string; // Rich text content
  externalLink?: string;
  fileUrl?: string; // For PDF or other document types
  estimatedReadTime?: number; // in minutes
}

// Video specific properties
export interface Video extends BaseLearningItem {
  type: 'video';
  description?: string;
  videoUrl?: string; // URL to video source
  videoDuration?: number; // in seconds
  transcript?: string;
}

// Quiz specific properties
export interface Quiz extends BaseLearningItem {
  type: 'quiz';
  description?: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  randomizeQuestions: boolean;
}

// Assignment specific properties
export interface Assignment extends BaseLearningItem {
  type: 'assignment';
  instructions: string;
  allowedSubmissionTypes: ('file' | 'text')[];
  dueDate?: string; // ISO date string
  fileUrl?: string; // For PDF or other document types
}

// Coding problem specific properties
export interface CodingProblem extends BaseLearningItem {
  type: 'coding';
  description: string;
  problemStatement: string;
  testCases: TestCase[];
  allowedLanguages: string[];
  starterCode?: string;
}

// Live class specific properties
export interface LiveClass extends BaseLearningItem {
  type: 'live-class';
  description?: string;
  startDate: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  meetingLink?: string;
}

// Feedback form specific properties
export interface FeedbackForm extends BaseLearningItem {
  type: 'feedback';
  questions: FeedbackQuestion[];
}

// Assessment specific properties
export interface Assessment extends BaseLearningItem {
  type: 'assessment';
  description: string;
  questions: Question[];
  settings: AssessmentSettings;
  startDate?: string; // ISO date string
}

// Type union for all learning item types
export type LearningItem = 
  | Article
  | Video
  | Quiz
  | Assignment
  | CodingProblem
  | LiveClass
  | FeedbackForm
  | Assessment;

// Assessment settings
export interface AssessmentSettings {
  questionDistribution: {
    mcq: { easy: number; medium: number; hard: number; };
    coding: { easy: number; medium: number; hard: number; };
    openEnded: { easy: number; medium: number; hard: number; };
  };
  sectionWeightage: {
    mcq: number;
    coding: number;
    openEnded: number;
  };
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  proctoring: {
    disableCopyPaste: boolean;
    trackTabChange: boolean;
  };
}

// Feedback question types
export type FeedbackQuestionType = 'shortText' | 'longText' | 'rating' | 'date' | 'time' | 'multipleChoice' | 'singleChoice';

export interface FeedbackQuestion {
  id: string;
  type: FeedbackQuestionType;
  question: string;
  required: boolean;
  options?: string[]; // For multiple/single choice questions
}

// ==========================================
// Question Bank Types
// ==========================================

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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

// ==========================================
// Students and Batches Types
// ==========================================

export interface Student {
  id: string;
  name: string;
  email: string;
  batchId?: string; // Reference to batch if assigned
  dateAdded: string; // ISO date string
  status: 'active' | 'dropout'; // Status in the course
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  status: 'not_started' | 'ongoing' | 'completed';
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

// ==========================================
// Submissions Types
// ==========================================

export interface BaseSubmission {
  id: string;
  studentId: string;
  itemId: string; // ID of the learning item (assignment, quiz, etc.)
  itemType: 'assignment' | 'quiz' | 'coding' | 'assessment' | 'project' | 'feedback';
  submissionDate: string; // ISO date string
  status: 'submitted' | 'graded' | 'reviewed';
}

export interface AssignmentSubmission extends BaseSubmission {
  itemType: 'assignment';
  content?: string; // Text submission
  fileUrl?: string; // File submission
  grade?: number;
  feedback?: string;
}

export interface QuizSubmission extends BaseSubmission {
  itemType: 'quiz';
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  score: number;
  totalPossible: number;
}

export interface CodingSubmission extends BaseSubmission {
  itemType: 'coding';
  code: string;
  language: string;
  testResults: {
    testCaseId: string;
    passed: boolean;
    output?: string;
    error?: string;
  }[];
  score: number;
  totalPossible: number;
}

export interface AssessmentSubmission extends BaseSubmission {
  itemType: 'assessment';
  timeTaken: number; // in seconds
  score: number;
  totalPossible: number;
  percentageObtained: number;
  qualified: boolean;
  numberOfAttempts: number;
  hasReAttemptRequest: boolean;
  answers: {
    questionId: string;
    questionType: 'MCQ' | 'Coding' | 'Open Ended';
    answer: string | string[] | { code: string; language: string };
  }[];
}

export interface ProjectSubmission extends BaseSubmission {
  itemType: 'project';
  content?: string; // Text submission
  fileUrl?: string; // File submission
  url?: string; // URL submission
  grade?: number;
  feedback?: string;
}

export interface FeedbackSubmission extends BaseSubmission {
  itemType: 'feedback';
  answers: {
    questionId: string;
    answer: string | string[] | number | Date;
  }[];
}

export interface ReAttemptRequest {
  id: string;
  studentId: string;
  assessmentId: string;
  requestDate: string; // ISO date string
  status: 'pending' | 'approved' | 'rejected';
}

export type Submission = 
  | AssignmentSubmission
  | QuizSubmission
  | CodingSubmission
  | AssessmentSubmission
  | ProjectSubmission
  | FeedbackSubmission;

// ==========================================
// Role-Based Access Control Types
// ==========================================

export type UserRole = 'Admin' | 'Ops' | 'Instructor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  dateAdded: string; // ISO date string
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
}

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  permissions: Permission[];
  isSystem: boolean; // true for default roles, false for custom roles
  color?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  allowed: boolean;
}

// Action types based on the reference image
export type ActionType = 
  | 'User/Role Management'
  | 'Create/Edit Roles & Permissions'
  | 'Assign/Revoke Roles'
  | 'Access Review Reminders'
  | 'Create & Schedule Assessments'
  | 'View Analytics (Class Response)'
  | 'Create/Edit Quizzes'
  | 'View Individual student grades'
  | 'Delete/Publish Courses'
  | 'View Assigned Courses Only'
  | 'Instructor Analytics'
  | 'Student Onboarding'
  | 'Request Technical Support (Self)';

export interface Action {
  id: string;
  name: ActionType;
  description: string;
  category: 'User Management' | 'Content Management' | 'Analytics' | 'Operations' | 'Support';
}

export interface RoleActionPermission {
  roleId: string;
  actionId: string;
  allowed: boolean;
  scopeType?: 'full' | 'scoped' | 'none';
  scopeDescription?: string;
}

// Invite functionality types
export interface InviteLink {
  id: string;
  role: UserRole;
  token: string;
  expiresAt: string; // ISO date string
  createdBy: string; // User ID
  createdAt: string; // ISO date string
  used: boolean;
  usedBy?: string; // User ID who used the invite
  usedAt?: string; // ISO date string
} 