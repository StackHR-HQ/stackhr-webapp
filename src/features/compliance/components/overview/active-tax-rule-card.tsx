import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import type { TaxRuleSet } from '../../../payroll/types/payroll-types'

export function ActiveTaxRuleCard({ taxRuleSet }: { taxRuleSet: TaxRuleSet }) {
  return (
    <Card>
      <CardHeader
        title="Active tax rule"
        description="Applied to the current and upcoming payroll runs"
        action={
          <Link to="/compliance/tax" className="text-xs font-medium text-accent hover:underline">
            View tax rules →
          </Link>
        }
      />
      <div className="rounded-lg border border-line bg-canvas p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-ink">{taxRuleSet.label}</p>
          <Badge tone="accent">{taxRuleSet.version}</Badge>
        </div>
        <p className="mt-1.5 text-sm text-muted">{taxRuleSet.description}</p>
        <p className="mt-2 text-xs text-muted">Effective from {formatDate(taxRuleSet.effectiveFrom)}</p>
      </div>
    </Card>
  )
}
