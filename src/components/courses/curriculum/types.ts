
// Content Types as per design specifications
export type ContentType = 'live-class' | 'video' | 'article' | 'assignment' | 'coding-problem' | 'quiz' | 'feedback-form' | 'assessment';

export interface BaseLearningItem {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  status?: 'draft' | 'published' | 'archived';
}

// Live Class specific data
export type LiveClassStatus = 'upcoming' | 'ongoing' | 'completed';
export type MeetingPlatform = 'zoom' | 'google-meet';
export type LiveClassMode = 'new' | 'existing';

export interface LiveClassData extends BaseLearningItem {
  type: 'live-class';
  mode?: LiveClassMode; // Whether this is a new class or selected from existing
  startDate: Date;
  startTime: string;
  duration: number; // duration in minutes
  meetingPlatform?: MeetingPlatform; // Zoom or Google Meet
  meetingUrl?: string;
  meetingId?: string;
  meetingPassword?: string;
  hostName?: string;
  classStatus?: LiveClassStatus; // upcoming, ongoing, or completed
  existingClassId?: string; // Reference to existing class if mode is 'existing'
  batchName?: string; // For displaying existing classes
  recordingUrl?: string; // URL of the class recording (for completed classes)
  recordingPlatform?: 'youtube' | 'upload'; // Platform where recording is hosted
}

// Video specific data
export interface VideoData extends BaseLearningItem {
  type: 'video';
  sourceType: 'youtube' | 'upload';
  url?: string; // YouTube URL
  fileUrl?: string; // Upload file URL
  transcript?: string;
  thumbnailUrl?: string;
}

// Article specific data
export interface ArticleData extends BaseLearningItem {
  type: 'article';
  contentType: 'rich-text' | 'external-link' | 'upload';
  content?: string; // Rich text content
  externalUrl?: string; // External link
  fileUrl?: string; // PDF file URL
  estimatedReadTime?: number; // in minutes
}

// Assignment specific data
export interface AssignmentData extends BaseLearningItem {
  type: 'assignment';
  instructions: string;
  instructionType: 'text' | 'pdf';
  instructionFileUrl?: string;
  dueDate?: Date;
  allowLateSubmission?: boolean;
  submissionTypes: ('file' | 'text' | 'url')[];
}

// Coding Problem specific data
export interface CodingProblemData extends BaseLearningItem {
  type: 'coding-problem';
  problemId?: string; // Reference to content bank
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  isFromContentBank: boolean;
  // If creating custom problem
  problemStatement?: string;
  testCases?: TestCase[];
  allowedLanguages?: string[];
  starterCode?: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

// Quiz specific data
export interface QuizData extends BaseLearningItem {
  type: 'quiz';
  questionIds: string[]; // References to content bank MCQs
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  timeLimit?: number; // in minutes
  randomizeQuestions: boolean;
  allowMultipleAttempts: boolean;
}

// Feedback Form specific data
export interface FeedbackFormData extends BaseLearningItem {
  type: 'feedback-form';
  questions: FeedbackQuestion[];
}

export interface FeedbackQuestion {
  id: string;
  questionText: string;
  questionType: 'short-text' | 'long-text' | 'rating' | 'date' | 'time' | 'multiple-choice' | 'single-choice';
  required: boolean;
  // For rating type
  ratingScale?: {
    min: number;
    max: number;
    minLabel?: string;
    midLabel?: string;
    maxLabel?: string;
  };
  // For choice types
  options?: string[];
}

// Assessment specific data
export interface AssessmentData extends BaseLearningItem {
  type: 'assessment';
  questionIds: string[];
  codingProblemIds: string[];
  timeLimit?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  passingScore?: number;
}

// Union type for all learning items
export type LearningItem = LiveClassData | VideoData | ArticleData | AssignmentData | CodingProblemData | QuizData | FeedbackFormData | AssessmentData;

// Content Bank Items
export interface ContentBankMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  imageUrl?: string;
}

export interface ContentBankCodingProblem {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  testCases: TestCase[];
  allowedLanguages: string[];
  starterCode: string;
  solution?: string;
}

// Module/Project data
export interface ContentItem {
  id: string;
  type: 'module' | 'project';
  title: string;
  description: string;
  items?: LearningItem[];
  isExpanded?: boolean;
  showAddContent?: boolean;
  duration: number; // duration in weeks as per specs
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  createdAt: Date;
  updatedAt: Date;
}

export interface NewModuleData {
  type: 'module' | 'project';
  title: string;
  description: string;
  duration: number; // duration in weeks as per design specs
}

// UI State Types
export interface UnsavedChangesState {
  hasUnsavedChanges: boolean;
  pendingAction?: () => void;
  showWarningModal: boolean;
}

export interface ContentEditorState {
  selectedItem: LearningItem | null;
  editingMode: 'create' | 'edit' | 'view';
  unsavedChanges: UnsavedChangesState;
}
