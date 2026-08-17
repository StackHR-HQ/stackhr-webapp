import { Card, CardHeader } from '../../../../components/ui/card'
import type { DeductionType } from '../../types/payroll-types'

function DeductionCard({ deduction }: { deduction: DeductionType }) {
  return (
    <div className="rounded-lg border border-line bg-canvas p-3">
      <p className="text-sm font-medium text-ink">{deduction.name}</p>
      <p className="mt-0.5 text-xs text-muted">{deduction.rateDescription}</p>
      <p className="mt-2 text-xs text-muted">{deduction.description}</p>
    </div>
  )
}

export function DeductionsView({ deductions }: { deductions: DeductionType[] }) {
  const statutory = deductions.filter((deduction) => deduction.category === 'statutory')
  const other = deductions.filter((deduction) => deduction.category === 'other')

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Statutory deductions" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {statutory.map((deduction) => (
            <DeductionCard key={deduction.id} deduction={deduction} />
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Other deductions" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {other.map((deduction) => (
            <DeductionCard key={deduction.id} deduction={deduction} />
          ))}
        </div>
      </Card>
    </div>
  )
}
