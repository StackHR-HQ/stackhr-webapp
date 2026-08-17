import { WarningCircleIcon } from '@phosphor-icons/react'
import type { BadgeTone } from '../../../components/ui/badge'
import { Badge } from '../../../components/ui/badge'
import type { ComplianceWarning } from '../types/payroll-types'

const SEVERITY_META: Record<ComplianceWarning['severity'], { label: string; tone: BadgeTone }> = {
  critical: { label: 'Critical', tone: 'critical' },
  warning: { label: 'Attention', tone: 'warning' },
  info: { label: 'Info', tone: 'accent' },
}

export function ComplianceWarningsList({ warnings }: { warnings: ComplianceWarning[] }) {
  if (warnings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <WarningCircleIcon className="h-5 w-5 text-muted" />
        <p className="text-sm text-muted">No compliance warnings for this run.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {warnings.map((warning) => {
        const meta = SEVERITY_META[warning.severity]
        return (
          <li key={warning.id} className="rounded-lg border border-line bg-canvas p-3">
            <div className="flex items-start justify-between gap-2">
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </div>
            <p className="mt-1.5 text-sm text-ink">{warning.message}</p>
          </li>
        )
      })}
    </ul>
  )
}
