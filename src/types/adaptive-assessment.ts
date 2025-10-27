// ==========================================
// Adaptive Assessment System Types
// ==========================================

// ==========================================
// Question & Answer Types
// ==========================================

export type QuestionDifficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type QuestionType = 'single-answer' | 'multiple-answer' | 'true-false';
export type QuestionStatus = 'draft' | 'active' | 'archived';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  distractorRationale?: string; // Explanation for why this wrong answer is tempting
  imageUrl?: string;
}

export interface AdaptiveQuestion {
  id: string;
  title: string;
  questionText: string;
  questionType: QuestionType;
  options: QuestionOption[];
  correctAnswerIds: string[]; // IDs of correct options
  difficulty: QuestionDifficulty; // 1 (easiest) to 10 (hardest)
  topic: string; // e.g., "JavaScript", "Data Structures", "React"
  subtopic?: string; // e.g., "Array Methods", "Closures"
  tags: string[]; // Additional categorization
  explanation: string; // Why the correct answer is correct
  conceptTested: string; // The learning objective being assessed
  estimatedTime: number; // Expected time to answer in seconds
  imageUrl?: string; // Optional question image
  relatedResources: ResourceLink[]; // Learning materials related to this question
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: QuestionStatus;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'documentation' | 'tutorial';
}

// ==========================================
// Assessment Session Types
// ==========================================

export type SessionStatus = 'not-started' | 'in-progress' | 'completed' | 'abandoned' | 'expired';
export type ProficiencyLevel = 'basic' | 'intermediate' | 'advanced';

export interface AssessmentConfiguration {
  id: string;
  title: string;
  description: string;
  totalQuestions: number; // e.g., 15
  timeLimit: number; // Total time in minutes
  topics: string[]; // Topics to cover
  passingScore: number; // Percentage required to pass (e.g., 60)
  allowRetry: boolean;
  retryDelay?: number; // Hours before retry allowed (e.g., 24)
  showFeedback: boolean; // Instant feedback enabled
  randomizeOptions: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSession {
  id: string;
  studentId: string;
  assessmentConfigId: string;
  status: SessionStatus;
  currentQuestionIndex: number; // 0-based index
  questions: AdaptiveQuestion[]; // Pre-selected questions for this session
  submissions: QuestionSubmission[];
  currentDifficulty: QuestionDifficulty; // Current adaptive difficulty level
  proficiencyEstimate?: ProficiencyLevel; // Calculated after ~5 questions
  score: number; // Number of correct answers
  totalQuestions: number;
  timeRemaining: number; // Seconds remaining
  startTime: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Submission & Evaluation Types
// ==========================================

export type SyncStatus = 'synced' | 'pending' | 'failed';

export interface QuestionSubmission {
  id: string;
  sessionId: string;
  questionId: string;
  studentId: string;
  selectedOptionIds: string[]; // IDs of selected options
  isCorrect: boolean;
  score: number; // 1 for correct, 0 for incorrect
  timeSpent: number; // Seconds spent on this question
  submittedAt: string; // ISO timestamp (server time)
  clientTimestamp: string; // ISO timestamp (client time for offline sync)
  syncStatus: SyncStatus; // For offline-first functionality
  evaluationResult?: EvaluationResult;
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  feedback: FeedbackData;
  nextDifficulty: QuestionDifficulty;
  proficiencyUpdate?: ProficiencyLevel;
}

export interface FeedbackData {
  studentAnswerIds: string[]; // What student selected
  correctAnswerIds: string[]; // What was correct
  explanation: string; // Why correct answer is right
  distractorExplanations: string[]; // Why wrong answers were tempting
  relatedResources: ResourceLink[];
  encouragementMessage: string; // Personalized message based on performance
}

// ==========================================
// Student Performance & Analytics Types
// ==========================================

export interface StudentMetrics {
  studentId: string;
  overallProficiency: ProficiencyLevel;
  topicPerformance: TopicPerformance[];
  totalAssessmentsTaken: number;
  totalQuestionsAnswered: number;
  accuracyRate: number; // Percentage of correct answers
  averageDifficulty: number; // Average difficulty level reached
  averageTimePerQuestion: number; // Seconds
  questionHistory: string[]; // Last 20 question IDs seen
  lastAssessmentDate?: string;
  updatedAt: string;
}

export interface TopicPerformance {
  topic: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracyRate: number; // Percentage
  averageDifficulty: number;
  proficiencyLevel: ProficiencyLevel;
  lastAttemptDate: string;
}

export interface MentorInsight {
  studentId: string;
  studentName: string;
  alertType: 'struggling' | 'excelling' | 'abandoned' | 'needs-review';
  message: string;
  proficiencyLevel: ProficiencyLevel;
  recentAccuracy: number;
  assessmentsCompleted: number;
  lastActivityDate: string;
  recommendedAction: string;
}

// ==========================================
// Adaptive Engine Configuration
// ==========================================

export interface AdaptiveEngineConfig {
  startingDifficulty: QuestionDifficulty; // Default: 5
  difficultyIncrementCorrect: number; // Default: +1
  difficultyDecrementIncorrect: number; // Default: -1
  maxConsecutiveSameTopic: number; // Default: 1 (no repeats)
  questionHistoryWindow: number; // Default: 20 (last N questions to avoid)
  proficiencyEstimationThreshold: number; // Default: 5 (questions before estimation)
  topicRotationEnabled: boolean; // Default: true
  cacheNextQuestions: number; // Default: 3 (for offline support)
}

// ==========================================
// Offline-First Support Types
// ==========================================

export interface OfflineQueueItem {
  id: string;
  type: 'submission' | 'session-update';
  data: QuestionSubmission | Partial<AssessmentSession>;
  timestamp: string;
  retryCount: number;
  lastRetryAt?: string;
}

export interface CachedAssessmentData {
  sessionId: string;
  questions: AdaptiveQuestion[];
  lastUpdated: string;
  expiresAt: string;
}

// ==========================================
// UI State Types
// ==========================================

export interface AssessmentUIState {
  currentQuestion: AdaptiveQuestion | null;
  selectedOptionIds: string[];
  showFeedback: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  offlineMode: boolean;
  pendingSyncCount: number;
  timeRemaining: number;
  showInstructions: boolean;
}

// ==========================================
// Analytics Dashboard Types
// ==========================================

export interface AnalyticsSummary {
  totalStudents: number;
  totalAssessments: number;
  averageCompletionRate: number; // Percentage
  averageScore: number; // Percentage
  topicsNeedingReview: string[];
  studentsNeedingIntervention: MentorInsight[];
  periodStart: string;
  periodEnd: string;
}

export interface QuestionAnalytics {
  questionId: string;
  questionText: string;
  topic: string;
  difficulty: QuestionDifficulty;
  timesAsked: number;
  correctAttempts: number;
  incorrectAttempts: number;
  accuracyRate: number; // Percentage
  averageTimeSpent: number; // Seconds
  needsReview: boolean; // Flag if accuracy is too low/high
}
