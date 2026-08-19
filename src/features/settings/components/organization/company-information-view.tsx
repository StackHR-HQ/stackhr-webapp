import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { COMPANY_SIZES, CURRENCIES, INDUSTRIES, PAYROLL_FREQUENCIES } from '../../../onboarding/constants/onboarding-options'
import { useUpdateOrganizationSettings } from '../../hooks/use-update-organization-settings'
import { companyInformationSchema, type CompanyInformationFormValues } from '../../schemas/organization-schemas'
import type { CompanyInformation } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

export function CompanyInformationView({ companyInformation }: { companyInformation: CompanyInformation }) {
  const updateOrganizationSettings = useUpdateOrganizationSettings()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyInformationFormValues>({
    resolver: zodResolver(companyInformationSchema),
    values: companyInformation,
  })

  const onSubmit = handleSubmit((values) => {
    updateOrganizationSettings.mutate({ companyInformation: values })
  })

  return (
    <Card>
      <CardHeader
        title="Company Information"
        description="The core details that identify your organization across StackHR."
      />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <TextField id="name" label="Company name" placeholder="Acme Inc." error={errors.name?.message} {...register('name')} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            id="industry"
            label="Industry"
            placeholder="Select industry"
            options={INDUSTRIES.map((industry) => ({ value: industry, label: industry }))}
            error={errors.industry?.message}
            {...register('industry')}
          />
          <SelectField
            id="companySize"
            label="Company size"
            placeholder="Select size"
            options={COMPANY_SIZES.map((size) => ({ value: size, label: `${size} employees` }))}
            error={errors.companySize?.message}
            {...register('companySize')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            id="currency"
            label="Currency"
            options={CURRENCIES.map((currency) => ({ value: currency.code, label: `${currency.code} — ${currency.label}` }))}
            error={errors.currency?.message}
            {...register('currency')}
          />
          <SelectField
            id="payrollFrequency"
            label="Payroll frequency"
            options={PAYROLL_FREQUENCIES.map((frequency) => ({ value: frequency, label: frequency }))}
            error={errors.payrollFrequency?.message}
            {...register('payrollFrequency')}
          />
        </div>

        <SettingsFormFooter isPending={updateOrganizationSettings.isPending} isSuccess={updateOrganizationSettings.isSuccess} />
      </form>
    </Card>
  )
}
