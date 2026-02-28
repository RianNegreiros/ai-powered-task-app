import { apiFetch } from './api'

export interface Tag {
  id: string
  name: string
}

export async function getTags(): Promise<Tag[]> {
  const res = await apiFetch('/api/tags/me')
  if (!res.ok) throw new Error('Failed to fetch tags')
  return res.json()
}

export async function createTag(name: string): Promise<Tag> {
  const res = await apiFetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Failed to create tag')
  return res.json()
}

export async function deleteTag(id: string): Promise<void> {
  const res = await apiFetch(`/api/tags/me/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete tag')
}
