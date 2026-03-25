import { GlassPanel } from './glass-panel'
import { TodoItem } from './todo-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, getColumnTasks } from '@/lib/utils'
import { KANBAN_COLUMNS, DONE_PAGE_SIZE, type KanbanColumn } from '@/config/kanban'
import type { Task } from '@/types/task'
import type { Tag as TagEntity } from '@/lib/api-tags'

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
  draggedTaskId?: string | null
  isDragOver?: boolean
  onDragStart?: (taskId: string) => void
  onDragEnd?: () => void
  onDragOver?: (columnId: string) => void
  onDragLeave?: () => void
  onDrop?: (columnId: string) => void
}

export function KanbanSkeleton({ isMobile }: { isMobile: boolean }) {
  const cols = isMobile ? [KANBAN_COLUMNS[0]] : KANBAN_COLUMNS
  return (
    <>
      {cols.map((col) => (
        <div
          key={col.id}
          className={cn('flex flex-col', isMobile ? 'w-full' : 'h-full w-72 shrink-0 md:w-80')}
        >
          <div className={cn('mb-3 flex items-center gap-2 rounded-xl px-3 py-2', col.bgColor)}>
            <div className="bg-foreground/10 h-3.5 w-3.5 animate-pulse rounded" />
            <div className="bg-foreground/10 h-3.5 w-16 animate-pulse rounded-full" />
            <div className="bg-foreground/10 ml-auto size-5 animate-pulse rounded-full" />
          </div>
          <div className="flex flex-col gap-2 pr-2">
            {[0, 1].map((i) => (
              <GlassPanel
                key={i}
                className={cn(
                  'rounded-xl border-l-[3px] p-0',
                  col.id !== 'done' ? col.borderColor : 'border-l-emerald-500/50'
                )}
              >
                <div className="flex flex-col gap-2 px-3 py-3">
                  <div className="bg-foreground/8 h-3.5 w-3/4 animate-pulse rounded-full" />
                  <div className="bg-foreground/6 h-3 w-1/2 animate-pulse rounded-full" />
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

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
  draggedTaskId,
  isDragOver = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: KanbanColumnViewProps) {
  const allTasks = getColumnTasks(todos, column.id)

  const visibleTasks = column.id === 'done' ? allTasks.slice(0, doneVisible) : allTasks
  const hasMore = column.id === 'done' && allTasks.length > doneVisible

  const handleDragOver = (e: React.DragEvent) => {
    if (!draggedTaskId) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    onDragOver?.(column.id)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    onDrop?.(column.id)
  }

  const header = (
    <div
      className={cn(
        'mb-3 flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200',
        column.bgColor,
        isDragOver && 'ring-2 ring-inset',
        isDragOver && column.borderColor.replace('border-', 'ring-')
      )}
    >
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
    <div className="flex flex-col gap-1.5 pr-2">
      {isDragOver && allTasks.length === 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-xl border-2 border-dashed py-10 transition-all duration-200',
            column.borderColor,
            'opacity-80'
          )}
        >
          <p className="text-muted-foreground/70 text-xs font-medium">Drop here</p>
        </div>
      )}

      {visibleTasks.length > 0 ? (
        <>
          {visibleTasks.map((todo, i) => {
            const isBeingDragged = draggedTaskId === todo.id
            return (
              <div
                key={todo.id}
                draggable={!!onDragStart}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move'
                  onDragStart?.(todo.id)
                }}
                onDragEnd={() => onDragEnd?.()}
                className={cn(
                  'transition-all duration-200',
                  isBeingDragged && 'scale-[0.98] opacity-40',
                  onDragStart && 'cursor-grab active:cursor-grabbing'
                )}
              >
                <GlassPanel
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
                  />
                </GlassPanel>
              </div>
            )
          })}
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
        !isDragOver && (
          <div
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 opacity-50',
              column.borderColor
            )}
          >
            {column.emptyIcon}
            <p className="text-muted-foreground/70 text-xs font-medium">{column.emptyText}</p>
          </div>
        )
      )}
    </div>
  )

  if (scrollable) {
    return (
      <div
        className={cn(
          'animate-slide-up flex h-full min-w-50 flex-1 flex-col rounded-xl transition-all duration-200',
          isDragOver && 'bg-foreground/2'
        )}
        style={{ animationDelay: `${colIndex * 60}ms` }}
        onDragOver={handleDragOver}
        onDragLeave={() => onDragLeave?.()}
        onDrop={handleDrop}
      >
        {header}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">{cards}</ScrollArea>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'animate-slide-up w-full rounded-xl transition-all duration-200',
        isDragOver && 'bg-foreground/2'
      )}
      style={{ animationDelay: `${colIndex * 40}ms` }}
      onDragOver={handleDragOver}
      onDragLeave={() => onDragLeave?.()}
      onDrop={handleDrop}
    >
      {header}
      {cards}
    </div>
  )
}
