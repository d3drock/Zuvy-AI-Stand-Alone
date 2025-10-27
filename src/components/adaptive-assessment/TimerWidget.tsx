'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerWidgetProps {
  timeRemaining: number; // in seconds
  onTimeUp?: () => void;
  className?: string;
}

export function TimerWidget({ timeRemaining, onTimeUp, className }: TimerWidgetProps) {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    setTime(timeRemaining);
  }, [timeRemaining]);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (time < 300) return 'text-destructive'; // Less than 5 minutes
    if (time < 600) return 'text-warning'; // Less than 10 minutes
    return 'text-foreground';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className={`h-4 w-4 ${getTimeColor()}`} />
      <span className={`font-mono text-body1 font-semibold ${getTimeColor()}`}>
        {formatTime(time)}
      </span>
    </div>
  );
}
