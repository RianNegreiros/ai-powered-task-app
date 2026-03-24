import { useState, useRef } from 'react'
import { GripVertical, CheckCircle2, Inbox, Flag, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRIORITY_CONFIG } from '@/config/priority'
import { GlassPanel } from './glass-panel'
import { TodoItem } from './todo-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { KANBAN_COLUMNS } from '@/config/kanban'
import type { Task, Priority } from '@/types/task'
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
  bgColor: string
  borderColor: string
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
  bgColor,
  borderColor,
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
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        isDragOver && 'ring-2 ring-inset',
        isDragOver && borderColor.replace('border-', 'ring-')
      )}
      onDragOver={(e) => onDragOver(e, columnId)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, columnId)}
    >
      {/* Group header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors duration-150',
          bgColor,
          isDragOver && 'opacity-90'
        )}
      >
        <span className={color}>{icon}</span>
        <h3 className={cn('text-sm font-semibold', color)}>{label}</h3>
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded-full text-xs font-medium',
            bgColor,
            color
          )}
        >
          {tasks.length}
        </span>
        <span className={cn('ml-auto', color)}>
          {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </span>
      </button>

      {/* Tasks */}
      {!collapsed && (
        <div className="mt-1.5 flex flex-col gap-1.5 px-0.5 pb-1">
          {tasks.length === 0 ? (
            <div
              className={cn(
                'flex items-center justify-center rounded-lg border-2 border-dashed py-6 opacity-40',
                borderColor,
                isDragOver && 'opacity-70'
              )}
            >
              <p className="text-muted-foreground/70 text-xs font-medium">
                {isDragOver ? 'Drop to move here' : 'No tasks'}
              </p>
            </div>
          ) : (
            tasks.map((task, i) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => onDragStart(e, task.id)}
                onDragEnd={onDragEnd}
                className="group/row flex items-stretch gap-2"
              >
                {/* Drag handle */}
                <div className="flex cursor-grab items-center px-1 opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 active:cursor-grabbing">
                  <GripVertical className="text-muted-foreground/40 size-4" />
                </div>

                <GlassPanel
                  className={cn(
                    'min-w-0 flex-1 rounded-xl border-l-[3px] p-0 transition-all duration-150',
                    isDoneGroup
                      ? 'border-l-emerald-500/50 dark:border-l-emerald-400/40'
                      : borderColor
                  )}
                >
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
    </div>
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
    // Small timeout so the ghost image renders before the dragged element styling changes
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

  const getGroupTasks = (columnId: string) => {
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

  const columnHandlerProps = {
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-3 pr-2 pb-6">
        {KANBAN_COLUMNS.map((column) => {
          const tasks = getGroupTasks(column.id)
          return (
            <ListGroup
              key={column.id}
              columnId={column.id}
              label={column.label}
              color={column.color}
              bgColor={column.bgColor}
              borderColor={column.borderColor}
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
