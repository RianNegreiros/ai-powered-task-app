import { LogOut, User, Tag as TagIcon, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { User as UserType } from '@/components/auth-context'

interface TodoAppHeaderProps {
  user: UserType | null
  onLogout: () => void
}

const navLinkClass =
  'bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-foreground hover:bg-glass-bg hover:border-primary/30 flex flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-1.5 backdrop-blur-xl transition-all duration-200 hover:shadow-sm sm:size-9 sm:rounded-full sm:p-0'

export function TodoAppHeader({ user, onLogout }: TodoAppHeaderProps) {
  const today = new Date()
  const dateLong = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
  const dateShort = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <header className="mb-3 flex items-center justify-between gap-2 px-1 md:mb-4">
      <div>
        <h1 className="font-display text-foreground text-2xl font-semibold tracking-tight md:text-3xl">
          Tasks
        </h1>
        {user && (
          <p className="text-muted-foreground/60 mt-0.5 text-xs md:text-sm">
            {'Hello, '}
            <span className="text-foreground/70 font-medium">{user.name.split(' ')[0]}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <p className="text-muted-foreground/70 text-xs font-medium sm:hidden">{dateShort}</p>
        <p className="text-muted-foreground/70 hidden text-sm font-medium sm:block">{dateLong}</p>

        {user && (
          <>
            <Link to="/reports" className={navLinkClass} aria-label="Weekly report">
              <BarChart3 className="size-4" />
              <span className="text-[10px] font-medium sm:hidden">Reports</span>
            </Link>
            <Link to="/tags" className={navLinkClass} aria-label="Manage tags">
              <TagIcon className="size-4" />
              <span className="text-[10px] font-medium sm:hidden">Tags</span>
            </Link>
            <Link to="/profile" className={navLinkClass} aria-label="Profile">
              <User className="size-4" />
              <span className="text-[10px] font-medium sm:hidden">Profile</span>
            </Link>
            <button
              onClick={onLogout}
              className="bg-glass-bg/60 border-glass-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 flex flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-1.5 backdrop-blur-xl transition-all duration-200 sm:size-9 sm:rounded-full sm:p-0"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
              <span className="text-[10px] font-medium sm:hidden">Sign out</span>
            </button>
          </>
        )}
      </div>
    </header>
  )
}
