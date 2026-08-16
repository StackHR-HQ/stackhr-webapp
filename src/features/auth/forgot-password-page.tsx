import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { useRequestPasswordReset } from './hooks'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from './schema'

export function ForgotPasswordPage() {
  const requestReset = useRequestPasswordReset()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    await requestReset.mutateAsync(values.email)
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-medium text-ink">Reset your password</h1>
          <p className="mt-1 text-sm text-muted">We&apos;ll email you a link to reset it</p>
        </div>

        <div className="rounded-panel border border-line bg-surface p-6 shadow-panel">
          {requestReset.isSuccess ? (
            <p className="text-sm text-ink">
              If an account exists for that email, we&apos;ve sent a reset link. Check your inbox.
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="mb-5">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-muted">
          <Link to="/login" className="text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
