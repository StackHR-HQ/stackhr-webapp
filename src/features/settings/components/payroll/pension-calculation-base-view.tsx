import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { useUpdatePayrollSettings } from '../../hooks/use-update-payroll-settings'
import type { PensionCalculationBase } from '../../types/settings-types'

const OPTIONS: { value: PensionCalculationBase; label: string; description: string }[] = [
  {
    value: 'basic',
    label: 'Basic salary',
    description: 'Pension contributions are calculated on the basic salary component only.',
  },
  {
    value: 'bht',
    label: 'Basic + Housing + Transport',
    description: 'The statutory default — pension is calculated on the combined BHT base.',
  },
  {
    value: 'gross',
    label: 'Gross pay',
    description: 'Pension contributions are calculated on total gross pay, including all allowances.',
  },
]

export function PensionCalculationBaseView({ pensionCalculationBase }: { pensionCalculationBase: PensionCalculationBase }) {
  const updatePayrollSettings = useUpdatePayrollSettings()

  return (
    <Card>
      <CardHeader
        title="Pension Calculation Base"
        description="The salary base used to calculate statutory pension contributions for this organization."
      />
      <div className="space-y-3">
        {OPTIONS.map((option) => {
          const isActive = option.value === pensionCalculationBase
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updatePayrollSettings.mutate({ pensionCalculationBase: option.value })}
              disabled={updatePayrollSettings.isPending}
              className={`w-full rounded-lg border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive ? 'border-accent bg-accent/5' : 'border-line hover:bg-canvas'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-ink">{option.label}</p>
                {isActive ? <Badge tone="accent">Active</Badge> : <Badge tone="neutral">Select</Badge>}
              </div>
              <p className="mt-1 text-xs text-muted">{option.description}</p>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
