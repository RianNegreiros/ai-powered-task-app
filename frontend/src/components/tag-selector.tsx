import { Check, Plus, Loader2, Tag } from 'lucide-react'
import { useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, tagHue } from '@/lib/utils'
import { createTag, type Tag as TagEntity } from '@/lib/api-tags'

interface TagSelectorProps {
  tags: TagEntity[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  onTagCreated?: (tag: TagEntity) => void
  size?: 'sm' | 'md'
}

export function TagSelector({
  tags,
  selectedIds,
  onChange,
  onTagCreated,
  size = 'md',
}: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const name = newTagName.trim()
    if (!name || isCreating) return
    setIsCreating(true)
    try {
      const tag = await createTag(name)
      onTagCreated?.(tag)
      onChange([...selectedIds, tag.id])
      setNewTagName('')
      inputRef.current?.focus()
    } finally {
      setIsCreating(false)
    }
  }

  const btnClass = cn(
    'flex items-center gap-2 rounded-full border backdrop-blur-xl font-semibold transition-all duration-200',
    'bg-glass-bg/70 border-glass-border/60 hover:border-glass-border hover:bg-glass-bg',
    size === 'sm' ? 'px-3 py-2 text-xs' : 'px-3.5 py-2 text-xs',
    selectedIds.length > 0 ? 'text-foreground/80' : 'text-muted-foreground/50'
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={btnClass}>
          <Tag className="size-3.5" />
          {selectedIds.length > 0
            ? `${selectedIds.length} tag${selectedIds.length > 1 ? 's' : ''}`
            : 'Tags'}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-2">
        <div className="max-h-60 space-y-1 overflow-y-auto">
          {tags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
            >
              <div
                className={cn(
                  'flex size-4 items-center justify-center rounded border',
                  selectedIds.includes(t.id) ? 'bg-primary border-primary' : 'border-input'
                )}
              >
                {selectedIds.includes(t.id) && <Check className="text-primary-foreground size-3" />}
              </div>
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: `oklch(0.65 0.18 ${tagHue(t.name)})` }}
              />
              <span className="flex-1 text-left">{t.name}</span>
            </button>
          ))}
          {tags.length === 0 && (
            <p className="text-muted-foreground/50 px-2 py-1 text-xs">No tags yet</p>
          )}
        </div>

        {onTagCreated && (
          <div className="border-glass-border/60 mt-2 border-t pt-2">
            <form onSubmit={handleCreate} className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag..."
                className="text-foreground placeholder:text-muted-foreground/40 min-w-0 flex-1 bg-transparent text-xs outline-none"
              />
              <button
                type="submit"
                disabled={!newTagName.trim() || isCreating}
                className="text-muted-foreground hover:text-primary flex shrink-0 items-center justify-center transition-colors disabled:opacity-30"
                aria-label="Create tag"
              >
                {isCreating ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Plus className="size-3.5" />
                )}
              </button>
            </form>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
