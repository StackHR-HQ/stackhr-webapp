import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { CheckboxField } from '../../../components/ui/checkbox-field'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { PasswordField } from '../../../components/ui/password-field'
import { TextField } from '../../../components/ui/text-field'
import { notify } from '../../../lib/toast'
import { AuthSplitShell } from '../components/auth-split-shell'
import { useLogin } from '../hooks/use-login'
import { loginSchema, type LoginFormValues } from '../schemas/login-schema'
import { AuthError } from '../types/auth-types'
import { getLastLoginHint } from '../store/auth-store'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const lastLogin = getLastLoginHint()

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
    defaultValues: { orgSlug: lastLogin?.orgSlug ?? '', email: lastLogin?.email ?? '', password: '', rememberMe: false },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await login.mutateAsync(values)
      notify.success('Welcome back')
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message = err instanceof AuthError ? err.message : 'Something went wrong. Please try again.'
      setError('root', { message })
      notify.error('Could not sign in', message)
      // Keep the workspace and email as typed; only the password needs
      // re-entering, and re-focusing it saves the user a click.
      resetField('password')
      setFocus('password')
    }
  })

  return (
    <AuthSplitShell
      title="Welcome back"
      subtitle="Sign in to continue to your StackHR workspace."
      footer={
        <>
          New to StackHR?{' '}
          <Link to="/signup" className="text-accent hover:underline">
            Create a workspace
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

        <div className="mb-4">
          <TextField
            id="orgSlug"
            label="Workspace slug"
            autoCapitalize="none"
            autoComplete="organization"
            placeholder="e.g. acme-inc"
            error={errors.orgSlug?.message}
            {...register('orgSlug')}
          />
        </div>

        <div className="mb-4">
          <TextField
            id="email"
            label="Work email"
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
            label={
              <span className="flex items-center justify-between">
                <span>Password</span>
                <Link to="/forgot-password" className="text-sm font-normal text-accent hover:underline">
                  Forgot password?
                </Link>
              </span>
            }
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="mb-5">
          <CheckboxField label="Keep me signed in" {...register('rememberMe')} />
        </div>

        <Button type="submit" loading={isSubmitting}>
          Continue to StackHR
        </Button>
      </form>
    </AuthSplitShell>
  )
}
