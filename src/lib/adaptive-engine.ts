import {
  AdaptiveQuestion,
  QuestionDifficulty,
  QuestionSubmission,
  ProficiencyLevel,
  AdaptiveEngineConfig,
} from '@/types/adaptive-assessment';

// ==========================================
// Default Configuration
// ==========================================

const DEFAULT_CONFIG: AdaptiveEngineConfig = {
  startingDifficulty: 5,
  difficultyIncrementCorrect: 1,
  difficultyDecrementIncorrect: 1,
  maxConsecutiveSameTopic: 1,
  questionHistoryWindow: 20,
  proficiencyEstimationThreshold: 5,
  topicRotationEnabled: true,
  cacheNextQuestions: 3,
};

// ==========================================
// Adaptive Question Selection
// ==========================================

/**
 * Selects the next question based on current difficulty and performance
 */
export function selectNextQuestion(
  currentDifficulty: QuestionDifficulty,
  wasCorrect: boolean | null,
  availableQuestions: AdaptiveQuestion[],
  questionHistory: string[] = [],
  lastTopic?: string,
  config: Partial<AdaptiveEngineConfig> = {}
): AdaptiveQuestion | null {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Calculate next difficulty level
  const nextDifficulty = calculateNextDifficulty(
    currentDifficulty,
    wasCorrect,
    finalConfig
  );

  // Filter out recently seen questions
  const unseenQuestions = availableQuestions.filter(
    (q) => !questionHistory.slice(-finalConfig.questionHistoryWindow).includes(q.id)
  );

  if (unseenQuestions.length === 0) {
    // If all questions have been seen, reset history and use all questions
    console.warn('All questions have been seen, resetting question pool');
    return selectFromDifficultyLevel(nextDifficulty, availableQuestions, lastTopic, finalConfig);
  }

  // Select question from the calculated difficulty
  return selectFromDifficultyLevel(nextDifficulty, unseenQuestions, lastTopic, finalConfig);
}

/**
 * Calculates the next difficulty level based on current difficulty and correctness
 */
export function calculateNextDifficulty(
  currentDifficulty: QuestionDifficulty,
  wasCorrect: boolean | null,
  config: AdaptiveEngineConfig = DEFAULT_CONFIG
): QuestionDifficulty {
  if (wasCorrect === null) {
    // First question - start at configured starting difficulty
    return config.startingDifficulty;
  }

  if (wasCorrect) {
    // Correct answer - increase difficulty
    const newDifficulty = currentDifficulty + config.difficultyIncrementCorrect;
    return Math.min(10, newDifficulty) as QuestionDifficulty;
  } else {
    // Incorrect answer - decrease difficulty
    const newDifficulty = currentDifficulty - config.difficultyDecrementIncorrect;
    return Math.max(1, newDifficulty) as QuestionDifficulty;
  }
}

/**
 * Selects a question from the target difficulty level with topic rotation
 */
function selectFromDifficultyLevel(
  targetDifficulty: QuestionDifficulty,
  questions: AdaptiveQuestion[],
  lastTopic: string | undefined,
  config: AdaptiveEngineConfig
): AdaptiveQuestion | null {
  // First, try to find questions at exact difficulty
  let candidateQuestions = questions.filter((q) => q.difficulty === targetDifficulty);

  // If no questions at exact difficulty, try ±1 level
  if (candidateQuestions.length === 0) {
    candidateQuestions = questions.filter(
      (q) =>
        q.difficulty === targetDifficulty - 1 || q.difficulty === targetDifficulty + 1
    );
  }

  // If still no questions, use any available
  if (candidateQuestions.length === 0) {
    candidateQuestions = questions;
  }

  // If no questions available at all
  if (candidateQuestions.length === 0) {
    return null;
  }

  // Apply topic rotation if enabled
  if (config.topicRotationEnabled && lastTopic) {
    const differentTopicQuestions = candidateQuestions.filter(
      (q) => q.topic !== lastTopic
    );
    if (differentTopicQuestions.length > 0) {
      candidateQuestions = differentTopicQuestions;
    }
  }

  // Randomly select from candidates to add variety
  const randomIndex = Math.floor(Math.random() * candidateQuestions.length);
  return candidateQuestions[randomIndex];
}

