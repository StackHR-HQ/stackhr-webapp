import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardHeader } from '../../../../components/ui/card'
import { CheckboxField } from '../../../../components/ui/checkbox-field'
import { SelectField } from '../../../../components/ui/select-field'
import { COMPLIANCE_COUNTRIES, REGISTERED_ENTITY_TYPES } from '../../constants/settings-options'
import { useUpdatePayrollSettings } from '../../hooks/use-update-payroll-settings'
import { complianceProfileSchema, type ComplianceProfileFormValues } from '../../schemas/payroll-schemas'
import type { ComplianceProfile } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

export function ComplianceProfileView({ complianceProfile }: { complianceProfile: ComplianceProfile }) {
  const updatePayrollSettings = useUpdatePayrollSettings()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ComplianceProfileFormValues>({
    resolver: zodResolver(complianceProfileSchema),
    values: complianceProfile,
  })

  const onSubmit = handleSubmit((values) => {
    updatePayrollSettings.mutate({ complianceProfile: values })
  })

  return (
    <Card>
      <CardHeader
        title="Compliance Profile"
        description="High-level settings that determine which statutory rules and exemptions apply to your organization."
      />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            id="country"
            label="Country"
            placeholder="Select country"
            options={COMPLIANCE_COUNTRIES.map((country) => ({ value: country, label: country }))}
            error={errors.country?.message}
            {...register('country')}
          />
          <SelectField
            id="registeredEntityType"
            label="Registered entity type"
            placeholder="Select entity type"
            options={REGISTERED_ENTITY_TYPES.map((type) => ({ value: type, label: type }))}
            error={errors.registeredEntityType?.message}
            {...register('registeredEntityType')}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-line p-4">
          <CheckboxField label="Apply minimum wage exemption threshold to PAYE" {...register('applyMinimumWageExemption')} />
          <CheckboxField
            label="Automatically apply the latest tax rule set to new payroll periods"
            {...register('autoApplyLatestTaxRules')}
          />
        </div>

        <SettingsFormFooter isPending={updatePayrollSettings.isPending} isSuccess={updatePayrollSettings.isSuccess} />
      </form>
    </Card>
  )
}
