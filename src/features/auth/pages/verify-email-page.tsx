import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { OtpInput } from '../../../components/ui/otp-input'
import { TrailingDots } from '../../../components/ui/trailing-dots'
import { USE_MOCK_AUTH } from '../../../lib/env'
import { DEMO_OTP_CODE } from '../api/auth-mock-api'
import { AuthShell } from '../components/auth-shell'
import { useResendEmailOtp } from '../hooks/use-resend-email-otp'
import { useVerifyEmailOtp } from '../hooks/use-verify-email-otp'
import { otpSchema, type OtpFormValues } from '../schemas/otp-schema'
import { AuthError } from '../types/auth-types'

const RESEND_COOLDOWN_SECONDS = 30

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email

  const verifyOtp = useVerifyEmailOtp()
  const resendOtp = useResendEmailOtp()
  const [cooldown, setCooldown] = useState(0)

  const {
    control,
    handleSubmit,
    resetField,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  })

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((seconds) => seconds - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Only reachable right after a signup submission carries the email along
  // via navigation state; a direct visit has nothing to verify.
  if (!email) {
    return <Navigate to="/signup" replace />
  }

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await verifyOtp.mutateAsync({ email, code: values.code })
      navigate('/onboarding', { replace: true })
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Something went wrong. Please try again.'
      setError('root', { message })
      resetField('code')
    }
  })

  async function handleResend() {
    await resendOtp.mutateAsync(email as string)
    setCooldown(RESEND_COOLDOWN_SECONDS)
  }

  return (
    <AuthShell
      title="Verify your email"
      subtitle={`Enter the 6-digit code we sent to ${email}`}
      footer={
        <Link to="/signup" className="text-accent hover:underline">
          Use a different email
        </Link>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

        {USE_MOCK_AUTH ? (
          <div className="mb-4 rounded-lg border border-line bg-canvas p-3 text-xs text-muted">
            No backend yet — use code <span className="font-mono text-ink">{DEMO_OTP_CODE}</span>.
          </div>
        ) : null}

        <div className="mb-5">
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <OtpInput value={field.value} onChange={field.onChange} error={errors.code?.message} />
            )}
          />
        </div>

        <Button type="submit" loading={isSubmitting}>
          Verify email
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resendOtp.isPending}
          className="mt-4 flex w-full items-center justify-center gap-2 text-center text-sm text-accent hover:underline disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
        >
          {resendOtp.isPending ? <TrailingDots size="sm" /> : null}
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </form>
    </AuthShell>
  )
}
