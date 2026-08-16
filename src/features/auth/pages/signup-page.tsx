import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { PasswordField } from '../../../components/ui/password-field'
import { TextField } from '../../../components/ui/text-field'
import { AuthSplitShell } from '../components/auth-split-shell'
import { useSignup } from '../hooks/use-signup'
import { signupSchema, type SignupFormValues } from '../schemas/signup-schema'
import { AuthError } from '../types/auth-types'

export function SignupPage() {
  const navigate = useNavigate()
  const signup = useSignup()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { companyName: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      const { email } = await signup.mutateAsync(values)
      navigate('/verify-email', { state: { email } })
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Something went wrong. Please try again.'
      setError('root', { message })
    }
  })

  return (
    <AuthSplitShell
      title="Create your workspace"
      subtitle="Set up People, Payroll, and Spend for your company"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

        <div className="mb-4">
          <TextField
            id="companyName"
            label="Company name"
            autoComplete="organization"
            placeholder="Acme Inc."
            error={errors.companyName?.message}
            {...register('companyName')}
          />
        </div>

        <div className="mb-4">
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

        <div className="mb-4">
          <PasswordField
            id="password"
            label="Password"
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
          Create workspace
        </Button>
      </form>
    </AuthSplitShell>
  )
}
