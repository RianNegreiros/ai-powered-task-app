import { apiFetch } from './api'

export interface Report {
  id: number
  content: string
  createdAt: string
}

export async function getAllReports(): Promise<Report[]> {
  const res = await apiFetch('/api/reports/me')
  if (!res.ok) throw new Error('Failed to fetch reports')
  return res.json()
}

export async function getLatestReport(): Promise<Report> {
  const res = await apiFetch('/api/reports/me/latest')
  if (!res.ok) throw new Error('Failed to fetch latest report')
  return res.json()
}
