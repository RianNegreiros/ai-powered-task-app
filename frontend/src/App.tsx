import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { LiquidBackground } from '@/components/liquid-background'
import { TodoApp } from '@/components/todo-app'
import { ProfilePage } from '@/components/profile-page'
import { TagsPage } from '@/components/tags-page'
import { ReportsPage } from '@/components/reports-page'
import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'
import { LandingPage } from '@/components/landing-page'
import { AuthProvider, useAuth } from '@/components/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Toaster } from '@/components/ui/sonner'

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <Navigate to="/tasks" replace /> : <>{children}</>
}

function AppRoutes() {
  return (
    <main className="relative min-h-dvh">
      <LiquidBackground />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tags"
          element={
            <ProtectedRoute>
              <TagsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
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
            <AppRoutes />
          </AuthProvider>
          <Toaster />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}
