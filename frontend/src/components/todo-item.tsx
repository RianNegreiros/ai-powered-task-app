'use client'

import { useState } from 'react'
import { X, Calendar, Flag, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Priority = 'low' | 'medium' | 'high' | 'critical' | 'none'

/** A tag is a free-form string used as a category label. */
export type Tag = string | null

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  priority: Priority
  dueDate: Date | null
  tag: Tag
}

const priorityConfig: Record<
  Priority,
  { color: string; ringColor: string; bgColor: string; label: string }
> = {
  critical: {
    color: 'text-rose-600',
    ringColor: 'border-rose-500/70',
    bgColor: 'bg-rose-500/10',
    label: 'Critical',
  },
  high: {
    color: 'text-red-500',
    ringColor: 'border-red-400/60',
    bgColor: 'bg-red-500/10',
    label: 'High',
  },
  medium: {
    color: 'text-amber-500',
    ringColor: 'border-amber-400/60',
    bgColor: 'bg-amber-500/10',
    label: 'Medium',
  },
  low: {
    color: 'text-sky-500',
    ringColor: 'border-sky-400/60',
    bgColor: 'bg-sky-500/10',
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
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  index: number
}

export function TodoItem({ todo, onToggle, onDelete, index }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const pCfg = priorityConfig[todo.priority]
  const due = todo.dueDate ? formatDueDate(todo.dueDate) : null

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(todo.id), 280)
  }

  return (
    <div
      className={cn(
        'group animate-slide-up flex items-start gap-3 px-4 py-3',
        'transition-all duration-300 ease-out',
        'border-glass-border/50 border-b last:border-b-0',
        isDeleting && '-translate-x-2 scale-95 opacity-0'
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          'relative mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-full transition-all duration-300',
          todo.completed
            ? 'bg-primary'
            : cn('hover:border-primary/50 border-[1.5px]', pCfg.ringColor)
        )}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg
            className="text-primary-foreground animate-check-pop size-3"
            viewBox="0 0 16 16"
            fill="none"
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
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            'text-[15px] leading-relaxed transition-all duration-300',
            todo.completed
              ? 'text-muted-foreground/60 decoration-muted-foreground/30 line-through'
              : 'text-foreground'
          )}
        >
          {todo.text}
        </span>

        {/* Meta row: tag + priority badge + due date */}
        {!todo.completed && (todo.priority !== 'none' || due || todo.tag) && (
          <div className="flex flex-wrap items-center gap-2">
            {todo.tag && (
              <span className="bg-foreground/5 text-foreground/60 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium">
                <Tag className="size-2.5" />
                {todo.tag}
              </span>
            )}
            {todo.priority !== 'none' && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                  pCfg.bgColor,
                  pCfg.color
                )}
              >
                <Flag className="size-2.5" />
                {pCfg.label}
              </span>
            )}
            {due && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                  due.isOverdue
                    ? 'bg-red-500/10 text-red-500'
                    : due.isSoon
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-glass-bg text-muted-foreground/70'
                )}
              >
                <Calendar className="size-2.5" />
                {due.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-all duration-200',
          'opacity-0 group-hover:opacity-100',
          'text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10'
        )}
        aria-label="Delete todo"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}
