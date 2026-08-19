import { CheckCircleIcon, ListChecksIcon, ScalesIcon, WarningCircleIcon, type Icon } from '@phosphor-icons/react'
import type { ComplianceWarning, StatutoryContributionRule, TaxRuleSet } from '../../../payroll/types/payroll-types'

function StatTile({ icon: TileIcon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="rounded-panel border border-line bg-surface p-4 shadow-panel">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
        <TileIcon className="h-4.5 w-4.5 text-ink" />
      </div>
      <div className="mt-3">
        <p className="text-xl font-medium text-ink">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  )
}

export function ComplianceStatTiles({
  taxRuleSet,
  statutoryContributions,
  warnings,
}: {
  taxRuleSet: TaxRuleSet
  statutoryContributions: StatutoryContributionRule[]
  warnings: ComplianceWarning[]
}) {
  const criticalCount = warnings.filter((warning) => warning.severity === 'critical').length
  const outstandingCount = warnings.filter((warning) => warning.severity !== 'info').length
  const activeContributions = statutoryContributions.filter((rule) => rule.applicability !== 'not_applicable').length

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatTile
        icon={criticalCount > 0 ? WarningCircleIcon : CheckCircleIcon}
        label="Compliance status"
        value={outstandingCount === 0 ? 'All clear' : `${outstandingCount} to review`}
      />
      <StatTile icon={ScalesIcon} label="Active tax rule" value={taxRuleSet.id} />
      <StatTile
        icon={CheckCircleIcon}
        label="Statutory contributions"
        value={`${activeContributions} of ${statutoryContributions.length} active`}
      />
      <StatTile icon={ListChecksIcon} label="Outstanding actions" value={outstandingCount.toString()} />
    </div>
  )
}
