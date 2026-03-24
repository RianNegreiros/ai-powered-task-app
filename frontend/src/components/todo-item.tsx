import { useState } from 'react'
import { X, Calendar as CalendarIcon, Pencil } from 'lucide-react'
import { cn, tagHue } from '@/lib/utils'
import { PRIORITY_CONFIG } from '@/config/priority'
import { TodoItemEdit } from './todo-item-edit'
import type { Task } from '@/types/task'
import type { Tag as TagEntity } from '@/lib/api-tags'

export type { Priority, TaskTag, Task } from '@/types/task'

function formatDueDate(date: Date): { label: string; isOverdue: boolean; isSoon: boolean } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000)

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

// Fix 6: `compact` was always true — removed the prop and all dead non-compact branches.
// Kept only the compact layout (small padding, small icons, no description, no priority badge).
export function TodoItem({ todo, onToggle, onDelete, onUpdate, index, tags }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [completionFlash, setCompletionFlash] = useState(false)

  const pCfg = PRIORITY_CONFIG[todo.priority] ?? PRIORITY_CONFIG.none
  const due =
    todo.dueDate instanceof Date && !isNaN(todo.dueDate.getTime())
      ? formatDueDate(todo.dueDate)
      : null

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(todo.id), 280)
  }

  const handleToggle = () => {
    if (!todo.completed) {
      setCompletionFlash(true)
      setTimeout(() => setCompletionFlash(false), 700)
    }
    onToggle(todo.id)
  }

  if (isEditing) {
    return (
      <TodoItemEdit
        todo={todo}
        tags={tags}
        index={index}
        onSave={(updates) => {
          onUpdate(todo.id, updates)
          setIsEditing(false)
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div
      className={cn(
        'group animate-slide-up relative flex items-start gap-3 px-3 py-3 transition-all duration-300 ease-out',
        due?.isOverdue
          ? 'hover:bg-red-500/5 dark:hover:bg-red-400/5'
          : 'hover:bg-foreground/2 dark:hover:bg-foreground/3',
        completionFlash && 'animate-completion-flash',
        isDeleting && '-translate-x-2 scale-95 opacity-0'
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          'relative mt-0.5 flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-300',
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
        onClick={!todo.completed ? () => setIsEditing(true) : undefined}
        role={!todo.completed ? 'button' : undefined}
        tabIndex={!todo.completed ? 0 : undefined}
        onKeyDown={
          !todo.completed
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIsEditing(true)
                }
              }
            : undefined
        }
        aria-label={!todo.completed ? `Edit task: ${todo.title}` : undefined}
      >
        <span
          className={cn(
            'text-sm leading-relaxed font-medium wrap-break-word transition-all duration-300',
            todo.completed
              ? 'text-muted-foreground/50 decoration-muted-foreground/30 line-through'
              : 'text-foreground'
          )}
        >
          {todo.title}
        </span>

        {!todo.completed && (due || todo.tags.length > 0) && (
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {todo.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-foreground/8 text-foreground/80 dark:bg-foreground/10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: `oklch(0.65 0.18 ${tagHue(tag.name)})` }}
                  aria-hidden="true"
                />
                {tag.name}
              </span>
            ))}

            {due && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  due.isOverdue
                    ? 'bg-red-500/15 text-red-600 dark:bg-red-400/20 dark:text-red-400'
                    : due.isSoon
                      ? 'bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400'
                      : 'bg-glass-bg text-muted-foreground'
                )}
              >
                <CalendarIcon className="size-2.5" aria-hidden="true" />
                {due.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-0.5">
        {!todo.completed && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 focus:ring-primary/40 flex size-6 cursor-pointer items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:outline-none"
            aria-label={`Edit task: ${todo.title}`}
          >
            <Pencil className="size-3" aria-hidden="true" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus:ring-destructive/40 flex size-6 cursor-pointer items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:outline-none"
          aria-label={`Delete task: ${todo.title}`}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
