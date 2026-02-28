import { useState } from 'react'
import { Plus, Flag, Calendar as CalendarIcon, SlidersHorizontal, Tag, X, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import type { Priority, Tag as TagType } from './todo-item'

const priorityOptions: { value: Priority; label: string; color: string; dot: string }[] = [
  { value: 'none', label: 'None', color: 'text-muted-foreground/50', dot: 'bg-muted-foreground/30' },
  { value: 'low', label: 'Low', color: 'text-sky-500 dark:text-sky-400', dot: 'bg-sky-500 dark:bg-sky-400' },
  { value: 'medium', label: 'Medium', color: 'text-amber-500 dark:text-amber-400', dot: 'bg-amber-500 dark:bg-amber-400' },
  { value: 'high', label: 'High', color: 'text-red-500 dark:text-red-400', dot: 'bg-red-500 dark:bg-red-400' },
  { value: 'critical', label: 'Critical', color: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-600 dark:bg-rose-400' },
]

interface TodoInputProps {
  onAdd: (text: string, priority: Priority, dueDate: Date | null, tag: TagType, description: string | null) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [tag, setTag] = useState('')
  const [showOptions, setShowOptions] = useState(false)

  const currentPriority = priorityOptions.find((p) => p.value === priority)!
  const hasOptions = priority !== 'none' || dueDate || tag.trim() !== '' || description.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(
        text.trim(),
        priority,
        dueDate || null,
        tag.trim() || null,
        description.trim() || null
      )
      setText('')
      setDescription('')
      setPriority('none')
      setDueDate(undefined)
      setTag('')
      setShowOptions(false)
    }
  }

  const clearOptions = () => {
    setDescription('')
    setPriority('none')
    setDueDate(undefined)
    setTag('')
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3">
      {/* Main input row */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!text.trim()}
          className={cn(
            'ursor-pointer flex size-[22px] shrink-0 items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
            text.trim()
              ? 'bg-primary text-primary-foreground'
              : 'border-primary/40 text-primary/40 border-[1.5px]'
          )}
          aria-label="Add todo"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task..."
          className="text-foreground placeholder:text-muted-foreground/50 flex-1 cursor-text bg-transparent text-[15px] outline-none"
        />

        {/* Toggle options button */}
        {text.trim() && (
          <button
            type="button"
            onClick={() => setShowOptions((v) => !v)}
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200',
              showOptions || hasOptions
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-glass-bg/60'
            )}
            aria-label="Toggle options"
          >
            <SlidersHorizontal className="size-3.5" />
          </button>
        )}
      </div>

      {/* Description row */}
      <div
        className={cn(
          'ml-[34px] overflow-hidden transition-all duration-300 ease-out',
          showOptions && text.trim() ? 'mt-2 max-h-24 opacity-100' : 'mt-0 max-h-0 opacity-0'
        )}
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
          rows={2}
          className={cn(
            'text-foreground placeholder:text-muted-foreground/40 w-full resize-none rounded-xl bg-transparent text-[13px] leading-relaxed outline-none',
            'bg-glass-bg/40 border-glass-border/50 border px-3 py-2',
            'focus:border-primary/30 focus:bg-glass-bg/60 transition-colors duration-200'
          )}
        />
      </div>

      {/* Options row - toggle via button */}
      <div
        className={cn(
          'ml-[34px] flex flex-wrap items-center gap-2 overflow-hidden transition-all duration-300 ease-out',
          showOptions && text.trim() ? 'mt-2 max-h-20 opacity-100' : 'mt-0 max-h-0 opacity-0'
        )}
      >
        {/* Tag input */}
        <div className="bg-glass-bg/60 border-glass-border relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 backdrop-blur-xl">
          <Tag
            className={cn(
              'size-3 shrink-0',
              tag.trim() ? 'text-foreground/60' : 'text-muted-foreground/40'
            )}
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag"
            className="text-foreground placeholder:text-muted-foreground/40 w-16 bg-transparent text-[11px] font-medium outline-none"
          />
        </div>

        {/* Priority picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200',
                'bg-glass-bg/60 border-glass-border hover:bg-glass-bg border backdrop-blur-xl',
                currentPriority.color
              )}
            >
              <Flag className="size-3" />
              {currentPriority.label}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            {priorityOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                className={cn(
                  'flex items-center gap-2.5 cursor-pointer',
                  priority === opt.value ? opt.color : 'text-foreground/70'
                )}
              >
                <span className={cn('size-2 shrink-0 rounded-full', opt.dot)} />
                {opt.label}
                {priority === opt.value && <Check className="text-primary ml-auto size-3.5" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Due date picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200',
                'bg-glass-bg/60 border-glass-border hover:bg-glass-bg border backdrop-blur-xl',
                dueDate ? 'text-accent' : 'text-muted-foreground/50'
              )}
            >
              <CalendarIcon className="size-3" />
              {dueDate
                ? dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'Due date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>

        {/* Clear all options */}
        {hasOptions && (
          <button
            type="button"
            onClick={clearOptions}
            className="text-muted-foreground/40 hover:text-muted-foreground ml-auto flex items-center gap-1 text-[11px] transition-colors duration-150"
          >
            <X className="size-3" />
            Clear
          </button>
        )}
      </div>

      {/* Active options summary (shown when options panel is collapsed but options are set) */}
      {!showOptions && hasOptions && text.trim() && (
        <div className="mt-1.5 ml-[34px] flex flex-wrap items-center gap-1.5">
          {description.trim() && (
            <span className="bg-foreground/5 text-foreground/50 dark:bg-foreground/8 dark:text-foreground/60 inline-flex max-w-[180px] truncate rounded-full px-2 py-0.5 text-[10px] font-medium italic">
              {description.trim()}
            </span>
          )}
          {tag.trim() && (
            <span className="bg-foreground/5 text-foreground/60 dark:bg-foreground/8 dark:text-foreground/70 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
              <Tag className="size-2" />
              {tag.trim()}
            </span>
          )}
          {priority !== 'none' && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                priority === 'low'
                  ? 'bg-sky-500/10 dark:bg-sky-400/15'
                  : priority === 'medium'
                    ? 'bg-amber-500/10 dark:bg-amber-400/15'
                    : priority === 'high'
                      ? 'bg-red-500/10 dark:bg-red-400/15'
                      : 'bg-rose-500/10 dark:bg-rose-400/15',
                currentPriority.color
              )}
            >
              <Flag className="size-2" />
              {currentPriority.label}
            </span>
          )}
          {dueDate && (
            <span className="bg-accent/10 text-accent inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
              <CalendarIcon className="size-2" />
              {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      )}
    </form>
  )
}
