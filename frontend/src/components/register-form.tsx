'use client'

import { useState, type FormEvent } from 'react'
import { UserPlus, Check, X } from 'lucide-react'
import { GlassPanel } from './glass-panel'
import { GlassInput } from './glass-input'
import { GlassButton } from './glass-button'
import { useAuth } from './auth-context'
import { cn } from '@/lib/utils'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
]

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPasswordRules, setShowPasswordRules] = useState(false)

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = 'Name is required'
    if (!email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    await register(name, email, password)
  }

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((p) => ({ ...p, [field]: '' }))
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-5 py-12 md:py-20">
      {/* Header */}
      <header className="animate-slide-up flex flex-col items-center gap-3 text-center">
        <div className="bg-accent/10 border-accent/20 flex size-14 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_var(--glass-highlight)] backdrop-blur-xl">
          <UserPlus className="text-accent size-6" />
        </div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Get started with your personal task manager
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
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              clearFieldError('name')
            }}
            error={fieldErrors.name}
            autoComplete="name"
            autoFocus
          />

          <GlassInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearFieldError('email')
            }}
            error={fieldErrors.email}
            autoComplete="email"
          />

          <div className="flex flex-col gap-1.5">
            <GlassInput
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearFieldError('password')
                if (!showPasswordRules && e.target.value.length > 0) {
                  setShowPasswordRules(true)
                }
              }}
              error={fieldErrors.password}
              autoComplete="new-password"
            />

            {/* Password strength indicators */}
            {showPasswordRules && (
              <div className="animate-slide-up flex flex-col gap-1 px-1 pt-1">
                {passwordRules.map((rule) => {
                  const passed = rule.test(password)
                  return (
                    <div key={rule.label} className="flex items-center gap-2 text-[12px]">
                      <div
                        className={cn(
                          'flex size-3.5 items-center justify-center rounded-full transition-all duration-300',
                          passed
                            ? 'bg-accent text-accent-foreground'
                            : 'border-muted-foreground/30 border'
                        )}
                      >
                        {passed ? (
                          <Check className="size-2.5" strokeWidth={3} />
                        ) : (
                          <X className="text-muted-foreground/40 size-2.5" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'transition-colors duration-200',
                          passed ? 'text-foreground/70' : 'text-muted-foreground/50'
                        )}
                      >
                        {rule.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <GlassInput
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              clearFieldError('confirmPassword')
            }}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
          />

          <GlassButton type="submit" isLoading={isLoading} className="mt-1">
            Create Account
          </GlassButton>
        </form>
      </GlassPanel>

      {/* Terms */}
      <p
        className="text-muted-foreground/50 animate-slide-up px-4 text-center text-[12px] leading-relaxed"
        style={{ animationDelay: '100ms' }}
      >
        By creating an account you agree to our{' '}
        <button
          type="button"
          className="text-primary/60 hover:text-primary underline underline-offset-2 transition-colors"
        >
          Terms of Service
        </button>{' '}
        and{' '}
        <button
          type="button"
          className="text-primary/60 hover:text-primary underline underline-offset-2 transition-colors"
        >
          Privacy Policy
        </button>
      </p>

      {/* Switch to login */}
      <p
        className="text-muted-foreground animate-slide-up text-center text-sm"
        style={{ animationDelay: '140ms' }}
      >
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
