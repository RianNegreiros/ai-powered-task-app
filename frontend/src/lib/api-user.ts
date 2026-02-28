import { apiFetch } from './api'

export interface User {
  id: string
  name: string
  email: string
}

export async function getMe(): Promise<User> {
  const res = await apiFetch('/api/auth/me')
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}