// ==========================================
// Proficiency Estimation
// ==========================================

/**
 * Estimates student proficiency based on submission history
 */
export function estimateProficiency(
  submissions: QuestionSubmission[],
  config: AdaptiveEngineConfig = DEFAULT_CONFIG
): ProficiencyLevel | undefined {
  if (submissions.length < config.proficiencyEstimationThreshold) {
    return undefined; // Not enough data yet
  }

  // Calculate average difficulty of correctly answered questions
  const correctSubmissions = submissions.filter((s) => s.isCorrect);

  if (correctSubmissions.length === 0) {
    return 'basic'; // No correct answers yet
  }

  // Get difficulty from question IDs (in real app, would fetch from database)
  // For now, we'll calculate based on score and accuracy

  const accuracyRate = correctSubmissions.length / submissions.length;
  const recentSubmissions = submissions.slice(-5);
  const recentAccuracy = recentSubmissions.filter((s) => s.isCorrect).length / recentSubmissions.length;

  // Estimate proficiency based on accuracy and trends
  if (accuracyRate >= 0.8 && recentAccuracy >= 0.75) {
    return 'advanced';
  } else if (accuracyRate >= 0.6 && recentAccuracy >= 0.5) {
    return 'intermediate';
  } else {
    return 'basic';
  }
}

/**
 * Calculates average difficulty reached by student
 */
export function calculateAverageDifficulty(
  questionDifficulties: QuestionDifficulty[]
): number {
  if (questionDifficulties.length === 0) return 5;

  const sum = questionDifficulties.reduce((acc, diff) => acc + diff, 0);
  return Math.round((sum / questionDifficulties.length) * 10) / 10;
}

// ==========================================
// Topic-Based Question Selection
// ==========================================

/**
 * Generates a balanced question set across multiple topics
 */
export function generateBalancedQuestionSet(
  allQuestions: AdaptiveQuestion[],
  topics: string[],
  totalQuestions: number,
  startingDifficulty: QuestionDifficulty = 5
): AdaptiveQuestion[] {
  const questionsPerTopic = Math.floor(totalQuestions / topics.length);
  const remainder = totalQuestions % topics.length;

  const selectedQuestions: AdaptiveQuestion[] = [];
  const usedQuestionIds = new Set<string>();

  topics.forEach((topic, index) => {
    const topicQuestions = allQuestions.filter(
      (q) => q.topic === topic && !usedQuestionIds.has(q.id)
    );

    // Calculate how many questions to select for this topic
    let count = questionsPerTopic;
    if (index < remainder) count++; // Distribute remainder

    // Select questions with varied difficulty
    const selectedFromTopic = selectVariedDifficulty(
      topicQuestions,
      count,
      startingDifficulty
    );

    selectedFromTopic.forEach((q) => {
      selectedQuestions.push(q);
      usedQuestionIds.add(q.id);
    });
  });

  // Shuffle to mix topics
  return shuffleArray(selectedQuestions);
}

/**
 * Selects questions with varied difficulty levels
 */
