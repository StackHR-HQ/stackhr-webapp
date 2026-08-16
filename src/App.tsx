import { Navigate, Route, Routes } from 'react-router'
import { ForgotPasswordPage } from './features/auth/pages/forgot-password-page'
import { LoginPage } from './features/auth/pages/login-page'
import { SignupPage } from './features/auth/pages/signup-page'
import { VerifyEmailPage } from './features/auth/pages/verify-email-page'
import { DashboardPlaceholder } from './pages/dashboard-placeholder'
import { OnboardingPlaceholder } from './pages/onboarding-placeholder'
import { ProtectedRoute } from './routing/protected-route'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPlaceholder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
