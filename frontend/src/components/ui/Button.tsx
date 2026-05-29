import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
};

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-white text-ink shadow-glow hover:bg-brand',
        variant === 'secondary' && 'border border-line bg-white/8 text-white hover:bg-white/12',
        variant === 'ghost' && 'text-white/75 hover:bg-white/8 hover:text-white',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
