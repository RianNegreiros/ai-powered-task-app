import { useState } from 'react'
import { LiquidBackground } from '@/components/liquid-background'
import { TodoApp } from '@/components/todo-app'
import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'
import { LandingPage } from '@/components/landing-page'
import { AuthProvider, useAuth } from '@/components/auth-context'

type View = 'landing' | 'login' | 'register'

function AppContent() {
  const { user } = useAuth()
  const [view, setView] = useState<View>('landing')

  return (
    <main className="relative min-h-dvh">
      <LiquidBackground />
      {user ? (
        <TodoApp />
      ) : view === 'landing' ? (
        <LandingPage onGetStarted={() => setView('login')} />
      ) : view === 'login' ? (
        <LoginForm onSwitchToRegister={() => setView('register')} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setView('login')} />
      )}
    </main>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh overflow-x-hidden font-sans antialiased">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  )
}