function selectVariedDifficulty(
  questions: AdaptiveQuestion[],
  count: number,
  centerDifficulty: QuestionDifficulty
): AdaptiveQuestion[] {
  const selected: AdaptiveQuestion[] = [];

  // Group questions by difficulty
  const byDifficulty = new Map<QuestionDifficulty, AdaptiveQuestion[]>();
  questions.forEach((q) => {
    if (!byDifficulty.has(q.difficulty)) {
      byDifficulty.set(q.difficulty, []);
    }
    byDifficulty.get(q.difficulty)!.push(q);
  });

  // Select questions in a wave pattern around center difficulty
  const difficulties: QuestionDifficulty[] = [
    centerDifficulty,
    (centerDifficulty - 1) as QuestionDifficulty,
    (centerDifficulty + 1) as QuestionDifficulty,
    (centerDifficulty - 2) as QuestionDifficulty,
    (centerDifficulty + 2) as QuestionDifficulty,
  ].filter((d) => d >= 1 && d <= 10) as QuestionDifficulty[];

  let diffIndex = 0;
  while (selected.length < count && selected.length < questions.length) {
    const targetDiff = difficulties[diffIndex % difficulties.length];
    const pool = byDifficulty.get(targetDiff);

    if (pool && pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const question = pool.splice(randomIndex, 1)[0];
      selected.push(question);
    }

    diffIndex++;

    // Prevent infinite loop
    if (diffIndex > difficulties.length * 10) break;
  }

  return selected;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ==========================================
// Performance Analysis
// ==========================================

/**
 * Analyzes student performance patterns
 */
export interface PerformanceAnalysis {
  overallAccuracy: number;
  accuracyByDifficulty: Map<QuestionDifficulty, number>;
  accuracyByTopic: Map<string, number>;
  averageDifficulty: number;
  proficiencyLevel: ProficiencyLevel | undefined;
  strongTopics: string[];
  weakTopics: string[];
  improvementTrend: 'improving' | 'declining' | 'stable';
}

export function analyzePerformance(
  submissions: QuestionSubmission[],
  questions: AdaptiveQuestion[]
): PerformanceAnalysis {
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // Overall accuracy
  const correctCount = submissions.filter((s) => s.isCorrect).length;
  const overallAccuracy = submissions.length > 0 ? correctCount / submissions.length : 0;

  // Accuracy by difficulty
  const accuracyByDifficulty = new Map<QuestionDifficulty, number>();
  const difficultyGroups = new Map<QuestionDifficulty, { correct: number; total: number }>();

  submissions.forEach((sub) => {
    const question = questionMap.get(sub.questionId);
    if (!question) return;

    const diff = question.difficulty;
    if (!difficultyGroups.has(diff)) {
      difficultyGroups.set(diff, { correct: 0, total: 0 });
    }

    const group = difficultyGroups.get(diff)!;
    group.total++;
    if (sub.isCorrect) group.correct++;
  });

  difficultyGroups.forEach((group, diff) => {
    accuracyByDifficulty.set(diff, group.correct / group.total);
  });

  // Accuracy by topic
  const accuracyByTopic = new Map<string, number>();
  const topicGroups = new Map<string, { correct: number; total: number }>();

  submissions.forEach((sub) => {
    const question = questionMap.get(sub.questionId);
    if (!question) return;

    const topic = question.topic;
    if (!topicGroups.has(topic)) {
      topicGroups.set(topic, { correct: 0, total: 0 });
    }

    const group = topicGroups.get(topic)!;
    group.total++;
    if (sub.isCorrect) group.correct++;
  });

  topicGroups.forEach((group, topic) => {
    accuracyByTopic.set(topic, group.correct / group.total);
  });

  // Strong and weak topics
  const topicAccuracies = Array.from(accuracyByTopic.entries());
  topicAccuracies.sort((a, b) => b[1] - a[1]);

  const strongTopics = topicAccuracies.filter((t) => t[1] >= 0.7).map((t) => t[0]);
  const weakTopics = topicAccuracies.filter((t) => t[1] < 0.5).map((t) => t[0]);

  // Average difficulty
  const difficulties = submissions
    .map((s) => questionMap.get(s.questionId)?.difficulty)
    .filter((d): d is QuestionDifficulty => d !== undefined);
  const averageDifficulty = calculateAverageDifficulty(difficulties);

  // Improvement trend
  const recentSubmissions = submissions.slice(-5);
  const olderSubmissions = submissions.slice(-10, -5);

  const recentAccuracy =
    recentSubmissions.length > 0
      ? recentSubmissions.filter((s) => s.isCorrect).length / recentSubmissions.length
      : 0;

  const olderAccuracy =
    olderSubmissions.length > 0
      ? olderSubmissions.filter((s) => s.isCorrect).length / olderSubmissions.length
      : 0;

  let improvementTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (recentAccuracy - olderAccuracy > 0.15) improvementTrend = 'improving';
  else if (olderAccuracy - recentAccuracy > 0.15) improvementTrend = 'declining';

  // Proficiency level
  const proficiencyLevel = estimateProficiency(submissions);

  return {
    overallAccuracy,
    accuracyByDifficulty,
    accuracyByTopic,
    averageDifficulty,
    proficiencyLevel,
    strongTopics,
    weakTopics,
    improvementTrend,
  };
}
