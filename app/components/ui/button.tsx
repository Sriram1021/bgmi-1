import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'link' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-netflix-red text-white hover:bg-netflix-red-dark active:bg-netflix-red-dark shadow-sm',
      secondary:
        'bg-netflix-gray-700 text-white hover:bg-netflix-gray-600 active:bg-netflix-gray-600',
      accent:
        'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
      ghost:
        'text-netflix-gray-300 hover:text-white hover:bg-netflix-gray-800 active:bg-netflix-gray-700',
      link:
        'text-netflix-red hover:text-netflix-red-light underline-offset-4 hover:underline p-0',
      outline:
        'border border-netflix-gray-600 text-netflix-gray-300 hover:bg-netflix-gray-800 hover:text-white hover:border-netflix-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-sm gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-netflix-red/50 focus:ring-offset-2 focus:ring-offset-netflix-black',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
