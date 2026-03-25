import { UserPlus, Check, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassPanel } from './glass-panel'
import { GlassInput } from './glass-input'
import { GlassButton } from './glass-button'
import { useAuth } from './auth-context'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { type RegisterFormData, registerSchema } from '@/schemas/auth'

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
]

export function RegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')
  const showPasswordRules = password.length > 0

  const onSubmit = async (data: RegisterFormData) => {
    clearError()
    await registerUser(data.name, data.email, data.password)
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-5 py-12 md:py-20">
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

      <GlassPanel className="animate-slide-up" style={{ animationDelay: '60ms' }}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive animate-slide-up rounded-xl border px-4 py-3 text-[13px]">
              {error}
            </div>
          )}

          <GlassInput
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            autoFocus
            error={errors.name?.message}
            {...register('name')}
          />

          <GlassInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex flex-col gap-1.5">
            <GlassInput
              label="Password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

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
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <GlassButton type="submit" isLoading={isLoading} className="mt-1">
            Create Account
          </GlassButton>
        </form>
      </GlassPanel>

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

      <p
        className="text-muted-foreground animate-slide-up text-center text-sm"
        style={{ animationDelay: '140ms' }}
      >
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
