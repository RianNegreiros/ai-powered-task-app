import { Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface DatePickerButtonProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  className?: string
}

export function DatePickerButton({ value, onChange, className }: DatePickerButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur-xl transition-all duration-200',
            'bg-glass-bg/70 border-glass-border hover:bg-glass-bg hover:border-primary/30',
            value ? 'text-accent border-accent/20' : 'text-muted-foreground/60',
            className
          )}
        >
          <CalendarIcon className="size-3.5" />
          {value
            ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : 'Due date'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </PopoverContent>
    </Popover>
  )
}
