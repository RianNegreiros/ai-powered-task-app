'use client'

import { cn } from '@/lib/utils'

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassPanel({ children, className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl',
        'bg-glass-bg backdrop-blur-2xl',
        'border-glass-border border',
        'shadow-[0_4px_24px_var(--glass-shadow),inset_0_1px_0_var(--glass-highlight)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
