import { useState, type FormEvent } from 'react'
import { Card, CardHeader } from '../../../../components/ui/card'
import { CheckboxField } from '../../../../components/ui/checkbox-field'
import { EARNING_COMPONENTS } from '../../../payroll/lib/earning-structure'
import { useUpdatePayrollSettings } from '../../hooks/use-update-payroll-settings'
import type { SalaryComponentClassification } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

export function SalaryComponentClassificationView({
  salaryComponentClassifications,
}: {
  salaryComponentClassifications: SalaryComponentClassification[]
}) {
  const updatePayrollSettings = useUpdatePayrollSettings()
  const [classifications, setClassifications] = useState(salaryComponentClassifications)

  function updateClassification(componentId: string, patch: Partial<SalaryComponentClassification>) {
    setClassifications((current) =>
      current.map((classification) => (classification.componentId === componentId ? { ...classification, ...patch } : classification)),
    )
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    updatePayrollSettings.mutate({ salaryComponentClassifications: classifications })
  }

  return (
    <Card>
      <CardHeader
        title="Salary Component Classification"
        description="Determine which salary components are taxable and which are included in the pensionable (BHT) base."
      />
      <form onSubmit={handleSubmit} className="space-y-3">
        {classifications.map((classification) => {
          const component = EARNING_COMPONENTS.find((c) => c.id === classification.componentId)
          return (
            <div
              key={classification.componentId}
              className="flex flex-col gap-3 rounded-lg border border-line p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink">{component?.name ?? classification.componentId}</p>
                <p className="mt-0.5 text-xs text-muted">{component?.description}</p>
              </div>
              <div className="flex shrink-0 gap-4">
                <CheckboxField
                  label="Taxable"
                  checked={classification.taxable}
                  onChange={(event) => updateClassification(classification.componentId, { taxable: event.target.checked })}
                />
                <CheckboxField
                  label="Pensionable"
                  checked={classification.pensionable}
                  onChange={(event) => updateClassification(classification.componentId, { pensionable: event.target.checked })}
                />
              </div>
            </div>
          )
        })}

        <SettingsFormFooter isPending={updatePayrollSettings.isPending} isSuccess={updatePayrollSettings.isSuccess} />
      </form>
    </Card>
  )
}
