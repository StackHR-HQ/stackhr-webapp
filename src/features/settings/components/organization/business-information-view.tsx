import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { BUSINESS_TYPES } from '../../constants/settings-options'
import { useUpdateOrganizationSettings } from '../../hooks/use-update-organization-settings'
import { businessInformationSchema, type BusinessInformationFormValues } from '../../schemas/organization-schemas'
import type { BusinessInformation } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

export function BusinessInformationView({ businessInformation }: { businessInformation: BusinessInformation }) {
  const updateOrganizationSettings = useUpdateOrganizationSettings()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessInformationFormValues>({
    resolver: zodResolver(businessInformationSchema),
    values: businessInformation,
  })

  const onSubmit = handleSubmit((values) => {
    updateOrganizationSettings.mutate({ businessInformation: values })
  })

  return (
    <Card>
      <CardHeader title="Business Information" description="Tax ID is currently the only business detail saved by the Organization API." />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id="registrationNumber"
            label="Registration number"
            placeholder="RC 1234567"
            disabled
            hint="Not yet supported by the API"
            error={errors.registrationNumber?.message}
            {...register('registrationNumber')}
          />
          <TextField
            id="taxId"
            label="Tax ID"
            placeholder="TIN 12345678-0001"
            error={errors.taxId?.message}
            {...register('taxId')}
          />
        </div>

        <SelectField
          id="businessType"
          label="Business type"
            placeholder="Select business type"
            disabled
          options={BUSINESS_TYPES.map((type) => ({ value: type, label: type }))}
          error={errors.businessType?.message}
          {...register('businessType')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id="website"
            label={<span>Website <span className="font-normal text-muted">(optional)</span></span>}
            placeholder="https://acme.example"
            disabled
            hint="Not yet supported by the API"
            error={errors.website?.message}
            {...register('website')}
          />
          <TextField
            id="foundedYear"
            label={<span>Founded year <span className="font-normal text-muted">(optional)</span></span>}
            placeholder="2019"
            disabled
            hint="Not yet supported by the API"
            error={errors.foundedYear?.message}
            {...register('foundedYear')}
          />
        </div>

        <SettingsFormFooter isPending={updateOrganizationSettings.isPending} isSuccess={updateOrganizationSettings.isSuccess} />
      </form>
    </Card>
  )
}
