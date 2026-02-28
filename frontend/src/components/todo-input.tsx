import { useState, useRef, useEffect } from 'react'
import { Plus, Flag, Calendar, ChevronDown, SlidersHorizontal, Tag, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Priority, Tag as TagType } from './todo-item'

const priorityOptions: { value: Priority; label: string; color: string; dot: string }[] = [
  {
    value: 'none',
    label: 'None',
    color: 'text-muted-foreground/50',
    dot: 'bg-muted-foreground/30',
  },
  { value: 'low', label: 'Low', color: 'text-sky-500', dot: 'bg-sky-500' },
  { value: 'medium', label: 'Medium', color: 'text-amber-500', dot: 'bg-amber-500' },
  { value: 'high', label: 'High', color: 'text-red-500', dot: 'bg-red-500' },
  { value: 'critical', label: 'Critical', color: 'text-rose-600', dot: 'bg-rose-600' },
]

interface TodoInputProps {
  onAdd: (text: string, priority: Priority, dueDate: Date | null, tag: TagType) => void
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('none')
  const [dueDate, setDueDate] = useState<string>('')
  const [tag, setTag] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [showPriorityMenu, setShowPriorityMenu] = useState(false)
  const priorityRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  const currentPriority = priorityOptions.find((p) => p.value === priority)!

  const hasOptions = priority !== 'none' || dueDate || tag.trim() !== ''

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setShowPriorityMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd(
        text.trim(),
        priority,
        dueDate ? new Date(dueDate) : null,
        tag.trim() || null
      )
      setText('')
      setPriority('none')
      setDueDate('')
      setTag('')
      setShowOptions(false)
    }
  }

  const clearOptions = () => {
    setPriority('none')
    setDueDate('')
    setTag('')
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3">
      {/* Main input row */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!text.trim()}
          className={cn(
            'ursor-pointer flex size-[22px] shrink-0 items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
            text.trim()
              ? 'bg-primary text-primary-foreground'
              : 'border-primary/40 text-primary/40 border-[1.5px]'
          )}
          aria-label="Add todo"
        >
          <Plus className="size-3.5" strokeWidth={2.5} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task..."
          className="text-foreground placeholder:text-muted-foreground/50 flex-1 cursor-text bg-transparent text-[15px] outline-none"
        />

        {/* Toggle options button */}
        {text.trim() && (
          <button
            type="button"
            onClick={() => setShowOptions((v) => !v)}
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200',
              showOptions || hasOptions
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-glass-bg/60'
            )}
            aria-label="Toggle options"
          >
            <SlidersHorizontal className="size-3.5" />
          </button>
        )}
      </div>

      {/* Options row - toggle via button */}
      <div
        className={cn(
          'ml-[34px] flex flex-wrap items-center gap-2 overflow-hidden transition-all duration-300 ease-out',
          showOptions && text.trim() ? 'mt-2.5 max-h-20 opacity-100' : 'mt-0 max-h-0 opacity-0'
        )}
      >
        {/* Tag input */}
        <div className="bg-glass-bg/60 border-glass-border relative flex items-center gap-1.5 rounded-full border px-2.5 py-1 backdrop-blur-xl">
          <Tag
            className={cn(
              'size-3 shrink-0',
              tag.trim() ? 'text-foreground/60' : 'text-muted-foreground/40'
            )}
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag"
            className="text-foreground placeholder:text-muted-foreground/40 w-16 bg-transparent text-[11px] font-medium outline-none"
          />
        </div>

        {/* Priority picker */}
        <div ref={priorityRef} className="relative">
          <button
            type="button"
            onClick={() => setShowPriorityMenu((v) => !v)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200',
              'bg-glass-bg/60 border-glass-border hover:bg-glass-bg border backdrop-blur-xl',
              currentPriority.color
            )}
          >
            <Flag className="size-3" />
            {currentPriority.label}
            <ChevronDown
              className={cn(
                'size-2.5 transition-transform duration-200',
                showPriorityMenu && 'rotate-180'
              )}
            />
          </button>

          {showPriorityMenu && (
            <div className="bg-glass-bg/80 border-glass-border shadow-glass-shadow animate-slide-up absolute top-full left-0 z-20 mt-1.5 w-32 overflow-hidden rounded-xl border shadow-lg backdrop-blur-2xl">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setPriority(opt.value)
                    setShowPriorityMenu(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors duration-150',
                    'hover:bg-glass-highlight/30',
                    priority === opt.value ? opt.color : 'text-foreground/70'
                  )}
                >
                  <span className={cn('size-2 shrink-0 rounded-full', opt.dot)} />
                  {opt.label}
                  {priority === opt.value && (
                    <svg className="text-primary ml-auto size-3" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8.5L7 11.5L12 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Due date picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => dateRef.current?.showPicker()}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200',
              'bg-glass-bg/60 border-glass-border hover:bg-glass-bg border backdrop-blur-xl',
              dueDate ? 'text-accent' : 'text-muted-foreground/50'
            )}
          >
            <Calendar className="size-3" />
            {dueDate
              ? new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Due date'}
          </button>
          <input
            ref={dateRef}
            type="date"
            value={dueDate}
            min={todayStr}
            onChange={(e) => setDueDate(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            tabIndex={-1}
          />
        </div>

        {/* Clear all options */}
        {hasOptions && (
          <button
            type="button"
            onClick={clearOptions}
            className="text-muted-foreground/40 hover:text-muted-foreground ml-auto flex items-center gap-1 text-[11px] transition-colors duration-150"
          >
            <X className="size-3" />
            Clear
          </button>
        )}
      </div>

      {/* Active options summary (shown when options panel is collapsed but options are set) */}
      {!showOptions && hasOptions && text.trim() && (
        <div className="mt-1.5 ml-[34px] flex flex-wrap items-center gap-1.5">
          {tag.trim() && (
            <span className="bg-foreground/5 text-foreground/60 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
              <Tag className="size-2" />
              {tag.trim()}
            </span>
          )}
          {priority !== 'none' && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                priority === 'low'
                  ? 'bg-sky-500/10'
                  : priority === 'medium'
                    ? 'bg-amber-500/10'
                    : priority === 'high'
                      ? 'bg-red-500/10'
                      : 'bg-rose-500/10',
                currentPriority.color
              )}
            >
              <Flag className="size-2" />
              {currentPriority.label}
            </span>
          )}
          {dueDate && (
            <span className="bg-accent/10 text-accent inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
              <Calendar className="size-2" />
              {new Date(dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      )}
    </form>
  )
}
