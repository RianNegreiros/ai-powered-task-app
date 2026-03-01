import { useState, useEffect } from 'react'
import { Plus, X, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GlassPanel } from './glass-panel'
import { getTags, createTag, deleteTag, type Tag } from '@/lib/api-tags'

function tagHue(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % 360
}

export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getTags()
      .then(setTags)
      .catch(() => toast.error('Failed to load tags'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newTag.trim()
    if (!trimmed) return

    try {
      const tag = await createTag(trimmed)
      setTags((prev) => [...prev, tag])
      setNewTag('')
      toast.success('Tag created')
    } catch {
      toast.error('Failed to create tag')
    }
  }

  const handleDelete = async (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTag(id)
      toast.success('Tag deleted')
    } catch {
      getTags()
        .then(setTags)
        .catch(() => {})
      toast.error('Failed to delete tag')
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12 md:py-20">
        <GlassPanel>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground/60 text-sm">Loading tags...</p>
          </div>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-12 md:py-20">
      <header className="flex items-center gap-3 px-1">
        <Link
          to="/"
          className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg flex size-8 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-200"
          aria-label="Back to tasks"
        >
          <ArrowLeft className="size-3.5" />
        </Link>
        <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight">Tags</h1>
      </header>

      <GlassPanel>
        <form onSubmit={handleCreate} className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!newTag.trim()}
              className="bg-primary text-primary-foreground flex size-[22px] shrink-0 items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Add tag"
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
            </button>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag..."
              className="text-foreground placeholder:text-muted-foreground/50 flex-1 bg-transparent text-[15px] outline-none"
            />
          </div>
        </form>

        {tags.length > 0 && <div className="bg-glass-border/60 mx-4 h-px" />}

        <div className="flex flex-col gap-1 p-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group hover:bg-glass-bg/40 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: `oklch(0.65 0.18 ${tagHue(tag.name)})` }}
              />
              <span className="text-foreground flex-1 text-sm">{tag.name}</span>
              <button
                onClick={() => handleDelete(tag.id)}
                className="text-muted-foreground/40 hover:text-destructive flex size-6 items-center justify-center rounded-full opacity-0 transition-all duration-150 group-hover:opacity-100"
                aria-label="Delete tag"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="flex flex-col items-center py-12">
            <p className="text-muted-foreground/60 text-sm">No tags yet</p>
          </div>
        )}
      </GlassPanel>
    </div>
  )
}
