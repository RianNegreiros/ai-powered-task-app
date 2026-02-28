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
        'dark:shadow-[0_4px_32px_var(--glass-shadow),0_0_0_1px_oklch(1_0_0/0.03)_inset,0_1px_0_oklch(1_0_0/0.05)_inset]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
