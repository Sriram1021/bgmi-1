import { type HTMLAttributes } from 'react';
import { cn } from '@/app/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'live' | 'new';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'secondary',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    primary: 'bg-netflix-red text-white',
    secondary: 'bg-netflix-gray-800 text-netflix-gray-300',
    success: 'bg-green-500/15 text-green-400',
    warning: 'bg-yellow-500/15 text-yellow-400',
    error: 'bg-red-500/15 text-red-400',
    info: 'bg-blue-500/15 text-blue-400',
    live: 'bg-netflix-red text-white',
    new: 'bg-green-500 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wide rounded',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
