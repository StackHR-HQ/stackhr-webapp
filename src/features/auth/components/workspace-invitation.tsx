import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { PasswordField } from '../../../components/ui/password-field'
import { TextField } from '../../../components/ui/text-field'
import { notify } from '../../../lib/toast'
import { useAcceptWorkspaceInvitation, useWorkspaceInvitation } from '../hooks/use-workspace-invitation'
import { workspaceInvitationSchema, type WorkspaceInvitationFormValues } from '../schemas/accept-invitation-schema'
import { AuthError } from '../types/auth-types'
import { toUiRole } from '../api/auth-api'
import { AuthShell } from './auth-shell'

const ROLE_LABEL = { admin: 'an admin', manager: 'a manager', employee: 'a team member' } as const

const backToSignIn = (
  <Link to="/login" className="text-accent hover:underline">
    Back to sign in
  </Link>
)

function WorkspaceInvitationForm({ invitationId, organizationName }: { invitationId: string; organizationName: string }) {
  const navigate = useNavigate()
  const acceptInvitation = useAcceptWorkspaceInvitation()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceInvitationFormValues>({
    resolver: zodResolver(workspaceInvitationSchema),
    defaultValues: { fullName: '', password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async ({ fullName, password }) => {
    clearErrors('root')
    try {
      await acceptInvitation.mutateAsync({ invitationId, fullName: fullName.trim(), password })
      notify.success('Invitation accepted', `You've joined ${organizationName}. Sign in to continue.`)
      navigate('/login', { replace: true })
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Something went wrong. Please try again.'
      setError('root', { message })
      notify.error('Could not accept invitation', message)
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

      <div className="mb-4">
        <TextField
          id="fullName"
          label="Full name"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
      </div>

      <div className="mb-4">
        <PasswordField
          id="password"
          label="Create password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

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

      <Button type="submit" loading={isSubmitting}>
        Accept invitation
      </Button>
    </form>
  )
}

// Opened from the link in a Team & Access invitation email: /accept-invitation?invitationId=<id>.
export function WorkspaceInvitation({ invitationId }: { invitationId: string }) {
  const invitation = useWorkspaceInvitation(invitationId)

  const unavailable =
    invitation.isError ||
    (invitation.data && (invitation.data.status !== 'pending' || new Date(invitation.data.expiresAt) < new Date()))

  if (unavailable) {
    return (
      <AuthShell
        title="Invitation unavailable"
        subtitle={
          invitation.error instanceof AuthError
            ? invitation.error.message
            : 'This invitation has already been used, was revoked, or has expired.'
        }
        footer={backToSignIn}
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

  const { email, role, organizationName } = invitation.data

  return (
    <AuthShell
      title={`Join ${organizationName}`}
      subtitle={`You've been invited as ${ROLE_LABEL[toUiRole(role)]}. Set up your account for ${email}.`}
      footer={backToSignIn}
    >
      <WorkspaceInvitationForm invitationId={invitationId} organizationName={organizationName} />
    </AuthShell>
  )
}
