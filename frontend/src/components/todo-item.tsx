import { useState, useRef, useEffect } from 'react'
import { X, Calendar as CalendarIcon, Flag, Tag, Pencil, Check, FileText } from 'lucide-react'
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
import type { Tag as TagEntity } from '@/lib/api-tags'

export type Priority = 'low' | 'medium' | 'high' | 'critical' | 'none'

export interface TaskTag {
  id: number
  name: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  createdAt: Date
  priority: Priority
  dueDate: Date | null
  tags: TaskTag[]
}

const priorityConfig: Record<
  Priority,
  { color: string; ringColor: string; bgColor: string; label: string }
> = {
  critical: {
    color: 'text-rose-600 dark:text-rose-400',
    ringColor: 'border-rose-500/70 dark:border-rose-400/60',
    bgColor: 'bg-rose-500/10 dark:bg-rose-400/15',
    label: 'Critical',
  },
  high: {
    color: 'text-red-500 dark:text-red-400',
    ringColor: 'border-red-400/60 dark:border-red-400/50',
    bgColor: 'bg-red-500/10 dark:bg-red-400/15',
    label: 'High',
  },
  medium: {
    color: 'text-amber-500 dark:text-amber-400',
    ringColor: 'border-amber-400/60 dark:border-amber-400/50',
    bgColor: 'bg-amber-500/10 dark:bg-amber-400/15',
    label: 'Medium',
  },
  low: {
    color: 'text-sky-500 dark:text-sky-400',
    ringColor: 'border-sky-400/60 dark:border-sky-400/50',
    bgColor: 'bg-sky-500/10 dark:bg-sky-400/15',
    label: 'Low',
  },
  none: {
    color: 'text-muted-foreground/40',
    ringColor: 'border-foreground/20',
    bgColor: '',
    label: 'None',
  },
}

function formatDueDate(date: Date): { label: string; isOverdue: boolean; isSoon: boolean } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const due = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffMs = due.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0)
    return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isSoon: false }
  if (diffDays === 0) return { label: 'Today', isOverdue: false, isSoon: true }
  if (diffDays === 1) return { label: 'Tomorrow', isOverdue: false, isSoon: true }
  if (diffDays <= 7) return { label: `${diffDays}d`, isOverdue: false, isSoon: true }
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue: false,
    isSoon: false,
  }
}

