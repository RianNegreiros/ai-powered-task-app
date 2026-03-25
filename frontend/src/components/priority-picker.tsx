import { Flag, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { PRIORITY_OPTIONS } from '@/config/priority'
import type { Priority } from '@/types/task'

interface PriorityPickerProps {
  value: Priority
  onChange: (value: Priority) => void
  className?: string
}

export function PriorityPicker({ value, onChange, className }: PriorityPickerProps) {
  const current = PRIORITY_OPTIONS.find((p) => p.value === value)!
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur-xl transition-all duration-200',
            'bg-glass-bg/70 border-glass-border hover:bg-glass-bg hover:border-primary/30',
            value !== 'none' ? cn(current.color, 'border-current/20') : 'text-muted-foreground/60',
            className
          )}
        >
          <Flag className="size-3.5" />
          {current.label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {PRIORITY_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex cursor-pointer items-center gap-2.5',
              value === opt.value ? opt.color : 'text-foreground/70'
            )}
          >
            <span className={cn('size-2 shrink-0 rounded-full', opt.dot)} />
            {opt.label}
            {value === opt.value && <Check className="text-primary ml-auto size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
