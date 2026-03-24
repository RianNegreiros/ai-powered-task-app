import { useState, useCallback } from 'react'

export type ViewMode = 'kanban' | 'list'

const STORAGE_KEY = 'task-view-mode'

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'kanban' || stored === 'list') return stored
    } catch {}
    return 'kanban'
  })

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {}
  }, [])

  return { viewMode, setViewMode }
}
