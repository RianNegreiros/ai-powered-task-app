import { useState, useRef } from 'react'
import { GripVertical, ChevronDown } from 'lucide-react'
import { cn, getColumnTasks } from '@/lib/utils'
import { GlassPanel } from './glass-panel'
import { TodoItem } from './todo-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { KANBAN_COLUMNS } from '@/config/kanban'
import type { Task } from '@/types/task'
import type { Tag as TagEntity } from '@/lib/api-tags'

interface ListViewProps {
  todos: Task[]
  tags: TagEntity[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'tags'>>
  ) => void
  onDropToColumn: (taskId: string, columnId: string) => void
}

interface ListGroupProps {
  columnId: string
  label: string
  color: string
  ringColor: string
  icon: React.ReactNode
  tasks: Task[]
  tags: TagEntity[]
  isDragOver: boolean
  isDoneGroup?: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (
    id: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'dueDate' | 'tags'>>
  ) => void
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, groupId: string) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, groupId: string) => void
}

function ListGroup({
  columnId,
  label,
  color,
  ringColor,
  icon,
  tasks,
  tags,
  isDragOver,
  isDoneGroup,
  onToggle,
  onDelete,
  onUpdate,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: ListGroupProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section
      className={cn(
        'rounded-2xl transition-all duration-200',
        isDragOver && 'ring-2 ring-inset',
        isDragOver && ringColor.replace('border-', 'ring-')
      )}
      onDragOver={(e) => onDragOver(e, columnId)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, columnId)}
    >
      {/* Group header — a single, calm row. Priority is signaled by the dot + label. */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hover:bg-foreground/4 flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-150"
        aria-expanded={!collapsed}
      >
        <span
          className={cn(
            'text-muted-foreground transition-transform duration-200',
            collapsed && '-rotate-90'
          )}
        >
          <ChevronDown className="size-4" />
        </span>
        <span className={cn('flex items-center', color)}>{icon}</span>
        <h3 className="text-foreground text-sm font-semibold">{label}</h3>
        <span className="bg-foreground/8 text-muted-foreground flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold">
          {tasks.length}
        </span>
      </button>

      {!collapsed && (
        <div className="mt-0.5 flex flex-col gap-1.5 pb-2">
          {tasks.length === 0 ? (
            <div
              className={cn(
                'text-muted-foreground flex items-center justify-center rounded-xl border border-dashed py-6 text-xs font-medium transition-all duration-200',
                isDragOver ? cn('bg-foreground/4', ringColor) : 'border-border'
              )}
            >
              {isDragOver ? 'Drop to set as ' + label.toLowerCase() : 'No tasks'}
            </div>
          ) : (
            tasks.map((task, i) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => onDragStart(e, task.id)}
                onDragEnd={onDragEnd}
                className="group/row flex items-stretch"
              >
                <div className="text-muted-foreground/50 flex cursor-grab items-center pr-1 opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 active:cursor-grabbing">
                  <GripVertical className="size-4" />
                </div>

                <GlassPanel className="min-w-0 flex-1 rounded-2xl p-0 transition-shadow duration-150 hover:shadow-[0_6px_20px_var(--glass-shadow)]">
                  <TodoItem
                    todo={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    index={i}
                    tags={tags}
                  />
                </GlassPanel>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}

export function ListView({
  todos,
  tags,
  onToggle,
  onDelete,
  onUpdate,
  onDropToColumn,
}: ListViewProps) {
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null)
  const draggedTaskId = useRef<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    draggedTaskId.current = taskId
    e.dataTransfer.effectAllowed = 'move'
    const el = e.currentTarget as HTMLElement
    setTimeout(() => el.classList.add('opacity-50'), 0)
  }

  const handleDragEnd = () => {
    draggedTaskId.current = null
    setDragOverGroup(null)
  }

  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverGroup(groupId)
  }

  const handleDragLeave = () => {
    setDragOverGroup(null)
  }

  const handleDrop = (e: React.DragEvent, groupId: string) => {
    e.preventDefault()
    const taskId = draggedTaskId.current
    if (taskId) {
      onDropToColumn(taskId, groupId)
    }
    draggedTaskId.current = null
    setDragOverGroup(null)
  }

  const columnHandlerProps = {
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="mx-auto flex max-w-3xl flex-col gap-1 pr-2 pb-4">
        {KANBAN_COLUMNS.map((column) => {
          const tasks = getColumnTasks(todos, column.id)
          return (
            <ListGroup
              key={column.id}
              columnId={column.id}
              label={column.label}
              color={column.color}
              ringColor={column.borderColor}
              icon={column.icon}
              tasks={tasks}
              tags={tags}
              isDragOver={dragOverGroup === column.id}
              isDoneGroup={column.id === 'done'}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              {...columnHandlerProps}
            />
          )
        })}
      </div>
    </ScrollArea>
  )
}
