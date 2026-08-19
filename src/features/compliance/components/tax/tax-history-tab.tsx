import { Badge } from '../../../../components/ui/badge'
import { PAYROLL_RUN_STATUS_META } from '../../../payroll/lib/status-meta'
import { formatDate } from '../../lib/format'
import type { PayrollRunListItem, TaxRuleSet } from '../../../payroll/types/payroll-types'

export function TaxHistoryTab({ runs, ruleSets }: { runs: PayrollRunListItem[]; ruleSets: TaxRuleSet[] }) {
  const ruleSetById = new Map(ruleSets.map((ruleSet) => [ruleSet.id, ruleSet]))

  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Period</th>
            <th className="px-4 py-3 font-medium">Pay date</th>
            <th className="px-4 py-3 font-medium">Tax rule set</th>
            <th className="px-4 py-3 font-medium">Payroll engine</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {runs.map((run) => {
            const ruleSet = ruleSetById.get(run.taxRuleSetId)
            const statusMeta = PAYROLL_RUN_STATUS_META[run.status]
            return (
              <tr key={run.id} className="bg-canvas">
                <td className="px-4 py-3 font-medium text-ink">{run.periodLabel}</td>
                <td className="px-4 py-3 text-muted">{formatDate(run.payDate)}</td>
                <td className="px-4 py-3 text-ink">{ruleSet ? `${ruleSet.label} (${ruleSet.version})` : run.taxRuleSetId}</td>
                <td className="px-4 py-3 text-muted">{run.payrollEngineVersion}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
