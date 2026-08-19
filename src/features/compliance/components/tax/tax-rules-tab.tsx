import { Badge } from '../../../../components/ui/badge'
import { formatDate } from '../../lib/format'
import type { TaxRuleSet, TaxRuleSetId } from '../../../payroll/types/payroll-types'

export function TaxRulesTab({ ruleSets, activeRuleSetId }: { ruleSets: TaxRuleSet[]; activeRuleSetId: TaxRuleSetId }) {
  return (
    <ul className="space-y-3">
      {ruleSets.map((ruleSet) => {
        const isActive = ruleSet.id === activeRuleSetId
        return (
          <li key={ruleSet.id} className="rounded-panel border border-line bg-surface p-4 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">{ruleSet.label}</p>
                <span className="text-xs text-muted">{ruleSet.version}</span>
              </div>
              <Badge tone={isActive ? 'positive' : 'neutral'}>{isActive ? 'Active' : 'Legacy'}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">{ruleSet.description}</p>
            <p className="mt-2 text-xs text-muted">Effective from {formatDate(ruleSet.effectiveFrom)}</p>
          </li>
        )
      })}
    </ul>
  )
}
