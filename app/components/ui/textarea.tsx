import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/app/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-netflix-gray-300 mb-1.5 uppercase tracking-widest">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 text-sm bg-netflix-gray-800 border border-netflix-gray-700 rounded-xl',
            'text-white placeholder:text-netflix-gray-500',
            'focus:outline-none focus:ring-1 focus:ring-netflix-red focus:border-netflix-red',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200 min-h-[120px] resize-none',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-netflix-gray-500 font-medium">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
