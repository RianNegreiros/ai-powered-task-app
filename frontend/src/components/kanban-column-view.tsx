import { GlassPanel } from './glass-panel'
import { TodoItem } from './todo-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { KanbanColumn } from '@/config/kanban'
import type { Task } from '@/types/task'
import type { Tag as TagEntity } from '@/lib/api-tags'

const DONE_PAGE_SIZE = 10

interface KanbanColumnViewProps {
  column: KanbanColumn
  colIndex: number
  todos: Task[]
  tags: TagEntity[]
  doneVisible: number
  onDoneMore: () => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'tags'>>
  ) => void
  scrollable?: boolean
}

export { DONE_PAGE_SIZE }

export function KanbanColumnView({
  column,
  colIndex,
  todos,
  tags,
  doneVisible,
  onDoneMore,
  onToggle,
  onDelete,
  onUpdate,
  scrollable = false,
}: KanbanColumnViewProps) {
  const allTasks =
    column.id === 'done'
      ? todos
          .filter((t) => t.completed)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      : todos
          .filter((t) => !t.completed && t.priority === column.id)
          .sort((a, b) => {
            if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime()
            if (a.dueDate) return -1
            if (b.dueDate) return 1
            return b.createdAt.getTime() - a.createdAt.getTime()
          })

  const visibleTasks = column.id === 'done' ? allTasks.slice(0, doneVisible) : allTasks
  const hasMore = column.id === 'done' && allTasks.length > doneVisible

  const header = (
    <div className={cn('mb-3 flex items-center gap-2 rounded-xl px-3 py-2', column.bgColor)}>
      <span className={column.color}>{column.icon}</span>
      <h2 className={cn('text-sm font-semibold', column.color)}>{column.label}</h2>
      <span
        className={cn(
          'ml-auto flex size-5 items-center justify-center rounded-full text-xs font-medium',
          column.bgColor,
          column.color
        )}
      >
        {allTasks.length}
      </span>
    </div>
  )

  const cards = (
    <div className="flex flex-col gap-2 pr-2">
      {visibleTasks.length > 0 ? (
        <>
          {visibleTasks.map((todo, i) => (
            <GlassPanel
              key={todo.id}
              className={cn(
                'rounded-xl border-l-[3px] p-0',
                column.id !== 'done'
                  ? column.borderColor
                  : 'border-l-emerald-500/50 dark:border-l-emerald-400/40'
              )}
            >
              <TodoItem
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
                index={i}
                tags={tags}
                compact
              />
            </GlassPanel>
          ))}
          {hasMore && (
            <button
              onClick={onDoneMore}
              className={cn(
                'text-muted-foreground/60 hover:text-muted-foreground rounded-xl border-2 border-dashed py-2 text-xs font-medium opacity-60 transition-all duration-200 hover:opacity-100',
                column.borderColor
              )}
            >
              Show {Math.min(DONE_PAGE_SIZE, allTasks.length - doneVisible)} more
            </button>
          )}
        </>
      ) : (
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 opacity-50',
            column.borderColor
          )}
        >
          {column.emptyIcon}
          <p className="text-muted-foreground/70 text-xs font-medium">{column.emptyText}</p>
        </div>
      )}
    </div>
  )

  if (scrollable) {
    return (
      <div
        className="animate-slide-up flex h-full min-w-50 flex-1 flex-col"
        style={{ animationDelay: `${colIndex * 60}ms` }}
      >
        {header}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">{cards}</ScrollArea>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-slide-up w-full" style={{ animationDelay: `${colIndex * 40}ms` }}>
      {header}
      {cards}
    </div>
  )
}
