import type { Priority } from './todo-item'

export const priorityOptions: { value: Priority; label: string; color: string; dot: string }[] = [
  {
    value: 'none',
    label: 'None',
    color: 'text-muted-foreground/50',
    dot: 'bg-muted-foreground/30',
  },
  {
    value: 'low',
    label: 'Low',
    color: 'text-sky-500 dark:text-sky-400',
    dot: 'bg-sky-500 dark:bg-sky-400',
  },
  {
    value: 'medium',
    label: 'Medium',
    color: 'text-amber-500 dark:text-amber-400',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  {
    value: 'high',
    label: 'High',
    color: 'text-red-500 dark:text-red-400',
    dot: 'bg-red-500 dark:bg-red-400',
  },
  {
    value: 'critical',
    label: 'Critical',
    color: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-600 dark:bg-rose-400',
  },
]
