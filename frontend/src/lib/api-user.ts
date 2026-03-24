import { apiFetch } from './api'
import type { User } from '@/components/auth-context'

export type { User }

export async function getMe(): Promise<User> {
  const res = await apiFetch('/api/auth/me')
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}
