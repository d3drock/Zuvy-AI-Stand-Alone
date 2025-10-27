import {
  getPendingSubmissions,
  updateSubmissionSyncStatus,
  getSyncQueue,
  removeFromSyncQueue,
  updateSyncQueueItem,
  saveSession,
} from './offline-storage';
import { QuestionSubmission, OfflineQueueItem } from '@/types/adaptive-assessment';

// ==========================================
// Sync Configuration
// ==========================================

const SYNC_CONFIG = {
  retryDelay: 30000, // 30 seconds
  maxRetries: 3,
  batchSize: 5, // Sync 5 items at a time
};

// ==========================================
// Sync Manager Class
// ==========================================

class SyncManager {
  private syncInterval: NodeJS.Timeout | null = null;
  private isSyncing = false;
  private isOnline = true;
  private listeners: ((status: SyncStatus) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupOnlineListener();
      this.startAutoSync();
    }
  }

  // Setup online/offline listeners
  private setupOnlineListener() {
    window.addEventListener('online', () => {
      console.log('🟢 Online - resuming sync');
      this.isOnline = true;
      this.notifyListeners({
        isOnline: true,
        isSyncing: false,
        pendingCount: 0,
        lastSyncAt: null,
      });
      this.syncNow();
    });

    window.addEventListener('offline', () => {
      console.log('🔴 Offline - pausing sync');
      this.isOnline = false;
      this.notifyListeners({
        isOnline: false,
        isSyncing: false,
        pendingCount: 0,
        lastSyncAt: null,
      });
    });

    // Check initial status
    this.isOnline = navigator.onLine;
  }

  // Start automatic sync every 30 seconds
  private startAutoSync() {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(async () => {
      if (this.isOnline && !this.isSyncing) {
        await this.syncNow();
      }
    }, SYNC_CONFIG.retryDelay);
  }

  // Stop automatic sync
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Main sync function
  async syncNow(): Promise<SyncResult> {
    if (!this.isOnline) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        error: 'Device is offline',
      };
    }

    if (this.isSyncing) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        error: 'Sync already in progress',
      };
    }

    this.isSyncing = true;
    this.notifyListeners({
      isOnline: this.isOnline,
      isSyncing: true,
      pendingCount: 0,
      lastSyncAt: null,
    });

    try {
      const result = await this.performSync();
      this.notifyListeners({
        isOnline: this.isOnline,
        isSyncing: false,
        pendingCount: result.failed,
        lastSyncAt: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      console.error('Sync error:', error);
      this.notifyListeners({
        isOnline: this.isOnline,
        isSyncing: false,
        pendingCount: 0,
        lastSyncAt: null,
      });
      return {
        success: false,
        synced: 0,
        failed: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      this.isSyncing = false;
    }
  }

  // Perform actual sync
  private async performSync(): Promise<SyncResult> {
    let synced = 0;
    let failed = 0;

    // 1. Sync pending submissions
    const pendingSubmissions = await getPendingSubmissions();
    console.log(`📤 Syncing ${pendingSubmissions.length} pending submissions`);

    for (const submission of pendingSubmissions.slice(0, SYNC_CONFIG.batchSize)) {
      try {
        await this.syncSubmission(submission);
        synced++;
      } catch (error) {
        console.error(`Failed to sync submission ${submission.id}:`, error);
        failed++;
      }
    }

    // 2. Sync queue items
    const queueItems = await getSyncQueue();
    console.log(`📤 Syncing ${queueItems.length} queue items`);

    for (const item of queueItems.slice(0, SYNC_CONFIG.batchSize)) {
      try {
        await this.syncQueueItem(item);
        synced++;
      } catch (error) {
        console.error(`Failed to sync queue item ${item.id}:`, error);
        failed++;
      }
    }

    return {
      success: failed === 0,
      synced,
      failed,
    };
  }

  // Sync a single submission
  private async syncSubmission(submission: QuestionSubmission): Promise<void> {
    // In production, send to API
    // For now, simulate API call
    await this.simulateAPICall();

    // Mark as synced
    await updateSubmissionSyncStatus(submission.id, 'synced');
    console.log(`✅ Synced submission ${submission.id}`);
  }

  // Sync a queue item
  private async syncQueueItem(item: OfflineQueueItem): Promise<void> {
    if (item.retryCount >= SYNC_CONFIG.maxRetries) {
      console.warn(`⚠️  Max retries reached for ${item.id}, removing from queue`);
      await removeFromSyncQueue(item.id);
      return;
    }

    try {
      // In production, send to API based on type
      await this.simulateAPICall();

      // Remove from queue on success
      await removeFromSyncQueue(item.id);
      console.log(`✅ Synced queue item ${item.id}`);
    } catch (error) {
      // Update retry count
      item.retryCount++;
      item.lastRetryAt = new Date().toISOString();
      await updateSyncQueueItem(item);
      throw error;
    }
  }

  // Simulate API call (replace with real API in production)
  private async simulateAPICall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  // Add listener for sync status changes
  onStatusChange(callback: (status: SyncStatus) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  // Notify all listeners
  private notifyListeners(status: SyncStatus) {
    this.listeners.forEach((listener) => listener(status));
  }

  // Get current sync status
  async getStatus(): Promise<SyncStatus> {
    const pendingSubmissions = await getPendingSubmissions();
    const queueItems = await getSyncQueue();

    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: pendingSubmissions.length + queueItems.length,
      lastSyncAt: null, // Could be stored in localStorage
    };
  }
}

// ==========================================
// Types
// ==========================================

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt: string | null;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  error?: string;
}

// ==========================================
// Singleton Instance
// ==========================================

let syncManagerInstance: SyncManager | null = null;

export function getSyncManager(): SyncManager {
  if (!syncManagerInstance) {
    syncManagerInstance = new SyncManager();
  }
  return syncManagerInstance;
}

// ==========================================
// Utility Hooks (for React components)
// ==========================================

export function useSyncManager() {
  const manager = getSyncManager();
  return manager;
}
