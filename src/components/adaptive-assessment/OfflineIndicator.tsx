'use client';

import { WifiOff, Wifi, CloudOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSyncStatus } from '@/lib/hooks/useSyncStatus';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({
  className,
}: OfflineIndicatorProps) {
  const { isOnline, isSyncing, pendingCount, syncNow } = useSyncStatus();

  if (isOnline && pendingCount === 0 && !isSyncing) {
    return (
      <Badge variant="outline" className={cn('gap-2', className)}>
        <CheckCircle2 className="h-3 w-3 text-success" />
        <span className="text-body2">All synced</span>
      </Badge>
    );
  }

  if (!isOnline) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Badge variant="destructive" className="gap-2">
          <WifiOff className="h-3 w-3" />
          <span className="text-body2">Offline</span>
        </Badge>
        {pendingCount > 0 && (
          <span className="text-body2 text-muted-foreground">
            {pendingCount} pending
          </span>
        )}
      </div>
    );
  }

  if (pendingCount > 0 || isSyncing) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Badge variant="secondary" className="gap-2">
          <AlertCircle className={cn('h-3 w-3 text-warning', isSyncing && 'animate-pulse')} />
          <span className="text-body2">{isSyncing ? 'Syncing...' : 'Pending'}</span>
        </Badge>
        <span className="text-body2 text-muted-foreground">
          {pendingCount} pending
        </span>
        {!isSyncing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={syncNow}
            className="h-6 px-2 text-xs"
          >
            Retry
          </Button>
        )}
      </div>
    );
  }

  return null;
}
