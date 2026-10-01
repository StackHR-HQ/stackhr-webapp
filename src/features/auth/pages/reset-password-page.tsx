import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { PasswordField } from '../../../components/ui/password-field'
import { notify } from '../../../lib/toast'
import { AuthShell } from '../components/auth-shell'
import { useResetPassword } from '../hooks/use-reset-password'
import { useVerifyResetToken } from '../hooks/use-verify-reset-token'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/reset-password-schema'
import { AuthError } from '../types/auth-types'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? undefined

  const tokenStatus = useVerifyResetToken(token)
  const resetPassword = useResetPassword()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await resetPassword.mutateAsync({ token: token!, ...values })
      notify.success('Password reset', 'Please sign in with your new password.')
      navigate('/login', { replace: true })
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Something went wrong. Please try again.'
      setError('root', { message })
      notify.error('Could not reset password', message)
    }
  })

  if (!token || tokenStatus.isError || tokenStatus.data?.valid === false) {
    return (
      <AuthShell
        title="Link expired"
        subtitle="This password reset link is invalid or has expired."
        footer={
          <Link to="/login" className="text-accent hover:underline">
            Back to sign in
          </Link>
        }
      >
        <Button type="button" onClick={() => navigate('/forgot-password')}>
          Request a new link
        </Button>
      </AuthShell>
    )
  }

  if (tokenStatus.isPending) {
    return (
      <AuthShell title="Reset your password" subtitle="Checking your reset link…">
        <div className="h-24 animate-pulse rounded-lg bg-canvas" />
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle={tokenStatus.data.email ? `For ${tokenStatus.data.email}` : undefined}
      footer={
        <Link to="/login" className="text-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

        <div className="mb-4">
          <PasswordField
            id="password"
            label="New password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="mb-5">
          <PasswordField
            id="confirmPassword"
            label="Confirm new password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <Button type="submit" loading={isSubmitting}>
          Reset password
        </Button>
      </form>
    </AuthShell>
  )
}
