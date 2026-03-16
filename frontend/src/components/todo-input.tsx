import { useState } from 'react'
import { Plus, Flag, Calendar as CalendarIcon, SlidersHorizontal, X, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { PRIORITY_OPTIONS } from '@/config/priority'
import { TagSelector } from './tag-selector'
import type { Priority, TaskTag } from '@/types/task'
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
  onTagCreated?: (tag: TagEntity) => void
}

export function TodoInput({ onAdd, tags, onTagCreated }: TodoInputProps) {
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [showOptions, setShowOptions] = useState(false)

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === priority)!
  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id))
  const hasOptions =
    priority !== 'none' || dueDate || selectedTagIds.length > 0 || description.trim() !== ''
  const showPanel = showOptions && text.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const taskTags = selectedTags.map((t) => ({ id: parseInt(t.id), name: t.name }))
    onAdd(text.trim(), priority, dueDate ?? null, taskTags, description.trim() || null)
    setText('')
    setDescription('')
    setPriority('none')
    setDueDate(undefined)
    setSelectedTagIds([])
    setShowOptions(false)
  }

  const clearOptions = () => {
    setDescription('')
    setPriority('none')
    setDueDate(undefined)
    setSelectedTagIds([])
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-5">
      {/* Main row */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!text.trim()}
          className={cn(
            'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40',
            text.trim()
              ? 'bg-primary text-primary-foreground shadow-primary/25 hover:shadow-primary/30 shadow-md hover:shadow-lg hover:brightness-110 active:scale-95'
              : 'border-primary/30 text-primary/30 border-2'
          )}
          aria-label="Add task"
        >
          <Plus className="size-4" strokeWidth={2.5} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task..."
          className="text-foreground placeholder:text-muted-foreground/50 flex-1 bg-transparent text-[17px] font-medium outline-none"
        />

        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          disabled={!text.trim()}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 backdrop-blur-xl transition-all duration-200',
            text.trim()
              ? showOptions || hasOptions
                ? 'bg-primary/15 text-primary border-primary/25 dark:bg-primary/20'
                : 'bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg hover:border-primary/30'
              : 'pointer-events-none border-transparent opacity-0'
          )}
          aria-label="Toggle options"
        >
          <SlidersHorizontal className="size-3.5" />
          <span className="text-xs font-medium">Options</span>
        </button>
      </div>

      {/* Options panel */}
      {showPanel && (
        <div className="mt-3 ml-12 flex flex-col gap-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={2}
            className={cn(
              'text-foreground placeholder:text-muted-foreground/40 w-full resize-none rounded-2xl bg-transparent text-sm leading-relaxed outline-none',
              'bg-glass-bg/40 border-glass-border/50 border px-4 py-3',
              'focus:border-primary/40 focus:bg-glass-bg/60 transition-colors duration-200'
            )}
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <TagSelector
              tags={tags}
              selectedIds={selectedTagIds}
              onChange={setSelectedTagIds}
              onTagCreated={onTagCreated}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur-xl transition-all duration-200',
                    'bg-glass-bg/70 border-glass-border hover:bg-glass-bg hover:border-primary/30',
                    priority !== 'none'
                      ? cn(currentPriority.color, 'border-current/20')
                      : 'text-muted-foreground/60'
                  )}
                >
                  <Flag className="size-3.5" />
                  {currentPriority.label}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                {PRIORITY_OPTIONS.map((opt) => (
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

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur-xl transition-all duration-200',
                    'bg-glass-bg/70 border-glass-border hover:bg-glass-bg hover:border-primary/30',
                    dueDate ? 'text-accent border-accent/20' : 'text-muted-foreground/60'
                  )}
                >
                  <CalendarIcon className="size-3.5" />
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

            {hasOptions && (
              <button
                type="button"
                onClick={clearOptions}
                className="text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200"
              >
                <X className="size-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Collapsed summary */}
      {!showOptions && hasOptions && text.trim() && (
        <div className="mt-2 ml-12 flex flex-wrap items-center gap-2">
          {description.trim() && (
            <span className="bg-foreground/5 text-foreground/50 dark:bg-foreground/8 inline-flex max-w-50 truncate rounded-full px-2.5 py-1 text-[11px] font-medium italic">
              {description.trim()}
            </span>
          )}
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="bg-foreground/5 text-foreground/60 dark:bg-foreground/8 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
            >
              {tag.name}
            </span>
          ))}
          {priority !== 'none' && (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                currentPriority.bgColor,
                currentPriority.color
              )}
            >
              <Flag className="size-2.5" />
              {currentPriority.label}
            </span>
          )}
          {dueDate && (
            <span className="bg-accent/10 text-accent inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold">
              <CalendarIcon className="size-2.5" />
              {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      )}
    </form>
  )
}
