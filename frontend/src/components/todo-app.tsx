'use client'

import { useState, useCallback } from 'react'
import { LogOut } from 'lucide-react'
import { GlassPanel } from './glass-panel'
import { TodoInput } from './todo-input'
import { TodoItem, type Todo, type Priority, type Tag } from './todo-item'
import { useAuth } from './auth-context'

const priorityWeight: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  none: 4,
}

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 5)
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)

const initialTodos: Todo[] = [
  {
    id: '1',
    text: 'Review quarterly design updates',
    completed: false,
    createdAt: new Date(Date.now() - 3600000),
    priority: 'critical',
    dueDate: new Date(),
    tag: 'Work',
  },
  {
    id: '2',
    text: 'Pick up groceries',
    completed: true,
    createdAt: new Date(Date.now() - 7200000),
    priority: 'none',
    dueDate: null,
    tag: 'Errands',
  },
  {
    id: '3',
    text: 'Morning meditation',
    completed: false,
    createdAt: new Date(Date.now() - 10800000),
    priority: 'low',
    dueDate: tomorrow,
    tag: 'Health',
  },
  {
    id: '4',
    text: 'Call mom about weekend plans',
    completed: false,
    createdAt: new Date(Date.now() - 14400000),
    priority: 'none',
    dueDate: null,
    tag: null,
  },
  {
    id: '5',
    text: 'Ship feature PR',
    completed: false,
    createdAt: new Date(Date.now() - 1800000),
    priority: 'high',
    dueDate: tomorrow,
    tag: 'Work',
  },
]

export function TodoApp() {
  const { user, logout } = useAuth()
  const [todos, setTodos] = useState<Todo[]>(initialTodos)

  const addTodo = useCallback(
    (text: string, priority: Priority, dueDate: Date | null, tag: Tag) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date(),
        priority,
        dueDate,
        tag,
      }
      setTodos((prev) => [newTodo, ...prev])
    },
    []
  )

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const incomplete = todos
    .filter((t) => !t.completed)
    .sort((a, b) => {
      const pw = priorityWeight[a.priority] - priorityWeight[b.priority]
      if (pw !== 0) return pw
      // within same priority, due sooner first
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

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12 md:py-20">
      {/* Header */}
      <header className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight">Today</h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground text-sm">{dateStr}</p>
            {user && (
              <button
                onClick={logout}
                className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg flex size-8 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="size-3.5" />
              </button>
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

      {/* Todo list card */}
      <GlassPanel>
        {/* Input */}
        <TodoInput onAdd={addTodo} />

        {/* Divider */}
        {todos.length > 0 && <div className="bg-glass-border/60 mx-4 h-px" />}

        {/* Incomplete items */}
        {incomplete.map((todo, i) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            index={i}
          />
        ))}

        {/* Completed section */}
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
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            index={i + incomplete.length}
          />
        ))}

        {/* Empty state */}
        {todos.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <p className="text-muted-foreground/60 text-sm">No tasks yet</p>
          </div>
        )}
      </GlassPanel>

      {/* Subtle task count */}
      {todos.length > 0 && (
        <p className="text-muted-foreground/40 text-center text-xs">
          {incomplete.length} remaining
        </p>
      )}
    </div>
  )
}
