import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { PasswordField } from '../../../components/ui/password-field'
import { notify } from '../../../lib/toast'
import { AuthShell } from '../components/auth-shell'
import { useAcceptInvitation } from '../hooks/use-accept-invitation'
import { useInvitationPreview } from '../hooks/use-invitation-preview'
import {
  existingAccountInvitationSchema,
  newAccountInvitationSchema,
  type AcceptInvitationFormValues,
} from '../schemas/accept-invitation-schema'
import { AuthError, type InvitationPreview } from '../types/auth-types'

function AcceptInvitationForm({ token, invitation }: { token: string; invitation: InvitationPreview }) {
  const navigate = useNavigate()
  const acceptInvitation = useAcceptInvitation()
  const { hasAccount, organizationName } = invitation

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(hasAccount ? existingAccountInvitationSchema : newAccountInvitationSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async ({ password }) => {
    clearErrors('root')
    try {
      const session = await acceptInvitation.mutateAsync({ token, password })
      if (session) {
        notify.success('Welcome to StackHR', `You've joined ${organizationName}.`)
        navigate('/', { replace: true })
      } else {
        notify.success('Invitation accepted', 'Please sign in to continue.')
        navigate('/login', { replace: true })
      }
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Something went wrong. Please try again.'
      setError('root', { message })
      notify.error('Could not accept invitation', message)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

      <div className={hasAccount ? 'mb-5' : 'mb-4'}>
        <PasswordField
          id="password"
          label={hasAccount ? 'Password' : 'Create password'}
          autoComplete={hasAccount ? 'current-password' : 'new-password'}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {!hasAccount ? (
        <div className="mb-5">
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>
      ) : null}

      <Button type="submit" loading={isSubmitting}>
        Accept invitation
      </Button>
    </form>
  )
}

export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? undefined
  const invitation = useInvitationPreview(token)

  if (!token || invitation.isError) {
    return (
      <AuthShell
        title="Invitation unavailable"
        subtitle={
          invitation.error instanceof AuthError
            ? invitation.error.message
            : 'This invitation link is invalid or has expired.'
        }
        footer={
          <Link to="/login" className="text-accent hover:underline">
            Back to sign in
          </Link>
        }
      >
        <p className="text-sm text-muted">Ask your administrator to send you a new invitation.</p>
      </AuthShell>
    )
  }

  if (invitation.isPending) {
    return (
      <AuthShell title="Join your team" subtitle="Checking your invitation…">
        <div className="h-24 animate-pulse rounded-lg bg-canvas" />
      </AuthShell>
    )
  }

  const { employeeName, email, organizationName, hasAccount } = invitation.data
  const firstName = employeeName.split(' ')[0]

  return (
    <AuthShell
      title={`Join ${organizationName}`}
      subtitle={
        hasAccount
          ? `Hi ${firstName}, sign in as ${email} to accept the invitation.`
          : `Hi ${firstName}, set a password for ${email} to get started.`
      }
      footer={
        <Link to="/login" className="text-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      <AcceptInvitationForm token={token} invitation={invitation.data} />
    </AuthShell>
  )
}
