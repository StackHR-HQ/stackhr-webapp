import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import type { TaxRuleSet } from '../../../payroll/types/payroll-types'

export function TaxConfigurationTab({ taxRuleSet }: { taxRuleSet: TaxRuleSet }) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Jurisdiction" description="Tax rules currently applied to payroll" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-canvas p-3">
            <p className="text-xs text-muted">Country</p>
            <p className="mt-1 text-sm font-medium text-ink">Nigeria</p>
          </div>
          <div className="rounded-lg border border-line bg-canvas p-3">
            <p className="text-xs text-muted">Active tax rule set</p>
            <p className="mt-1 text-sm font-medium text-ink">
              {taxRuleSet.label} <span className="text-muted">({taxRuleSet.version})</span>
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title={taxRuleSet.label}
          description={`Effective from ${formatDate(taxRuleSet.effectiveFrom)}`}
          action={<Badge tone="accent">Active</Badge>}
        />
        <p className="text-sm text-muted">{taxRuleSet.description}</p>
        <Link
          to="/settings/payroll"
          className="mt-4 inline-block text-xs font-medium text-accent hover:underline"
        >
          Configure tax settings →
        </Link>
      </Card>
    </div>
  )
}
