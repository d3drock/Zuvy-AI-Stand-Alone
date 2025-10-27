import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  AssessmentSession,
  QuestionSubmission,
  AdaptiveQuestion,
  OfflineQueueItem,
  CachedAssessmentData,
} from '@/types/adaptive-assessment';

// ==========================================
// Database Schema
// ==========================================

interface AssessmentDB extends DBSchema {
  sessions: {
    key: string;
    value: AssessmentSession;
    indexes: { 'by-student': string; 'by-status': string };
  };
  submissions: {
    key: string;
    value: QuestionSubmission;
    indexes: { 'by-session': string; 'by-sync-status': string };
  };
  cachedQuestions: {
    key: string;
    value: CachedAssessmentData;
  };
  syncQueue: {
    key: string;
    value: OfflineQueueItem;
    indexes: { 'by-type': string };
  };
}

const DB_NAME = 'adaptive-assessment-db';
const DB_VERSION = 1;

// ==========================================
// Database Initialization
// ==========================================

let dbPromise: Promise<IDBPDatabase<AssessmentDB>> | null = null;

export async function initDB(): Promise<IDBPDatabase<AssessmentDB>> {
  if (dbPromise) return dbPromise;

  dbPromise = openDB<AssessmentDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Sessions store
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
        sessionStore.createIndex('by-student', 'studentId');
        sessionStore.createIndex('by-status', 'status');
      }

      // Submissions store
      if (!db.objectStoreNames.contains('submissions')) {
        const submissionStore = db.createObjectStore('submissions', { keyPath: 'id' });
        submissionStore.createIndex('by-session', 'sessionId');
        submissionStore.createIndex('by-sync-status', 'syncStatus');
      }

      // Cached questions store
      if (!db.objectStoreNames.contains('cachedQuestions')) {
        db.createObjectStore('cachedQuestions', { keyPath: 'sessionId' });
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        queueStore.createIndex('by-type', 'type');
      }
    },
  });

  return dbPromise;
}

// ==========================================
// Session Operations
// ==========================================

export async function saveSession(session: AssessmentSession): Promise<void> {
  const db = await initDB();
  await db.put('sessions', {
    ...session,
    updatedAt: new Date().toISOString(),
  });
}

export async function getSession(sessionId: string): Promise<AssessmentSession | undefined> {
  const db = await initDB();
  return db.get('sessions', sessionId);
}

export async function getAllSessions(studentId: string): Promise<AssessmentSession[]> {
  const db = await initDB();
  return db.getAllFromIndex('sessions', 'by-student', studentId);
}

export async function getInProgressSessions(studentId: string): Promise<AssessmentSession[]> {
  const db = await initDB();
  const allSessions = await db.getAllFromIndex('sessions', 'by-student', studentId);
  return allSessions.filter((s) => s.status === 'in-progress');
}

export async function deleteSession(sessionId: string): Promise<void> {
  const db = await initDB();
  await db.delete('sessions', sessionId);
}

// ==========================================
// Submission Operations
// ==========================================

export async function saveSubmission(submission: QuestionSubmission): Promise<void> {
  const db = await initDB();
  await db.put('submissions', submission);

  // If not synced, add to sync queue
  if (submission.syncStatus === 'pending') {
    await addToSyncQueue({
      id: `sync-${submission.id}`,
      type: 'submission',
      data: submission,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    });
  }
}

export async function getSubmission(submissionId: string): Promise<QuestionSubmission | undefined> {
  const db = await initDB();
  return db.get('submissions', submissionId);
}

export async function getSessionSubmissions(sessionId: string): Promise<QuestionSubmission[]> {
  const db = await initDB();
  return db.getAllFromIndex('submissions', 'by-session', sessionId);
}

export async function getPendingSubmissions(): Promise<QuestionSubmission[]> {
  const db = await initDB();
  return db.getAllFromIndex('submissions', 'by-sync-status', 'pending');
}

export async function updateSubmissionSyncStatus(
  submissionId: string,
  syncStatus: 'synced' | 'pending' | 'failed'
): Promise<void> {
  const db = await initDB();
  const submission = await db.get('submissions', submissionId);
  if (submission) {
    submission.syncStatus = syncStatus;
    await db.put('submissions', submission);
  }
}

// ==========================================
// Question Caching
// ==========================================