interface TodoItemProps {
  todo: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'tags'>>
  ) => void
  index: number
  tags: TagEntity[]
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate, index, tags }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Edit form state
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description ?? '')
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority)
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(
    todo.dueDate instanceof Date && !isNaN(todo.dueDate.getTime()) ? todo.dueDate : undefined
  )
  const [editTagIds, setEditTagIds] = useState<string[]>(
    todo.tags.map((t) => t.id.toString())
  )

  const editTitleRef = useRef<HTMLInputElement>(null)

  const pCfg = priorityConfig[todo.priority] || priorityConfig.none

  const due =
    todo.dueDate instanceof Date && !isNaN(todo.dueDate.getTime())
      ? formatDueDate(todo.dueDate)
      : null

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(todo.id), 280)
  }

  const handleStartEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description ?? '')
    setEditPriority(todo.priority)
    setEditDueDate(
      todo.dueDate instanceof Date && !isNaN(todo.dueDate.getTime()) ? todo.dueDate : undefined
    )
    setEditTagIds(todo.tags.map((t) => t.id.toString()))
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return
    const selectedTags = tags.filter((t) => editTagIds.includes(t.id)).map((t) => ({ id: parseInt(t.id), name: t.name }))
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
      priority: editPriority,
      dueDate: editDueDate || null,
      tags: selectedTags,
    })
    setIsEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancelEdit()
    if (e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault()
      handleSaveEdit()
    }
  }

  useEffect(() => {
    if (isEditing && editTitleRef.current) {
      editTitleRef.current.focus()
      editTitleRef.current.select()
    }
  }, [isEditing])

  const currentEditPriority = priorityOptions.find((p) => p.value === editPriority)!

  // ── Edit mode ──
  if (isEditing) {
    return (
      <div
        className={cn(
          'animate-slide-up flex flex-col gap-4 px-5 py-5',
          'border-glass-border/60 border-b last:border-b-0',
          'bg-primary/5 dark:bg-primary/8',
          'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
        )}
        style={{ animationDelay: `${index * 40}ms` }}
        onKeyDown={handleEditKeyDown}
      >
        {/* Title input */}
        <input
          ref={editTitleRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title..."
          className={cn(
            'text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-base leading-relaxed font-semibold outline-none',
            'focus:placeholder:text-muted-foreground/70 transition-colors'
          )}
        />

        {/* Description textarea */}
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Add a description..."
          rows={2}
          className={cn(
            'text-foreground placeholder:text-muted-foreground/50 w-full resize-none rounded-xl bg-transparent text-sm leading-relaxed outline-none',
            'bg-glass-bg/50 border-glass-border/60 border px-4 py-3',
            'focus:border-primary/40 focus:bg-glass-bg/70 transition-all duration-200',
            'dark:focus:shadow-[0_0_0_3px_var(--primary)/0.1]'
          )}
        />

        {/* Options row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
          {/* Tag selector */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200',
                  'bg-glass-bg/70 border-glass-border/60 hover:border-glass-border hover:bg-glass-bg border backdrop-blur-xl',
                  editTagIds.length > 0 ? 'text-foreground/80' : 'text-muted-foreground/50'
                )}
              >
                <Tag className="size-3.5" />
                {editTagIds.length > 0 ? `${editTagIds.length} tag${editTagIds.length > 1 ? 's' : ''}` : 'Tags'}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-52 p-2">
              <div className="max-h-60 space-y-1 overflow-y-auto">
                {tags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setEditTagIds(prev => 
                      prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id]
                    )}
                    className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                  >
                    <div className={cn(
                      "flex size-4 items-center justify-center rounded border",
                      editTagIds.includes(t.id) ? "bg-primary border-primary" : "border-input"
                    )}>
                      {editTagIds.includes(t.id) && <Check className="size-3 text-primary-foreground" />}
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
                  'flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200',
                  'bg-glass-bg/70 border-glass-border/60 hover:border-glass-border hover:bg-glass-bg border backdrop-blur-xl',
                  currentEditPriority.color
                )}
              >
                <Flag className="size-3.5" />
                {currentEditPriority.label}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {priorityOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setEditPriority(opt.value)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 text-sm',
                    editPriority === opt.value ? opt.color : 'text-foreground/80'
                  )}
                >
                  <span className={cn('size-2.5 shrink-0 rounded-full', opt.dot)} />
                  {opt.label}
                  {editPriority === opt.value && <Check className="text-primary ml-auto size-4" />}
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
                  'flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200',
                  'bg-glass-bg/70 border-glass-border/60 hover:border-glass-border hover:bg-glass-bg border backdrop-blur-xl',
                  editDueDate ? 'text-accent dark:text-accent' : 'text-muted-foreground/70'
                )}
              >
                <CalendarIcon className="size-3.5" />
                {editDueDate
                  ? editDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Due date'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={editDueDate}
                onSelect={setEditDueDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Save / Cancel row */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleCancelEdit}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              'text-foreground/70 hover:text-foreground hover:bg-glass-bg/70'
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveEdit}
            disabled={!editTitle.trim()}
            className={cn(
              'flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200',
              'bg-primary text-primary-foreground shadow-sm',
              'hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100',
              'dark:shadow-[0_2px_16px_var(--primary)/0.25]'
            )}
          >
            <Check className="size-4" />
            Save
          </button>
        </div>
      </div>
    )
  }

  // ── Read mode ──
  return (
    <div
      className={cn(
        'group animate-slide-up flex items-start gap-4 px-5 py-4',
        'transition-all duration-300 ease-out',
        'border-glass-border/50 border-b last:border-b-0',
        'hover:bg-foreground/2 dark:hover:bg-foreground/3',
        isDeleting && '-translate-x-2 scale-95 opacity-0'
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          'relative mt-1 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-300',
          todo.completed
            ? 'bg-primary dark:shadow-[0_0_8px_var(--primary)/0.3]'
            : cn('hover:border-primary/50 border-2', pCfg.ringColor)
        )}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg
            className="text-primary-foreground animate-check-pop size-3.5"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 8.5L7 11.5L12 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div
        className="flex min-w-0 flex-1 cursor-pointer flex-col gap-1.5"
        onClick={!todo.completed ? handleStartEdit : undefined}
        role={!todo.completed ? 'button' : undefined}
        tabIndex={!todo.completed ? 0 : undefined}
        onKeyDown={
          !todo.completed
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleStartEdit()
                }
              }
            : undefined
        }
        aria-label={!todo.completed ? `Edit task: ${todo.title}` : undefined}
      >
        <span
          className={cn(
            'text-base leading-relaxed font-medium wrap-break-word transition-all duration-300',
            todo.completed
              ? 'text-muted-foreground/50 decoration-muted-foreground/30 line-through'
              : 'text-foreground'
          )}
        >
          {todo.title}
        </span>

        {/* Description preview */}
        {todo.description && !todo.completed && (
          <span className="text-muted-foreground dark:text-muted-foreground/70 flex items-start gap-1.5 text-[13px] leading-relaxed">
            <FileText className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span className="line-clamp-2">{todo.description}</span>
          </span>
        )}

        {/* Meta row: tag + priority badge + due date */}
        {!todo.completed && (todo.priority !== 'none' || due || todo.tags.length > 0) && (
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            {todo.tags.map((tag) => (
              <span key={tag.id} className="bg-foreground/8 text-foreground/80 dark:bg-foreground/10 dark:text-foreground/80 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
                <Tag className="size-3" aria-hidden="true" />
                <span>{tag.name}</span>
              </span>
            ))}
            {todo.priority !== 'none' && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                  pCfg.bgColor,
                  pCfg.color
                )}
              >
                <Flag className="size-3" aria-hidden="true" />
                <span>{pCfg.label}</span>
              </span>
            )}
            {due && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                  due.isOverdue
                    ? 'bg-red-500/15 text-red-600 dark:bg-red-400/20 dark:text-red-400'
                    : due.isSoon
                      ? 'bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400'
                      : 'bg-glass-bg text-muted-foreground'
                )}
              >
                <CalendarIcon className="size-3" aria-hidden="true" />
                <span>{due.label}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-1 flex shrink-0 items-center gap-1">
        {/* Edit button */}
        {!todo.completed && (
          <button
            onClick={handleStartEdit}
            className={cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200',
              'opacity-0 group-hover:opacity-100 focus:opacity-100',
              'text-muted-foreground hover:text-primary hover:bg-primary/10',
              'focus:ring-primary/40 focus:ring-2 focus:outline-none'
            )}
            aria-label={`Edit task: ${todo.title}`}
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
        )}
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200',
            'opacity-0 group-hover:opacity-100 focus:opacity-100',
            'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
            'focus:ring-destructive/40 focus:ring-2 focus:outline-none'
          )}
          aria-label={`Delete todo: ${todo.title}`}
        >
          <X className="size-4.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
