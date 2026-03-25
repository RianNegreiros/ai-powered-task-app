import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KANBAN_COLUMNS } from '@/config/kanban'

interface KanbanTabStripProps {
  activeColIndex: number
  onChange: (index: number) => void
  taskCounts: Record<string, number>
}

export function KanbanTabStrip({ activeColIndex, onChange, taskCounts }: KanbanTabStripProps) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      <button
        onClick={() => onChange(Math.max(0, activeColIndex - 1))}
        disabled={activeColIndex === 0}
        className="text-muted-foreground/50 flex size-7 shrink-0 items-center justify-center rounded-lg transition-opacity disabled:opacity-20"
        aria-label="Previous column"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {KANBAN_COLUMNS.map((col, i) => {
          const count = taskCounts[col.id] ?? 0
          const isActive = i === activeColIndex
          return (
            <button
              key={col.id}
              onClick={() => onChange(i)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200',
                isActive
                  ? cn(
                      col.bgColor,
                      col.color,
                      'ring-1',
                      col.borderColor.replace('border-', 'ring-')
                    )
                  : 'text-muted-foreground/60 hover:text-muted-foreground bg-foreground/4'
              )}
            >
              <span className={isActive ? col.color : 'opacity-60'}>{col.icon}</span>
              {col.label}
              {count > 0 && (
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded-full text-[10px] font-bold',
                    isActive
                      ? cn(col.bgColor, col.color)
                      : 'bg-foreground/8 text-muted-foreground/60'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onChange(Math.min(KANBAN_COLUMNS.length - 1, activeColIndex + 1))}
        disabled={activeColIndex === KANBAN_COLUMNS.length - 1}
        className="text-muted-foreground/50 flex size-7 shrink-0 items-center justify-center rounded-lg transition-opacity disabled:opacity-20"
        aria-label="Next column"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