export async function cacheQuestions(
  sessionId: string,
  questions: AdaptiveQuestion[]
): Promise<void> {
  const db = await initDB();
  const cacheData: CachedAssessmentData = {
    sessionId,
    questions,
    lastUpdated: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };
  await db.put('cachedQuestions', cacheData);
}

export async function getCachedQuestions(
  sessionId: string
): Promise<AdaptiveQuestion[] | undefined> {
  const db = await initDB();
  const cached = await db.get('cachedQuestions', sessionId);

  if (!cached) return undefined;

  // Check if expired
  const now = new Date().getTime();
  const expiresAt = new Date(cached.expiresAt).getTime();

  if (now > expiresAt) {
    await db.delete('cachedQuestions', sessionId);
    return undefined;
  }

  return cached.questions;
}

export async function clearExpiredCache(): Promise<void> {
  const db = await initDB();
  const allCached = await db.getAll('cachedQuestions');
  const now = new Date().getTime();

  for (const cached of allCached) {
    const expiresAt = new Date(cached.expiresAt).getTime();
    if (now > expiresAt) {
      await db.delete('cachedQuestions', cached.sessionId);
    }
  }
}

// ==========================================
// Sync Queue Operations
// ==========================================

export async function addToSyncQueue(item: OfflineQueueItem): Promise<void> {
  const db = await initDB();
  await db.put('syncQueue', item);
}

export async function getSyncQueue(): Promise<OfflineQueueItem[]> {
  const db = await initDB();
  return db.getAll('syncQueue');
}

export async function removeFromSyncQueue(itemId: string): Promise<void> {
  const db = await initDB();
  await db.delete('syncQueue', itemId);
}

export async function updateSyncQueueItem(item: OfflineQueueItem): Promise<void> {
  const db = await initDB();
  await db.put('syncQueue', item);
}

export async function clearSyncQueue(): Promise<void> {
  const db = await initDB();
  const tx = db.transaction('syncQueue', 'readwrite');
  await tx.objectStore('syncQueue').clear();
  await tx.done;
}

// ==========================================
// Sync Utilities
// ==========================================

export async function getPendingSyncCount(): Promise<number> {
  const db = await initDB();
  const queue = await db.getAll('syncQueue');
  return queue.length;
}

export async function hasPendingSync(): Promise<boolean> {
  const count = await getPendingSyncCount();
  return count > 0;
}

// ==========================================
// Storage Statistics
// ==========================================

export async function getStorageStats() {
  const db = await initDB();

  const [sessions, submissions, cached, syncQueue] = await Promise.all([
    db.count('sessions'),
    db.count('submissions'),
    db.count('cachedQuestions'),
    db.count('syncQueue'),
  ]);

  return {
    sessions,
    submissions,
    cachedQuestions: cached,
    pendingSync: syncQueue,
  };
}

// ==========================================
// Cleanup & Maintenance
// ==========================================

export async function cleanupOldData(): Promise<void> {
  const db = await initDB();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Clean up completed sessions older than 7 days
  const allSessions = await db.getAll('sessions');
  for (const session of allSessions) {
    if (
      session.status === 'completed' &&
      session.completedAt &&
      session.completedAt < oneWeekAgo
    ) {
      await db.delete('sessions', session.id);

      // Also delete associated submissions
      const submissions = await getSessionSubmissions(session.id);
      for (const sub of submissions) {
        await db.delete('submissions', sub.id);
      }
    }
  }

  // Clean up expired cache
  await clearExpiredCache();
}

// ==========================================
// Export & Import (for debugging/backup)
// ==========================================

export async function exportAllData() {
  const db = await initDB();

  const [sessions, submissions, cached, syncQueue] = await Promise.all([
    db.getAll('sessions'),
    db.getAll('submissions'),
    db.getAll('cachedQuestions'),
    db.getAll('syncQueue'),
  ]);

  return {
    sessions,
    submissions,
    cachedQuestions: cached,
    syncQueue,
    exportedAt: new Date().toISOString(),
  };
}

export async function clearAllData(): Promise<void> {
  const db = await initDB();

  const tx = db.transaction(
    ['sessions', 'submissions', 'cachedQuestions', 'syncQueue'],
    'readwrite'
  );

  await Promise.all([
    tx.objectStore('sessions').clear(),
    tx.objectStore('submissions').clear(),
    tx.objectStore('cachedQuestions').clear(),
    tx.objectStore('syncQueue').clear(),
  ]);

  await tx.done;
}
