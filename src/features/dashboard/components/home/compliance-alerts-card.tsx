import { WarningCircleIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import { COMPLIANCE_SEVERITY_META } from '../../lib/status-meta'
import type { ComplianceAlert } from '../../types/dashboard-types'

export function ComplianceAlertsCard({ alerts }: { alerts: ComplianceAlert[] }) {
  return (
    <Card>
      <CardHeader title="Compliance alerts" />

      {alerts.length > 0 ? (
        <ul className="space-y-3">
          {alerts.map((alert) => {
            const severityMeta = COMPLIANCE_SEVERITY_META[alert.severity]
            return (
              <li key={alert.id} className="rounded-lg border border-line bg-canvas p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{alert.title}</p>
                  <Badge tone={severityMeta.tone}>{severityMeta.label}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted">{alert.description}</p>
                {alert.dueDate ? (
                  <p className="mt-1.5 text-[11px] text-muted">Due {formatDate(alert.dueDate)}</p>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <WarningCircleIcon className="h-5 w-5 text-muted" />
          <p className="text-sm text-muted">No compliance issues right now.</p>
        </div>
      )}

      <Link to="/compliance" className="mt-4 inline-block text-xs font-medium text-accent hover:underline">
        View compliance →
      </Link>
    </Card>
  )
}
