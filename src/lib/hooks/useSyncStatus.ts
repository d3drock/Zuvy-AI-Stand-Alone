'use client';

import { useState, useEffect } from 'react';
import { getSyncManager, SyncStatus } from '../sync-manager';

export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: true,
    isSyncing: false,
    pendingCount: 0,
    lastSyncAt: null,
  });

  useEffect(() => {
    const manager = getSyncManager();

    // Get initial status
    manager.getStatus().then(setStatus);

    // Subscribe to status changes
    const unsubscribe = manager.onStatusChange(setStatus);

    return () => {
      unsubscribe();
    };
  }, []);

  const syncNow = async () => {
    const manager = getSyncManager();
    return await manager.syncNow();
  };

  return {
    ...status,
    syncNow,
  };
}
