import type { Task } from '@/components/todo-item'
import { apiFetch } from './api'

export async function getTasks() {
  const res = await apiFetch('/api/tasks/me')
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function createTask(body: {
  title: string
  priority?: string
  dueDate?: string
  tag?: string
  description?: string
}): Promise<Task> {
  const payload = Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== undefined))

  const res = await apiFetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message ?? 'Failed to create task')
  }
  return res.json()
}

export async function updateTask(
  id: string,
  body: {
    title?: string
    description?: string | null
    priority?: string
    dueDate?: string | null
    tag?: string | null
  }
): Promise<Task> {
  const res = await apiFetch(`/api/tasks/me/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message ?? 'Failed to update task')
  }
  return res.json()
}

export async function setTaskCompleted(id: string) {
  const res = await apiFetch(`/api/tasks/me/${id}`, {
    method: 'PATCH',
  })
  if (!res.ok) throw new Error('Failed to set toggle task completed field')
  return res.json()
}

export async function deleteTask(id: string) {
  const res = await apiFetch(`/api/tasks/me/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete task')
}
