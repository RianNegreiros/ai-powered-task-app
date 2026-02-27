'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  isLoading?: boolean
}

export function GlassButton({
  children,
  variant = 'primary',
  isLoading,
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'relative flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold tracking-wide',
        'transition-all duration-300 active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && [
          'bg-primary text-primary-foreground',
          'shadow-[0_2px_16px_var(--primary)/0.3,inset_0_1px_0_oklch(1_0_0/0.2)]',
          'hover:shadow-[0_4px_24px_var(--primary)/0.4,inset_0_1px_0_oklch(1_0_0/0.2)]',
          'hover:brightness-110',
        ],
        variant === 'ghost' && [
          'bg-glass-bg/40 text-foreground backdrop-blur-xl',
          'border-glass-border border',
          'shadow-[inset_0_1px_0_var(--glass-highlight)]',
          'hover:bg-glass-bg/70',
        ],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
