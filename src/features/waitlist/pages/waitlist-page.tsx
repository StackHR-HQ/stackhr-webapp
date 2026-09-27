import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { TextField } from '../../../components/ui/text-field'
import { AuthSplitShell } from '../../auth/components/auth-split-shell'
import { useJoinWaitlist } from '../hooks/use-join-waitlist'
import { waitlistSchema, type WaitlistFormValues } from '../schemas/waitlist-schema'
import { WaitlistError } from '../types/waitlist-types'

export function WaitlistPage() {
  const joinWaitlist = useJoinWaitlist()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { name: '', position: '', businessName: '', businessEmail: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await joinWaitlist.mutateAsync(values)
    } catch (err) {
      const message = err instanceof WaitlistError ? err.message : 'Something went wrong. Please try again.'
      setError('root', { message })
    }
  })

  const entry = joinWaitlist.data

  return (
    <AuthSplitShell
      title="Join the StackHR waitlist"
      subtitle="Be first in line for People, Payroll, and Spend built for African SMEs"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {entry ? (
        <div role="status" className="text-sm text-ink">
          <p className="font-medium">{entry.alreadyJoined ? "You're already on the list." : "You're on the list."}</p>
          <p className="mt-1 text-muted">
            {entry.alreadyJoined
              ? `We already have ${entry.businessEmail}. We'll be in touch as soon as we open up.`
              : `Thanks, ${entry.name}. We'll email ${entry.businessEmail} as soon as we open up.`}
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

          <div className="mb-4">
            <TextField
              id="name"
              label="Full name"
              autoComplete="name"
              placeholder="Jane Doe"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div className="mb-4">
            <TextField
              id="position"
              label="Your role"
              autoComplete="organization-title"
              placeholder="Head of HR"
              error={errors.position?.message}
              {...register('position')}
            />
          </div>

          <div className="mb-4">
            <TextField
              id="businessName"
              label="Company name"
              autoComplete="organization"
              placeholder="Acme Technologies"
              error={errors.businessName?.message}
              {...register('businessName')}
            />
          </div>

          <div className="mb-5">
            <TextField
              id="businessEmail"
              label="Work email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              error={errors.businessEmail?.message}
              {...register('businessEmail')}
            />
          </div>

          <Button type="submit" loading={isSubmitting}>
            Join waitlist
          </Button>
        </form>
      )}
    </AuthSplitShell>
  )
}
