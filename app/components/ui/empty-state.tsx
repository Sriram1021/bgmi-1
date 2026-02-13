import { type ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center pb-24', className)}>
      {icon && (
        <div className="mb-6 opacity-40 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      )}
      <h3 className="text-3xl font-black text-zinc-900 mb-4 uppercase tracking-[0.1em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        {title}
      </h3>
      {description && (
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs max-w-sm mb-10 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-both">{action}</div>}
    </div>
  );
}
