import { useState } from 'react'
import {
  Plus,
  Flag,
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Tag,
  X,
  Check,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { priorityOptions } from './priority-config'
import type { Priority, TaskTag } from './todo-item'
import type { Tag as TagEntity } from '@/lib/api-tags'

interface TodoInputProps {
  onAdd: (
    text: string,
    priority: Priority,
    dueDate: Date | null,
    tags: TaskTag[],
    description: string | null
  ) => void
  tags: TagEntity[]
}

export function TodoInput({ onAdd, tags }: TodoInputProps) {
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [showOptions, setShowOptions] = useState(false)

  const currentPriority = priorityOptions.find((p) => p.value === priority)!
  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id))
  const hasOptions = priority !== 'none' || dueDate || selectedTagIds.length > 0 || description.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      const taskTags = selectedTags.map((t) => ({ id: parseInt(t.id), name: t.name }))
      onAdd(
        text.trim(),
        priority,
        dueDate || null,
        taskTags,
        description.trim() || null
      )
      setText('')
      setDescription('')
      setPriority('none')
      setDueDate(undefined)
      setSelectedTagIds([])
      setShowOptions(false)
    }
  }

  const clearOptions = () => {
    setDescription('')
    setPriority('none')
    setDueDate(undefined)
    setSelectedTagIds([])
  }

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
        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200',
            text.trim()
              ? showOptions || hasOptions
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-glass-bg/60'
              : 'pointer-events-none opacity-0'
          )}
          aria-label="Toggle options"
          disabled={!text.trim()}
        >
          <SlidersHorizontal className="size-3.5" />
        </button>
      </div>

      {/* Description row */}
      <div
        className={cn(
          'ml-[34px] overflow-hidden transition-all duration-300 ease-out',
          showOptions && text.trim() ? 'mt-2 opacity-100' : 'mt-0 max-h-0 opacity-0'
        )}
      >
        {showOptions && text.trim() && (
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
        )}
      </div>

      {/* Options row - toggle via button */}
      <div
        className={cn(
          'ml-[34px] flex flex-wrap items-center gap-2 overflow-hidden transition-all duration-300 ease-out',
          showOptions && text.trim() ? 'mt-2 opacity-100' : 'mt-0 max-h-0 opacity-0'
        )}
      >
        {/* Tag selector */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200',
                'bg-glass-bg/60 border-glass-border hover:bg-glass-bg border backdrop-blur-xl',
                selectedTagIds.length > 0 ? 'text-foreground/60' : 'text-muted-foreground/50'
              )}
            >
              <Tag className="size-3" />
              {selectedTagIds.length > 0 ? `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? 's' : ''}` : 'Tags'}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-48 p-2">
            <div className="max-h-60 space-y-1 overflow-y-auto">
              {tags.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTagIds(prev => 
                    prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id]
                  )}
                  className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                >
                  <div className={cn(
                    "flex size-4 items-center justify-center rounded border",
                    selectedTagIds.includes(t.id) ? "bg-primary border-primary" : "border-input"
                  )}>
                    {selectedTagIds.includes(t.id) && <Check className="size-3 text-primary-foreground" />}
                  </div>
                  <span className="flex-1 text-left">{t.name}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

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
                  'flex cursor-pointer items-center gap-2.5',
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
          {selectedTags.map((tag) => (
            <span key={tag.id} className="bg-foreground/5 text-foreground/60 dark:bg-foreground/8 dark:text-foreground/70 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
              <Tag className="size-2" />
              {tag.name}
            </span>
          ))}
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
