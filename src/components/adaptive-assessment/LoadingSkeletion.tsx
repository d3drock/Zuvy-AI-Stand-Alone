'use client';
import React, { useEffect, useState } from 'react';

/**
 * TypingSkeleton
 * ChatGPT-style loading animation with auto-progressing statuses:
 *  “Thinking…” → “Generating…” → “Getting it…” → “Done!”
 *  Controlled by a prop: isLoading
 *
 * Props:
 *  - isLoading: boolean → when true, starts animation; when false, fades out
 *  - size: 'sm' | 'md' | 'lg' → affects padding and dot size
 *  - className: optional bubble classes
 */

type SizeKey = 'sm' | 'md' | 'lg';

const SIZES: Record<SizeKey, { bubble: string; dot: string; gap: string }> = {
  sm: { bubble: 'px-3 py-1.5', dot: 'w-2 h-2', gap: 'gap-1' },
  md: { bubble: 'px-4 py-2', dot: 'w-2.5 h-2.5', gap: 'gap-2' },
  lg: { bubble: 'px-6 py-3', dot: 'w-3 h-3', gap: 'gap-2.5' }
};

type TypingSkeletonProps = {
  isLoading?: boolean;
  size?: SizeKey;
  className?: string;
  ariaLabel?: string;
};

export default function TypingSkeleton({ isLoading = false, size = 'md', className = '', ariaLabel = 'Assistant is typing' }: TypingSkeletonProps) {
  const cfg = SIZES[size] || SIZES.md;
  const [status, setStatus] = useState('Thinking…');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setStatus('Thinking…');
      const sequence = ['Thinking…', 'Generating…', 'Getting it…', 'Done!'];
      let i = 0;
      const interval = setInterval(() => {
        i++;
        if (i < sequence.length) setStatus(sequence[i]);
        else {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 1000);
        }
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setVisible(false);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="flex items-center">
      <div
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
        className={`relative inline-flex items-center rounded-2xl ${cfg.bubble} ${className} select-none bg-white/5 transition-opacity duration-700 ease-out`}
      >
        <div className={`flex items-center ${cfg.gap}`}>
          <span className={`dot ${cfg.dot}`} aria-hidden="true"></span>
          <span className={`dot ${cfg.dot}`} aria-hidden="true"></span>
          <span className={`dot ${cfg.dot}`} aria-hidden="true"></span>
        </div>
        <span className="ml-3 text-sm text-white/80">{status}</span>

        <div aria-hidden className="absolute inset-0 rounded-2xl pointer-events-none shimmer" />

        <style jsx>{`
          .dot {
            display: inline-block;
            background-color: rgba(255,255,255,0.9);
            border-radius: 9999px;
            transform-origin: center;
            animation: dot-bounce 1.2s infinite ease-in-out;
            opacity: 0.95;
          }
          .dot:nth-child(1) { animation-delay: 0s; }
          .dot:nth-child(2) { animation-delay: 0.12s; }
          .dot:nth-child(3) { animation-delay: 0.24s; }

          @keyframes dot-bounce {
            0% { transform: translateY(0) scale(1); opacity: 0.6; }
            25% { transform: translateY(-4px) scale(1.06); opacity: 1; }
            50% { transform: translateY(0) scale(1); opacity: 0.8; }
            100% { transform: translateY(0) scale(1); opacity: 0.6; }
          }

          .shimmer {
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 60%, transparent 100%);
            transform: translateX(-30%);
            animation: shimmer 2.4s infinite;
            mix-blend-mode: overlay;
          }
          @keyframes shimmer {
            0% { transform: translateX(-30%); }
            50% { transform: translateX(30%); }
            100% { transform: translateX(110%); }
          }
        `}</style>
      </div>
    </div>
  );
}
