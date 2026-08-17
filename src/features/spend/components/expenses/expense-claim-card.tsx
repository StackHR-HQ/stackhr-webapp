import { FileTextIcon } from '@phosphor-icons/react'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import type { ExpenseClaim } from '../../types/spend-types'
import { FieldGrid } from '../field-grid'

export function ExpenseClaimCard({ expense }: { expense: ExpenseClaim }) {
  return (
    <Card>
      <CardHeader title="Claim details" />
      <FieldGrid
        fields={[
          { label: 'Employee', value: expense.employeeName },
          { label: 'Category', value: expense.category },
          { label: 'Payment method', value: expense.paymentMethod },
          { label: 'Submitted', value: formatDate(expense.submittedAt) },
        ]}
      />

      {expense.receiptFileName ? (
        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-line bg-canvas px-3 py-2.5">
          <FileTextIcon className="h-4 w-4 shrink-0 text-muted" />
          <span className="truncate text-sm text-ink">{expense.receiptFileName}</span>
        </div>
      ) : null}
    </Card>
  )
}
