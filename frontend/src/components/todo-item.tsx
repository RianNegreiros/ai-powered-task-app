import { useState } from 'react'
import { X, Calendar as CalendarIcon, Flag, Pencil, FileText } from 'lucide-react'
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
  compact?: boolean
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  index,
  tags,
  compact = false,
}: TodoItemProps) {
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
        'group animate-slide-up relative flex items-start gap-3 transition-all duration-300 ease-out',
        compact ? 'px-3 py-3' : 'px-5 py-4',
        !compact && 'border-glass-border/50 border-b last:border-b-0',
        due?.isOverdue
          ? 'hover:bg-red-500/5 dark:hover:bg-red-400/5'
          : 'hover:bg-foreground/2 dark:hover:bg-foreground/3',
        completionFlash && 'animate-completion-flash',
        isDeleting && '-translate-x-2 scale-95 opacity-0'
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Priority strip (list mode only) */}
      {!compact && todo.priority !== 'none' && !todo.completed && (
        <div
          className={cn('absolute top-3 bottom-3 left-0 w-0.75 rounded-full', pCfg.stripColor)}
        />
      )}

      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={cn(
          'relative mt-0.5 flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-300',
          compact ? 'size-5' : 'size-6',
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
            'leading-relaxed font-medium wrap-break-word transition-all duration-300',
            compact ? 'text-sm' : 'text-base',
            todo.completed
              ? 'text-muted-foreground/50 decoration-muted-foreground/30 line-through'
              : 'text-foreground'
          )}
        >
          {todo.title}
        </span>

        {todo.description && !todo.completed && !compact && (
          <span className="text-muted-foreground flex items-start gap-1.5 text-[13px] leading-relaxed">
            <FileText className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span className="line-clamp-2">{todo.description}</span>
          </span>
        )}

        {!todo.completed &&
          ((!compact && todo.priority !== 'none') || due || todo.tags.length > 0) && (
            <div
              className={cn('mt-0.5 flex flex-wrap items-center', compact ? 'gap-1.5' : 'gap-2')}
            >
              {todo.tags.map((tag) => (
                <span
                  key={tag.id}
                  className={cn(
                    'bg-foreground/8 text-foreground/80 dark:bg-foreground/10 inline-flex items-center gap-1 rounded-full font-medium',
                    compact ? 'px-2 py-0.5 text-[10px]' : 'gap-1.5 px-2.5 py-1 text-xs'
                  )}
                >
                  <span
                    className={cn('shrink-0 rounded-full', compact ? 'size-1.5' : 'size-2')}
                    style={{ backgroundColor: `oklch(0.65 0.18 ${tagHue(tag.name)})` }}
                    aria-hidden="true"
                  />
                  {tag.name}
                </span>
              ))}

              {!compact && todo.priority !== 'none' && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                    pCfg.bgColor,
                    pCfg.color
                  )}
                >
                  <Flag className="size-3" aria-hidden="true" />
                  {pCfg.label}
                </span>
              )}

              {due && (
                <span
                  className={cn(
                    'inline-flex items-center rounded-full font-semibold',
                    compact ? 'gap-1 px-2 py-0.5 text-[10px]' : 'gap-1.5 px-2.5 py-1 text-xs',
                    due.isOverdue
                      ? 'bg-red-500/15 text-red-600 dark:bg-red-400/20 dark:text-red-400'
                      : due.isSoon
                        ? 'bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400'
                        : 'bg-glass-bg text-muted-foreground'
                  )}
                >
                  <CalendarIcon className={compact ? 'size-2.5' : 'size-3'} aria-hidden="true" />
                  {due.label}
                </span>
              )}
            </div>
          )}
      </div>

      {/* Actions */}
      <div className={cn('flex shrink-0 items-center gap-0.5', compact ? 'mt-0' : 'mt-1')}>
        {!todo.completed && (
          <button
            onClick={() => setIsEditing(true)}
            className={cn(
              'flex cursor-pointer items-center justify-center rounded-full transition-all duration-200',
              compact ? 'size-6' : 'size-8',
              'opacity-0 group-hover:opacity-100 focus:opacity-100',
              'text-muted-foreground hover:text-primary hover:bg-primary/10 focus:ring-primary/40 focus:ring-2 focus:outline-none'
            )}
            aria-label={`Edit task: ${todo.title}`}
          >
            <Pencil className={compact ? 'size-3' : 'size-4'} aria-hidden="true" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className={cn(
            'flex cursor-pointer items-center justify-center rounded-full transition-all duration-200',
            compact ? 'size-6' : 'size-8',
            'opacity-0 group-hover:opacity-100 focus:opacity-100',
            'text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus:ring-destructive/40 focus:ring-2 focus:outline-none'
          )}
          aria-label={`Delete task: ${todo.title}`}
        >
          <X className={compact ? 'size-3.5' : 'size-4.5'} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
