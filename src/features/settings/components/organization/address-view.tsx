import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardHeader } from '../../../../components/ui/card'
import { TextField } from '../../../../components/ui/text-field'
import { useUpdateOrganizationSettings } from '../../hooks/use-update-organization-settings'
import { organizationAddressSchema, type OrganizationAddressFormValues } from '../../schemas/organization-schemas'
import type { OrganizationAddress } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

export function AddressView({ address }: { address: OrganizationAddress }) {
  const updateOrganizationSettings = useUpdateOrganizationSettings()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationAddressFormValues>({
    resolver: zodResolver(organizationAddressSchema),
    values: address,
  })

  const onSubmit = handleSubmit((values) => {
    updateOrganizationSettings.mutate({ address: values })
  })

  return (
    <Card>
      <CardHeader title="Address" description="Your registered business address, used on payslips and compliance filings." />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextField
          id="line1"
          label="Address line 1"
          placeholder="14 Admiralty Way"
          error={errors.line1?.message}
          {...register('line1')}
        />
        <TextField
          id="line2"
          label={<span>Address line 2 <span className="font-normal text-muted">(optional)</span></span>}
          placeholder="Lekki Phase 1"
          error={errors.line2?.message}
          {...register('line2')}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField id="city" label="City" placeholder="Lagos" error={errors.city?.message} {...register('city')} />
          <TextField id="state" label="State" placeholder="Lagos" error={errors.state?.message} {...register('state')} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField id="country" label="Country" placeholder="Nigeria" error={errors.country?.message} {...register('country')} />
          <TextField
            id="postalCode"
            label={<span>Postal code <span className="font-normal text-muted">(optional)</span></span>}
            placeholder="106104"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
        </div>

        <SettingsFormFooter isPending={updateOrganizationSettings.isPending} isSuccess={updateOrganizationSettings.isSuccess} />
      </form>
    </Card>
  )
}
