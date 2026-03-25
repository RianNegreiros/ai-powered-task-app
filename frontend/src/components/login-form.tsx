import { LogIn } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GlassPanel } from './glass-panel'
import { GlassInput } from './glass-input'
import { GlassButton } from './glass-button'
import { useAuth } from './auth-context'
import { useNavigate } from 'react-router-dom'
import { loginSchema, type LoginFormData } from '@/schemas/auth'

export function LoginForm() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    await login(data.email, data.password)
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-5 py-16 md:py-24">
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

      <GlassPanel className="animate-slide-up" style={{ animationDelay: '60ms' }}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive animate-slide-up rounded-xl border px-4 py-3 text-[13px]">
              {error}
            </div>
          )}

          <GlassInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            error={errors.email?.message}
            {...register('email')}
          />

          <GlassInput
            label="Password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
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

      <p
        className="text-muted-foreground animate-slide-up text-center text-sm"
        style={{ animationDelay: '120ms' }}
      >
        {"Don't have an account? "}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Create one
        </button>
      </p>
    </div>
  )
}
