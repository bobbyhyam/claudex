import type { MarketplacePlugin } from '@/types/marketplace.types';
import { ChevronRight, Check } from 'lucide-react';

interface PluginCardProps {
  plugin: MarketplacePlugin;
  isInstalled: boolean;
  onClick: () => void;
}

export const PluginCard: React.FC<PluginCardProps> = ({ plugin, isInstalled, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col rounded-xl border border-border/50 p-4 text-left transition-all duration-200 hover:border-border-hover dark:border-border-dark/50 dark:hover:border-border-dark-hover"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-xs font-medium text-text-primary dark:text-text-dark-primary">
              {plugin.name}
            </h3>
            {isInstalled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-active px-1.5 py-0.5 text-2xs font-medium text-text-secondary dark:bg-surface-dark-active dark:text-text-dark-secondary">
                <Check className="h-2.5 w-2.5" />
                Installed
              </span>
            )}
          </div>
          {plugin.author?.name && (
            <p className="mt-0.5 text-2xs text-text-tertiary dark:text-text-dark-tertiary">
              by {plugin.author.name}
            </p>
          )}
        </div>
        {plugin.version && (
          <span className="flex-shrink-0 font-mono text-2xs text-text-quaternary dark:text-text-dark-quaternary">
            {plugin.version}
          </span>
        )}
      </div>

      <p className="mb-3 line-clamp-2 flex-1 text-2xs text-text-tertiary dark:text-text-dark-tertiary">
        {plugin.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-surface-tertiary px-2 py-0.5 text-2xs font-medium text-text-tertiary dark:bg-surface-dark-tertiary dark:text-text-dark-tertiary">
          {plugin.category}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-text-quaternary transition-colors duration-200 group-hover:text-text-secondary dark:text-text-dark-quaternary dark:group-hover:text-text-dark-secondary" />
      </div>
    </button>
  );
};
