import { useEffect, useState } from 'react'
import { User, Moon, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { GlassPanel } from './glass-panel'
import { useAuth } from './auth-context'
import { getMe } from '@/lib/api-user'

export function ProfilePage() {
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [profile, setProfile] = useState<{ id: string; name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12 md:py-20">
        <GlassPanel>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground/60 text-sm">Loading...</p>
          </div>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-12 md:py-20">
      <header className="flex items-center justify-between px-1">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">Profile</h1>
        <Link
          to="/"
          className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg cursor-pointer rounded-full border px-4 py-2 text-sm backdrop-blur-xl transition-all duration-200"
        >
          Back to Tasks
        </Link>
      </header>

      <GlassPanel>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-glass-bg/60 border-glass-border flex size-16 items-center justify-center rounded-full border backdrop-blur-xl">
              <User className="text-muted-foreground size-8" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-foreground text-xl font-semibold">{profile?.name}</h2>
              <p className="text-muted-foreground/60 text-sm">{profile?.email}</p>
            </div>
          </div>

          <div className="bg-glass-border/60 h-px" />

          <div className="flex flex-col gap-3">
            <h3 className="text-foreground text-sm font-medium">Appearance</h3>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Theme</span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg dark:hover:shadow-[0_0_12px_var(--primary)/0.15] flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-xl transition-all duration-200"
              >
                {theme === 'dark' ? (
                  <>
                    <Moon className="size-4" />
                    Dark
                  </>
                ) : (
                  <>
                    <Sun className="size-4" />
                    Light
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-glass-border/60 h-px" />

          <button
            onClick={logout}
            className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg w-full cursor-pointer rounded-full border py-2.5 text-sm backdrop-blur-xl transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </GlassPanel>
    </div>
  )
}
