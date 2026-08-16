import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { USE_MOCK_AUTH } from '../../lib/env'
import { PasswordInput } from './components/password-input'
import { useLogin } from './hooks'
import { DEMO_LOGIN_CREDENTIALS } from './mock-api'
import { loginSchema, type LoginFormValues } from './schema'
import { AuthError } from './types'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { orgSlug: '', email: '', password: '', rememberMe: false },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await login.mutateAsync(values)
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Something went wrong. Please try again.'
      setError('root', { message })
      // Keep the workspace and email as typed; only the password needs
      // re-entering, and re-focusing it saves the user a click.
      resetField('password')
      setFocus('password')
    }
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-medium text-ink">Sign in to StackHR</h1>
          <p className="mt-1 text-sm text-muted">Enter your workspace and account details</p>
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-panel border border-line bg-surface p-6 shadow-panel"
        >
          {errors.root ? (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-critical/30 bg-critical/10 p-3 text-sm text-critical"
            >
              {errors.root.message}
            </div>
          ) : null}

          {USE_MOCK_AUTH ? (
            <div className="mb-4 rounded-lg border border-line bg-canvas p-3 text-xs text-muted">
              No backend yet — this form runs against a mock. Try workspace{' '}
              <span className="font-mono text-ink">{DEMO_LOGIN_CREDENTIALS.orgSlug}</span>, email{' '}
              <span className="font-mono text-ink">{DEMO_LOGIN_CREDENTIALS.email}</span>, password{' '}
              <span className="font-mono text-ink">{DEMO_LOGIN_CREDENTIALS.password}</span>.
            </div>
          ) : null}

          <div className="mb-4">
            <label htmlFor="orgSlug" className="mb-1.5 block text-sm font-medium text-ink">
              Workspace
            </label>
            <input
              id="orgSlug"
              type="text"
              autoCapitalize="none"
              autoComplete="organization"
              placeholder="acme"
              aria-invalid={Boolean(errors.orgSlug)}
              className={`w-full rounded-lg border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                errors.orgSlug ? 'border-critical' : 'border-line focus:border-accent'
              }`}
              {...register('orgSlug')}
            />
            {errors.orgSlug ? (
              <p className="mt-1.5 text-sm text-critical" role="alert">
                {errors.orgSlug.message}
              </p>
            ) : null}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
              className={`w-full rounded-lg border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                errors.email ? 'border-critical' : 'border-line focus:border-accent'
              }`}
              {...register('email')}
            />
            {errors.email ? (
              <p className="mt-1.5 text-sm text-critical" role="alert">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <label className="mb-5 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-line text-accent focus:ring-2 focus:ring-accent/40"
              {...register('rememberMe')}
            />
            Remember me
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
