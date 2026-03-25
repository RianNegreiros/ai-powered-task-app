import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Task } from '@/types/task'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function tagHue(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % 360
}

export function getColumnTasks(todos: Task[], columnId: string): Task[] {
  if (columnId === 'done') {
    return todos
      .filter((t) => t.completed)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
  return todos
    .filter((t) => !t.completed && t.priority === columnId)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime()
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
}
