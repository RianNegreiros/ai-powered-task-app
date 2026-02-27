'use client'

import { useState, type FormEvent } from 'react'
import { LogIn } from 'lucide-react'
import { GlassPanel } from './glass-panel'
import { GlassInput } from './glass-input'
import { GlassButton } from './glass-button'
import { useAuth } from './auth-context'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    await login(email, password)
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-5 py-16 md:py-24">
      {/* Header */}
      <header className="animate-slide-up flex flex-col items-center gap-3 text-center">
        <div className="bg-primary/10 border-primary/20 flex size-14 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_var(--glass-highlight)] backdrop-blur-xl">
          <LogIn className="text-primary size-6" />
        </div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign in to continue to your tasks
        </p>
      </header>

      {/* Form card */}
      <GlassPanel className="animate-slide-up" style={{ animationDelay: '60ms' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          {/* API error */}
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive animate-slide-up rounded-xl border px-4 py-3 text-[13px]">
              {error}
            </div>
          )}

          <GlassInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) {
                setFieldErrors((p) => ({ ...p, email: '' }))
              }
            }}
            error={fieldErrors.email}
            autoComplete="email"
            autoFocus
          />

          <GlassInput
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (fieldErrors.password) {
                setFieldErrors((p) => ({ ...p, password: '' }))
              }
            }}
            error={fieldErrors.password}
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-primary/70 hover:text-primary text-[13px] transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <GlassButton type="submit" isLoading={isLoading}>
            Sign In
          </GlassButton>
        </form>
      </GlassPanel>

      {/* Switch to register */}
      <p
        className="text-muted-foreground animate-slide-up text-center text-sm"
        style={{ animationDelay: '120ms' }}
      >
        {"Don't have an account? "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Create one
        </button>
      </p>
    </div>
  )
}
