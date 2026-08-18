import { Badge } from '../../../../components/ui/badge'
import { PERMISSION_LEVEL_META } from '../../lib/status-meta'
import type { ModulePermission } from '../../types/team-access-types'

export function PermissionsView({ matrix }: { matrix: ModulePermission[] }) {
  return (
    <div className="overflow-x-auto rounded-panel border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Module</th>
            <th className="px-4 py-3 font-medium">Admin</th>
            <th className="px-4 py-3 font-medium">Manager</th>
            <th className="px-4 py-3 font-medium">Employee</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {matrix.map((row) => (
            <tr key={row.module} className="bg-canvas">
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{row.label}</p>
                <p className="text-xs text-muted">{row.description}</p>
              </td>
              <td className="px-4 py-3">
                <Badge tone={PERMISSION_LEVEL_META[row.admin].tone}>{PERMISSION_LEVEL_META[row.admin].label}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone={PERMISSION_LEVEL_META[row.manager].tone}>{PERMISSION_LEVEL_META[row.manager].label}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone={PERMISSION_LEVEL_META[row.employee].tone}>
                  {PERMISSION_LEVEL_META[row.employee].label}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
