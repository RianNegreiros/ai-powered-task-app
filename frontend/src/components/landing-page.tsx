import { CheckCircle2, Sparkles, Zap } from 'lucide-react'
import { GlassPanel } from './glass-panel'
import { GlassButton } from './glass-button'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-5 py-16 md:py-24">
      {/* Hero Section */}
      <header className="animate-slide-up flex flex-col items-center gap-6 text-center">
        <div className="bg-primary/10 border-primary/20 flex size-20 items-center justify-center rounded-3xl border shadow-[inset_0_1px_0_var(--glass-highlight)] backdrop-blur-xl">
          <Sparkles className="text-primary size-10" />
        </div>
        <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance md:text-5xl">
          AI-Powered Task Management
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Organize your tasks with intelligent assistance. Simple, beautiful, and powerful.
        </p>
        <GlassButton onClick={onGetStarted} className="mt-4">
          Get Started
        </GlassButton>
      </header>

      {/* Features */}
      <div
        className="animate-slide-up grid gap-6 md:grid-cols-3"
        style={{ animationDelay: '100ms' }}
      >
        <GlassPanel className="flex flex-col gap-4 p-6">
          <div className="bg-primary/10 border-primary/20 flex size-12 items-center justify-center rounded-xl border">
            <Zap className="text-primary size-6" />
          </div>
          <h3 className="text-foreground text-lg font-semibold">Fast & Intuitive</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Create and manage tasks effortlessly with a clean, modern interface.
          </p>
        </GlassPanel>

        <GlassPanel className="flex flex-col gap-4 p-6">
          <div className="bg-accent/10 border-accent/20 flex size-12 items-center justify-center rounded-xl border">
            <Sparkles className="text-accent size-6" />
          </div>
          <h3 className="text-foreground text-lg font-semibold">AI-Powered</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Smart suggestions and automation to help you stay productive.
          </p>
        </GlassPanel>

        <GlassPanel className="flex flex-col gap-4 p-6">
          <div className="bg-primary/10 border-primary/20 flex size-12 items-center justify-center rounded-xl border">
            <CheckCircle2 className="text-primary size-6" />
          </div>
          <h3 className="text-foreground text-lg font-semibold">Stay Organized</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Track progress and never miss a deadline with smart reminders.
          </p>
        </GlassPanel>
      </div>
    </div>
  )
}
