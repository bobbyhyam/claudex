import { memo } from 'react';
import iconDark from '/assets/images/icon-dark.svg';
import iconLight from '/assets/images/icon-white.svg';

export const LoadingIndicator = memo(function LoadingIndicator() {
  return (
    <div className="flex animate-fade-in-up items-center justify-center pb-2 pt-4">
      <div className="relative flex items-center gap-2 overflow-hidden rounded-full border border-border/50 bg-surface-tertiary/80 px-3 py-1.5 dark:border-border-dark/50 dark:bg-surface-dark-tertiary/80">
        <div className="animate-icon-pulse">
          <img src={iconDark} alt="" className="h-3.5 w-3.5 dark:hidden" />
          <img src={iconLight} alt="" className="hidden h-3.5 w-3.5 dark:block" />
        </div>

        <span className="text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary">
          Thinking
        </span>

        <div className="flex items-center gap-[3px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1 w-1 animate-dot-pulse rounded-full bg-text-quaternary dark:bg-text-dark-quaternary"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 animate-shimmer-slide bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/[0.04]" />
      </div>
    </div>
  );
});
