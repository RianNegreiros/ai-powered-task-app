import type { Priority } from '@/types/task'

export interface PriorityMeta {
  value: Priority
  label: string
  color: string
  dot: string
  ringColor: string
  bgColor: string
  borderColor: string
  stripColor: string
}

export const PRIORITY_CONFIG: Record<Priority, PriorityMeta> = {
  critical: {
    value: 'critical',
    label: 'Critical',
    color: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-600 dark:bg-rose-400',
    ringColor: 'border-rose-500/70 dark:border-rose-400/60',
    bgColor: 'bg-rose-500/10 dark:bg-rose-400/15',
    borderColor: 'border-rose-500/30 dark:border-rose-400/30',
    stripColor: 'bg-rose-500/70 dark:bg-rose-400/60',
  },
  high: {
    value: 'high',
    label: 'High',
    color: 'text-red-500 dark:text-red-400',
    dot: 'bg-red-500 dark:bg-red-400',
    ringColor: 'border-red-400/60 dark:border-red-400/50',
    bgColor: 'bg-red-500/10 dark:bg-red-400/15',
    borderColor: 'border-red-500/30 dark:border-red-400/30',
    stripColor: 'bg-red-400/60 dark:bg-red-400/50',
  },
  medium: {
    value: 'medium',
    label: 'Medium',
    color: 'text-amber-500 dark:text-amber-400',
    dot: 'bg-amber-500 dark:bg-amber-400',
    ringColor: 'border-amber-400/60 dark:border-amber-400/50',
    bgColor: 'bg-amber-500/10 dark:bg-amber-400/15',
    borderColor: 'border-amber-500/30 dark:border-amber-400/30',
    stripColor: 'bg-amber-400/60 dark:bg-amber-400/50',
  },
  low: {
    value: 'low',
    label: 'Low',
    color: 'text-sky-500 dark:text-sky-400',
    dot: 'bg-sky-500 dark:bg-sky-400',
    ringColor: 'border-sky-400/60 dark:border-sky-400/50',
    bgColor: 'bg-sky-500/10 dark:bg-sky-400/15',
    borderColor: 'border-sky-500/30 dark:border-sky-400/30',
    stripColor: 'bg-sky-400/50 dark:bg-sky-400/40',
  },
  none: {
    value: 'none',
    label: 'None',
    color: 'text-muted-foreground/40',
    dot: 'bg-muted-foreground/30',
    ringColor: 'border-foreground/20',
    bgColor: '',
    borderColor: 'border-foreground/15 dark:border-foreground/20',
    stripColor: '',
  },
}

export const PRIORITY_OPTIONS = Object.values(PRIORITY_CONFIG)
