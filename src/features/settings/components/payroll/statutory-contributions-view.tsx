import { Badge, type BadgeTone } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import type { StatutoryApplicability } from '../../../payroll/types/payroll-types'
import { useStatutoryContributionRules } from '../../hooks/use-statutory-contribution-rules'

const APPLICABILITY_TONE: Record<StatutoryApplicability, BadgeTone> = {
  mandatory: 'critical',
  voluntary: 'warning',
  not_applicable: 'neutral',
}

const APPLICABILITY_LABEL: Record<StatutoryApplicability, string> = {
  mandatory: 'Mandatory',
  voluntary: 'Voluntary',
  not_applicable: 'Not applicable',
}

const BASE_LABEL: Record<'gross' | 'basic' | 'bht', string> = {
  gross: 'Gross pay',
  basic: 'Basic salary',
  bht: 'Basic + Housing + Transport',
}

export function StatutoryContributionsView() {
  const { data: rules, isPending } = useStatutoryContributionRules()

  return (
    <Card>
      <CardHeader
        title="Statutory Contributions"
        description="Determined by your headcount, per Nigerian statutory law. Adjust which ones apply under Contribution Preferences."
      />
      {isPending || !rules ? (
        <div className="h-40 animate-pulse rounded-lg bg-canvas" />
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="rounded-lg border border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{rule.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{rule.legalReference}</p>
                </div>
                <Badge tone={APPLICABILITY_TONE[rule.applicability]}>{APPLICABILITY_LABEL[rule.applicability]}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-muted">Employee rate</p>
                  <p className="mt-0.5 font-medium text-ink">{rule.employeeRatePercent}%</p>
                </div>
                <div>
                  <p className="text-muted">Employer rate</p>
                  <p className="mt-0.5 font-medium text-ink">{rule.employerRatePercent}%</p>
                </div>
                <div>
                  <p className="text-muted">Calculation base</p>
                  <p className="mt-0.5 font-medium text-ink">{BASE_LABEL[rule.base]}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">{rule.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
