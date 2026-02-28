const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

async function refreshToken(): Promise<string> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) throw new Error('No refresh token')

    const res = await fetch(`${API_BASE}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'refresh-token': refreshToken }),
    })

    if (!res.ok) throw new Error('Refresh failed')

    const data = await res.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    return data.token
  })()

  try {
    const token = await refreshPromise
    return token
  } finally {
    refreshPromise = null
    isRefreshing = false
  }
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')

  const headers = new Headers(options.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let res = await fetch(`${API_BASE}${url}`, { ...options, headers })

  if (res.status === 401 && !isRefreshing) {
    isRefreshing = true
    try {
      const newToken = await refreshToken()
      headers.set('Authorization', `Bearer ${newToken}`)
      res = await fetch(`${API_BASE}${url}`, { ...options, headers })
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      window.location.href = '/'
      throw new Error('Session expired')
    }
  }

  return res
}
