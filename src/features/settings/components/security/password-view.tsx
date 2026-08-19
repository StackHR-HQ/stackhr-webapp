import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PasswordField } from '../../../../components/ui/password-field'
import { Card, CardHeader } from '../../../../components/ui/card'
import { useChangePassword } from '../../hooks/use-change-password'
import { changePasswordSchema, type ChangePasswordFormValues } from '../../schemas/security-schemas'
import { SettingsFormFooter } from '../settings-form-footer'

export function PasswordView() {
  const changePassword = useChangePassword()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  })

  const onSubmit = handleSubmit((values) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => reset({ currentPassword: '', newPassword: '', confirmNewPassword: '' }) },
    )
  })

  return (
    <Card>
      <CardHeader title="Password" description="Change the password used to sign in to your account." />
      <form onSubmit={onSubmit} noValidate className="max-w-sm space-y-4">
        <PasswordField
          id="currentPassword"
          label="Current password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <PasswordField id="newPassword" label="New password" error={errors.newPassword?.message} {...register('newPassword')} />
        <PasswordField
          id="confirmNewPassword"
          label="Confirm new password"
          error={errors.confirmNewPassword?.message}
          {...register('confirmNewPassword')}
        />

        <SettingsFormFooter isPending={changePassword.isPending} isSuccess={changePassword.isSuccess} />
      </form>
    </Card>
  )
}
