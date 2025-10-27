'use client';

import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressIndicator({
  current,
  total,
  showPercentage = true,
  className
}: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1">
        <Progress value={percentage} className="h-2" />
      </div>
      {showPercentage && (
        <div className="flex items-center gap-2 min-w-[100px]">
          <span className="text-body1 font-semibold text-foreground">
            {percentage}%
          </span>
          <span className="text-body2 text-muted-foreground">
            ({current}/{total})
          </span>
        </div>
      )}
    </div>
  );
}
