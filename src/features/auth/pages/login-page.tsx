import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '../../../components/ui/button'
import { CheckboxField } from '../../../components/ui/checkbox-field'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { PasswordField } from '../../../components/ui/password-field'
import { TextField } from '../../../components/ui/text-field'
import { AuthSplitShell } from '../components/auth-split-shell'
import { useLogin } from '../hooks/use-login'
import { loginSchema, type LoginFormValues } from '../schemas/login-schema'
import { AuthError } from '../types/auth-types'

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
    defaultValues: { email: '', password: '', rememberMe: false },
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
      resetField('password')
      setFocus('password')
    }
  })

  return (
    <AuthSplitShell
      title="Sign in to StackHR"
      subtitle="Enter your account details"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

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
          <CheckboxField label="Remember me" {...register('rememberMe')} />
        </div>

        <Button type="submit" loading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthSplitShell>
  )
}
