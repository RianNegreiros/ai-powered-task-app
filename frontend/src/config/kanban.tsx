import { Flag, CheckCircle2, Inbox } from 'lucide-react'
import type { Priority } from '@/types/task'
import { PRIORITY_CONFIG } from './priority'

export interface KanbanColumn {
  id: Priority | 'done'
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ReactNode
  emptyIcon: React.ReactNode
  emptyText: string
}

const EmptyCritical = () => (
  <svg viewBox="0 0 32 32" className="size-7 opacity-60" fill="none">
    <circle
      cx="16"
      cy="16"
      r="12"
      className="stroke-rose-500/50 dark:stroke-rose-400/50"
      strokeWidth="1.5"
    />
    <path
      d="M16 9v8"
      className="stroke-rose-500/60 dark:stroke-rose-400/60"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="16" cy="21" r="1.2" className="fill-rose-500/60 dark:fill-rose-400/60" />
  </svg>
)

const EmptyHigh = () => (
  <svg viewBox="0 0 32 32" className="size-7 opacity-60" fill="none">
    <path
      d="M16 5L28 26H4L16 5Z"
      className="stroke-red-500/50 dark:stroke-red-400/50"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M16 13v6"
      className="stroke-red-500/60 dark:stroke-red-400/60"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="16" cy="22" r="1.2" className="fill-red-500/60 dark:fill-red-400/60" />
  </svg>
)

const EmptyMedium = () => (
  <svg viewBox="0 0 32 32" className="size-7 opacity-60" fill="none">
    <rect
      x="5"
      y="5"
      width="22"
      height="22"
      rx="4"
      className="stroke-amber-500/50 dark:stroke-amber-400/50"
      strokeWidth="1.5"
    />
    <path
      d="M10 16h12"
      className="stroke-amber-500/60 dark:stroke-amber-400/60"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 11h12M10 21h8"
      className="stroke-amber-500/40 dark:stroke-amber-400/40"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const EmptyLow = () => (
  <svg viewBox="0 0 32 32" className="size-7 opacity-60" fill="none">
    <path
      d="M16 5v22M16 27l-6-6M16 27l6-6"
      className="stroke-sky-500/60 dark:stroke-sky-400/60"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="16"
      cy="9"
      r="3"
      className="stroke-sky-500/40 dark:stroke-sky-400/40"
      strokeWidth="1.5"
    />
  </svg>
)

const EmptyInbox = () => (
  <svg viewBox="0 0 32 32" className="size-7 opacity-50" fill="none">
    <rect
      x="4"
      y="8"
      width="24"
      height="18"
      rx="3"
      className="stroke-foreground/30"
      strokeWidth="1.5"
    />
    <path
      d="M4 18h6l3 4h6l3-4h6"
      className="stroke-foreground/30"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 12h8M12 15h5"
      className="stroke-foreground/25"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const EmptyDone = () => (
  <svg viewBox="0 0 32 32" className="size-7 opacity-60" fill="none">
    <circle
      cx="16"
      cy="16"
      r="12"
      className="stroke-emerald-500/40 dark:stroke-emerald-400/40"
      strokeWidth="1.5"
    />
    <path
      d="M10 16l4 4 8-8"
      className="stroke-emerald-500/60 dark:stroke-emerald-400/60"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'critical',
    label: 'Critical',
    ...PRIORITY_CONFIG.critical,
    icon: <Flag className="size-3.5" />,
    emptyIcon: <EmptyCritical />,
    emptyText: 'No critical tasks',
  },
  {
    id: 'high',
    label: 'High',
    ...PRIORITY_CONFIG.high,
    icon: <Flag className="size-3.5" />,
    emptyIcon: <EmptyHigh />,
    emptyText: 'No high-priority tasks',
  },
  {
    id: 'medium',
    label: 'Medium',
    ...PRIORITY_CONFIG.medium,
    icon: <Flag className="size-3.5" />,
    emptyIcon: <EmptyMedium />,
    emptyText: 'No medium tasks',
  },
  {
    id: 'low',
    label: 'Low',
    ...PRIORITY_CONFIG.low,
    icon: <Flag className="size-3.5" />,
    emptyIcon: <EmptyLow />,
    emptyText: 'No low-priority tasks',
  },
  {
    id: 'none',
    label: 'Inbox',
    ...PRIORITY_CONFIG.none,
    icon: <Inbox className="size-3.5" />,
    emptyIcon: <EmptyInbox />,
    emptyText: 'Inbox is clear',
  },
  {
    id: 'done',
    label: 'Done',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-400/15',
    borderColor: 'border-emerald-500/30 dark:border-emerald-400/30',
    icon: <CheckCircle2 className="size-3.5" />,
    emptyIcon: <EmptyDone />,
    emptyText: 'Nothing completed yet',
  },
]
