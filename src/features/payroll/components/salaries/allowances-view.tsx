import { Card } from '../../../../components/ui/card'
import type { EarningComponent } from '../../types/payroll-types'

export function AllowancesView({ components }: { components: EarningComponent[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {components.map((component) => (
        <Card key={component.id}>
          <p className="text-sm font-medium text-ink">{component.name}</p>
          <p className="mt-2 text-xl font-medium text-ink">
            {component.percentOfGross}
            <span className="text-sm font-normal text-muted">% of gross</span>
          </p>
          <p className="mt-2 text-xs text-muted">{component.description}</p>
        </Card>
      ))}
    </div>
  )
}
