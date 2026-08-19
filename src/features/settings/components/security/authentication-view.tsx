import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { Switch } from '../../../../components/ui/switch'
import { TextField } from '../../../../components/ui/text-field'
import { useUpdateAuthenticationSettings } from '../../hooks/use-update-authentication-settings'
import { authenticationSettingsSchema, type AuthenticationSettingsFormValues } from '../../schemas/security-schemas'
import type { AuthenticationSettings } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

const TWO_FACTOR_METHODS = [
  { value: 'authenticator_app', label: 'Authenticator app' },
  { value: 'sms', label: 'SMS' },
]

export function AuthenticationView({ authentication }: { authentication: AuthenticationSettings }) {
  const updateAuthenticationSettings = useUpdateAuthenticationSettings()
  const { control, register, handleSubmit } = useForm<AuthenticationSettingsFormValues>({
    resolver: zodResolver(authenticationSettingsSchema),
    values: authentication,
  })

  const twoFactorEnabled = useWatch({ control, name: 'twoFactorEnabled' })
  const ssoEnabled = useWatch({ control, name: 'ssoEnabled' })

  const onSubmit = handleSubmit((values) => {
    updateAuthenticationSettings.mutate(values)
  })

  return (
    <Card>
      <CardHeader title="Authentication" description="Control how members of your organization sign in." />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="rounded-lg border border-line p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">Two-factor authentication</p>
              <p className="mt-0.5 text-xs text-muted">Require a second step to sign in, on top of your password.</p>
            </div>
            <Controller
              control={control}
              name="twoFactorEnabled"
              render={({ field }) => (
                <Switch checked={field.value} onChange={field.onChange} label="Two-factor authentication" />
              )}
            />
          </div>
          {twoFactorEnabled ? (
            <div className="mt-3">
              <Controller
                control={control}
                name="twoFactorMethod"
                render={({ field }) => (
                  <SelectField
                    id="twoFactorMethod"
                    label="Method"
                    placeholder="Select a method"
                    options={TWO_FACTOR_METHODS}
                    value={field.value ?? ''}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                )}
              />
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-line p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-ink">Single sign-on (SSO)</p>
              <p className="mt-0.5 text-xs text-muted">Let your team sign in through your identity provider.</p>
            </div>
            <Controller
              control={control}
              name="ssoEnabled"
              render={({ field }) => <Switch checked={field.value} onChange={field.onChange} label="Single sign-on" />}
            />
          </div>
          {ssoEnabled ? (
            <div className="mt-3">
              <TextField id="ssoProvider" label="Identity provider" placeholder="e.g. Okta, Azure AD" {...register('ssoProvider')} />
            </div>
          ) : null}
        </div>

        <SettingsFormFooter isPending={updateAuthenticationSettings.isPending} isSuccess={updateAuthenticationSettings.isSuccess} />
      </form>
    </Card>
  )
}
