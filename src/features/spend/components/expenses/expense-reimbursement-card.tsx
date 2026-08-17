import { Link } from 'react-router'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import { REIMBURSEMENT_STATUS_META } from '../../lib/status-meta'
import type { ReimbursementInfo } from '../../types/spend-types'
import { FieldGrid } from '../field-grid'

export function ExpenseReimbursementCard({ reimbursement }: { reimbursement: ReimbursementInfo }) {
  const statusMeta = REIMBURSEMENT_STATUS_META[reimbursement.status]

  return (
    <Card>
      <CardHeader
        title="Reimbursement"
        action={
          <Link to="/spend/reimbursements" className="text-xs font-medium text-accent hover:underline">
            View all reimbursements →
          </Link>
        }
      />

      <div className="mb-4">
        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
      </div>

      <FieldGrid
        fields={[
          { label: 'Method', value: reimbursement.method },
          { label: 'Requested', value: formatDate(reimbursement.requestedAt) },
          ...(reimbursement.completedAt ? [{ label: 'Completed', value: formatDate(reimbursement.completedAt) }] : []),
        ]}
      />

      {reimbursement.status === 'failed' && reimbursement.failureReason ? (
        <p className="mt-4 rounded-lg border border-critical/30 bg-critical/5 px-3 py-2 text-xs text-critical">
          {reimbursement.failureReason}
        </p>
      ) : null}
    </Card>
  )
}
