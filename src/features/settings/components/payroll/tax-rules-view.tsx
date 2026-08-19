import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { TAX_RULE_SETS } from '../../../payroll/lib/tax-rules'
import type { TaxRuleSetId } from '../../../payroll/types/payroll-types'
import { useUpdatePayrollSettings } from '../../hooks/use-update-payroll-settings'

export function TaxRulesView({ activeTaxRuleSetId }: { activeTaxRuleSetId: TaxRuleSetId }) {
  const updatePayrollSettings = useUpdatePayrollSettings()

  return (
    <Card>
      <CardHeader
        title="Tax Rules"
        description="Tax rule sets are versioned and kept separate from the payroll engine, so historical runs never silently change when rules are updated."
      />
      <div className="space-y-3">
        {Object.values(TAX_RULE_SETS).map((ruleSet) => {
          const isActive = ruleSet.id === activeTaxRuleSetId
          return (
            <button
              key={ruleSet.id}
              type="button"
              onClick={() => updatePayrollSettings.mutate({ activeTaxRuleSetId: ruleSet.id })}
              disabled={updatePayrollSettings.isPending}
              className={`w-full rounded-lg border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive ? 'border-accent bg-accent/5' : 'border-line hover:bg-canvas'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{ruleSet.label}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {ruleSet.version} · Effective from {ruleSet.effectiveFrom}
                  </p>
                </div>
                {isActive ? <Badge tone="accent">Active</Badge> : <Badge tone="neutral">Select</Badge>}
              </div>
              <p className="mt-2 text-xs text-muted">{ruleSet.description}</p>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
