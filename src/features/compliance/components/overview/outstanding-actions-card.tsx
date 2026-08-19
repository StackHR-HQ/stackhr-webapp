import { CheckCircleIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import type { ComplianceWarning } from '../../../payroll/types/payroll-types'

const SEVERITY_META: Record<'critical' | 'warning', { label: string; tone: 'critical' | 'warning' }> = {
  critical: { label: 'Critical', tone: 'critical' },
  warning: { label: 'Attention', tone: 'warning' },
}

export function OutstandingActionsCard({ warnings, resolvePath }: { warnings: ComplianceWarning[]; resolvePath: string }) {
  const actions = warnings.filter(
    (warning): warning is ComplianceWarning & { severity: 'critical' | 'warning' } => warning.severity !== 'info',
  )

  return (
    <Card>
      <CardHeader title="Outstanding actions" description="Needs a decision or a fix before the next payroll run" />

      {actions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <CheckCircleIcon className="h-5 w-5 text-positive" />
          <p className="text-sm text-muted">Nothing outstanding right now.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {actions.map((action) => {
            const meta = SEVERITY_META[action.severity]
            return (
              <li key={action.id} className="rounded-lg border border-line bg-canvas p-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
                <p className="mt-1.5 text-sm text-ink">{action.message}</p>
                <Link to={resolvePath} className="mt-2 inline-block text-xs font-medium text-accent hover:underline">
                  Resolve in Payroll →
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
