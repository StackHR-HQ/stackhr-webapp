import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'
import { TextField } from '../../../components/ui/text-field'
import { AuthShell } from '../components/auth-shell'
import { useRequestPasswordReset } from '../hooks/use-request-password-reset'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/forgot-password-schema'

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
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to reset it"
      footer={
        <Link to="/login" className="text-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      {requestReset.isSuccess ? (
        <p className="text-sm text-ink">
          If an account exists for that email, we&apos;ve sent a reset link. Check your inbox.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <div className="mb-5">
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Button type="submit" loading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
