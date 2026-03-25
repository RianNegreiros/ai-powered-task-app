import { useState } from 'react'
import { Plus, Calendar as CalendarIcon, SlidersHorizontal, X, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRIORITY_OPTIONS } from '@/config/priority'
import { TagSelector } from './tag-selector'
import { PriorityPicker } from './priority-picker'
import { DatePickerButton } from './date-picker-button'
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

            <PriorityPicker value={priority} onChange={setPriority} />

            <DatePickerButton value={dueDate} onChange={setDueDate} />

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
