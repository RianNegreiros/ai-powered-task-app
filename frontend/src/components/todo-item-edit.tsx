import { useState, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TagSelector } from './tag-selector'
import { PriorityPicker } from './priority-picker'
import { DatePickerButton } from './date-picker-button'
import type { Task, Priority } from '@/types/task'
import type { Tag as TagEntity } from '@/lib/api-tags'

interface TodoItemEditProps {
  todo: Task
  tags: TagEntity[]
  index: number
  onSave: (
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'tags'>>
  ) => void
  onCancel: () => void
}

export function TodoItemEdit({ todo, tags, index, onSave, onCancel }: TodoItemEditProps) {
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description ?? '')
  const [priority, setPriority] = useState<Priority>(todo.priority)
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo.dueDate instanceof Date && !isNaN(todo.dueDate.getTime()) ? todo.dueDate : undefined
  )
  const [tagIds, setTagIds] = useState<string[]>(todo.tags.map((t) => t.id.toString()))
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    titleRef.current?.select()
  }, [])

  const handleSave = () => {
    if (!title.trim()) return
    const selectedTags = tags
      .filter((t) => tagIds.includes(t.id))
      .map((t) => ({ id: parseInt(t.id), name: t.name }))
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      dueDate: dueDate ?? null,
      tags: selectedTags,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
    if (e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <div
      className={cn(
        'animate-slide-up flex flex-col gap-4 px-5 py-5',
        'border-glass-border/60 border-b last:border-b-0',
        'bg-primary/5 dark:bg-primary/8',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
      )}
      style={{ animationDelay: `${index * 40}ms` }}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={titleRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-base leading-relaxed font-semibold transition-colors outline-none"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        rows={2}
        className={cn(
          'text-foreground placeholder:text-muted-foreground/50 w-full resize-none rounded-xl bg-transparent text-sm leading-relaxed outline-none',
          'bg-glass-bg/50 border-glass-border/60 border px-4 py-3',
          'focus:border-primary/40 focus:bg-glass-bg/70 transition-all duration-200'
        )}
      />

      <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
        <TagSelector tags={tags} selectedIds={tagIds} onChange={setTagIds} />

        <PriorityPicker value={priority} onChange={setPriority} />

        <DatePickerButton value={dueDate} onChange={setDueDate} />
      </div>

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-foreground/70 hover:text-foreground hover:bg-glass-bg/70 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!title.trim()}
          className={cn(
            'flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200',
            'bg-primary text-primary-foreground shadow-sm',
            'hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100'
          )}
        >
          <Check className="size-4" />
          Save
        </button>
      </div>
    </div>
  )
}
