import { useState, useEffect } from 'react'
import { LogOut, User, Tag as TagIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GlassPanel } from './glass-panel'
import { TodoInput } from './todo-input'
import { TodoItem, type Priority, type TaskTag, type Task } from './todo-item'
import { useAuth } from './auth-context'
import { createTask, deleteTask, getTasks, setTaskCompleted, updateTask } from '@/lib/api-tasks'
import { getTags, type Tag as TagEntity } from '@/lib/api-tags'

const priorityWeight: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  none: 4,
}

const mapApiTask = (t: Task): Task => ({
  ...t,
  description: t.description ?? null,
  createdAt: new Date(t.createdAt),
  priority: (t.priority?.toLowerCase() || 'none') as Priority,
  dueDate: t.dueDate ? new Date(t.dueDate) : null,
  tags: t.tags || [],
})

export function TodoApp() {
  const { user, logout } = useAuth()
  const [todos, setTodos] = useState<Task[]>([])
  const [tags, setTags] = useState<TagEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    tags: TaskTag[],
    description: string | null
  ) => {
    try {
      const data = await createTask({
        title,
        priority: priority !== 'none' ? priority.toUpperCase() : undefined,
        dueDate: dueDate?.toISOString(),
        tagIds: tags.map((t) => t.id.toString()),
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
      const apiBody = {
        title: updates.title,
        description: updates.description,
        priority: updates.priority !== 'none' ? updates.priority?.toUpperCase() : 'NONE',
        dueDate: updates.dueDate?.toISOString() ?? null,
        tagIds: updates.tags?.map((t) => t.id.toString()) ?? [],
      }

      await updateTask(id, apiBody as Parameters<typeof updateTask>[1])
      toast.success('Task updated')
    } catch {
      setTodos((cur) => cur.map((t) => (t.id === id ? prev : t)))
      toast.error('Failed to update task')
    }
  }

  const incomplete = todos
    .filter((t) => !t.completed)
    .sort((a, b) => {
      const pw = priorityWeight[a.priority] - priorityWeight[b.priority]
      if (pw !== 0) return pw
      if (a.dueDate && b.dueDate) return a.dueDate.getTime() - b.dueDate.getTime()
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
  const completed = todos.filter((t) => t.completed)

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12 md:py-20">
        <GlassPanel>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground/60 text-sm">Loading tasks...</p>
          </div>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-12 md:py-20">
      <header className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight">Today</h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground text-sm">{dateStr}</p>
            {user && (
              <>
                <Link
                  to="/tags"
                  className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg flex size-8 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200"
                  aria-label="Manage tags"
                  title="Manage tags"
                >
                  <TagIcon className="size-3.5" />
                </Link>
                <Link
                  to="/profile"
                  className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg flex size-8 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200"
                  aria-label="Profile"
                  title="Profile"
                >
                  <User className="size-3.5" />
                </Link>
                <button
                  onClick={logout}
                  className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg flex size-8 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="size-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
        {user && (
          <p className="text-muted-foreground/60 text-sm">
            {'Hello, '}
            <span className="text-foreground/70 font-medium">{user.name.split(' ')[0]}</span>
          </p>
        )}
      </header>

      <GlassPanel>
        <TodoInput onAdd={handleCreateTask} tags={tags} />

        {todos.length > 0 && <div className="bg-glass-border/60 mx-4 h-px" />}

        {incomplete.map((todo, i) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            index={i}
            tags={tags}
          />
        ))}

        {completed.length > 0 && incomplete.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="bg-glass-border/40 h-px flex-1" />
            <span className="text-muted-foreground/50 text-[11px] font-medium tracking-wide uppercase">
              Done
            </span>
            <div className="bg-glass-border/40 h-px flex-1" />
          </div>
        )}

        {completed.map((todo, i) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            index={i + incomplete.length}
            tags={tags}
          />
        ))}

        {todos.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <p className="text-muted-foreground/60 text-sm">No tasks yet</p>
          </div>
        )}
      </GlassPanel>

      {todos.length > 0 && (
        <p className="text-muted-foreground/40 text-center text-xs">
          {incomplete.length} remaining
        </p>
      )}
    </div>
  )
}
