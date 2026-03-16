import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { GlassPanel } from './glass-panel'
import { TodoInput } from './todo-input'
import { TodoAppHeader } from './todo-app-header'
import { KanbanColumnView, DONE_PAGE_SIZE } from './kanban-column-view'
import { useAuth } from './auth-context'
import { createTask, deleteTask, getTasks, setTaskCompleted, updateTask } from '@/lib/api-tasks'
import { getTags, type Tag as TagEntity } from '@/lib/api-tags'
import { KANBAN_COLUMNS } from '@/config/kanban'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Task, Priority, TaskTag } from '@/types/task'

function mapApiTask(t: Task): Task {
  return {
    ...t,
    description: t.description ?? null,
    createdAt: new Date(t.createdAt),
    priority: (t.priority?.toLowerCase() || 'none') as Priority,
    dueDate: t.dueDate ? new Date(t.dueDate) : null,
    tags: t.tags || [],
  }
}

function KanbanSkeleton({ isMobile }: { isMobile: boolean }) {
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

export function TodoApp() {
  const { user, logout } = useAuth()
  const [todos, setTodos] = useState<Task[]>([])
  const [tags, setTags] = useState<TagEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [doneVisible, setDoneVisible] = useState(DONE_PAGE_SIZE)
  const [activeColIndex, setActiveColIndex] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    Promise.all([getTasks(), getTags()])
      .then(([tasksData, tagsData]) => {
        setTodos(tasksData.map(mapApiTask))
        setTags(tagsData)
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleCreateTask = async (
    title: string,
    priority: Priority,
    dueDate: Date | null,
    taskTags: TaskTag[],
    description: string | null
  ) => {
    try {
      const data = await createTask({
        title,
        priority: priority !== 'none' ? priority.toUpperCase() : undefined,
        dueDate: dueDate?.toISOString(),
        tagIds: taskTags.map((t) => t.id.toString()),
        description: description || undefined,
      })
      setTodos((prev) => [mapApiTask(data), ...prev])
      toast.success('Task created')
    } catch {
      toast.error('Failed to create task')
    }
  }

  const handleToggleTask = async (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    try {
      await setTaskCompleted(id)
    } catch {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTask(id)
      toast.success('Task deleted')
    } catch {
      const data = await getTasks().catch(() => [])
      setTodos(data.map(mapApiTask))
      toast.error('Failed to delete task')
    }
  }

  const handleUpdateTask = async (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'tags'>>
  ) => {
    const prev = todos.find((t) => t.id === id)
    if (!prev) return
    setTodos((cur) => cur.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    try {
      await updateTask(id, {
        title: updates.title,
        description: updates.description,
        priority: updates.priority !== 'none' ? updates.priority?.toUpperCase() : 'NONE',
        dueDate: updates.dueDate?.toISOString() ?? null,
        tagIds: updates.tags?.map((t) => t.id.toString()) ?? [],
      } as Parameters<typeof updateTask>[1])
      toast.success('Task updated')
    } catch {
      setTodos((cur) => cur.map((t) => (t.id === id ? prev : t)))
      toast.error('Failed to update task')
    }
  }

  const columnProps = {
    todos,
    tags,
    doneVisible,
    onDoneMore: () => setDoneVisible((n) => n + DONE_PAGE_SIZE),
    onToggle: handleToggleTask,
    onDelete: handleDeleteTask,
    onUpdate: handleUpdateTask,
  }

  const colTaskCount = (id: string) =>
    id === 'done'
      ? todos.filter((t) => t.completed).length
      : todos.filter((t) => !t.completed && t.priority === id).length

  const activeColumn = KANBAN_COLUMNS[activeColIndex]

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden px-4 py-5 md:px-6 md:py-8">
      <TodoAppHeader user={user} onLogout={logout} />

      <div className="mb-4 md:mb-6">
        <GlassPanel className="p-0">
          <TodoInput
            onAdd={handleCreateTask}
            tags={tags}
            onTagCreated={(tag) => setTags((prev) => [...prev, tag])}
          />
        </GlassPanel>
      </div>

      {/* Mobile: tab strip + single column */}
      {isMobile && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-3 flex items-center gap-1.5">
            <button
              onClick={() => setActiveColIndex((i) => Math.max(0, i - 1))}
              disabled={activeColIndex === 0}
              className="text-muted-foreground/50 flex size-7 shrink-0 items-center justify-center rounded-lg transition-opacity disabled:opacity-20"
              aria-label="Previous column"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {KANBAN_COLUMNS.map((col, i) => {
                const count = colTaskCount(col.id)
                const isActive = i === activeColIndex
                return (
                  <button
                    key={col.id}
                    onClick={() => setActiveColIndex(i)}
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
              onClick={() => setActiveColIndex((i) => Math.min(KANBAN_COLUMNS.length - 1, i + 1))}
              disabled={activeColIndex === KANBAN_COLUMNS.length - 1}
              className="text-muted-foreground/50 flex size-7 shrink-0 items-center justify-center rounded-lg transition-opacity disabled:opacity-20"
              aria-label="Next column"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-2">
            {isLoading ? (
              <KanbanSkeleton isMobile />
            ) : (
              <KanbanColumnView
                key={activeColumn.id}
                column={activeColumn}
                colIndex={0}
                scrollable={false}
                {...columnProps}
              />
            )}
          </div>
        </div>
      )}

      {/* Desktop: horizontal Kanban */}
      {!isMobile && (
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div
              className="flex h-full w-full gap-3 pb-4"
              style={{ minWidth: `${KANBAN_COLUMNS.length * 200}px` }}
            >
              {isLoading ? (
                <KanbanSkeleton isMobile={false} />
              ) : (
                KANBAN_COLUMNS.map((column, colIndex) => (
                  <KanbanColumnView
                    key={column.id}
                    column={column}
                    colIndex={colIndex}
                    scrollable
                    {...columnProps}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {todos.length > 0 && (
        <div className="mt-3 flex items-center justify-center gap-4 md:mt-4">
          <p className="text-muted-foreground/70 text-xs">
            {todos.filter((t) => !t.completed).length} remaining
          </p>
          <span className="text-muted-foreground/40">|</span>
          <p className="text-muted-foreground/70 text-xs">
            {todos.filter((t) => t.completed).length} completed
          </p>
        </div>
      )}
    </div>
  )
}
