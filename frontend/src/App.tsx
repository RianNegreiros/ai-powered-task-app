import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { LiquidBackground } from '@/components/liquid-background'
import { TodoApp } from '@/components/todo-app'
import { ProfilePage } from '@/components/profile-page'
import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'
import { LandingPage } from '@/components/landing-page'
import { AuthProvider, useAuth } from '@/components/auth-context'
import { Toaster } from '@/components/ui/sonner'

type View = 'landing' | 'login' | 'register'

function AppContent() {
  const { user } = useAuth()
  const [view, setView] = useState<View>('landing')

  if (!user) {
    return (
      <main className="relative min-h-dvh">
        <LiquidBackground />
        {view === 'landing' ? (
          <LandingPage onGetStarted={() => setView('login')} />
        ) : view === 'login' ? (
          <LoginForm onSwitchToRegister={() => setView('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setView('login')} />
        )}
      </main>
    )
  }

  return (
    <main className="relative min-h-dvh">
      <LiquidBackground />
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div className="min-h-dvh overflow-x-hidden font-sans antialiased">
          <AuthProvider>
            <AppContent />
          </AuthProvider>
          <Toaster />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}
