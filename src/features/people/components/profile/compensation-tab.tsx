import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount } from '../../lib/format'
import type { EmployeeDetail } from '../../types/people-types'
import { FieldGrid } from './field-grid'

export function CompensationTab({ employee }: { employee: EmployeeDetail }) {
  const { compensation } = employee
  const monthly = Math.round(compensation.salary / 12)

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Salary" />
        <FieldGrid
          fields={[
            { label: 'Annual salary', value: formatAmount(compensation.salary, compensation.currency) },
            { label: 'Monthly gross', value: formatAmount(monthly, compensation.currency) },
            { label: 'Pay frequency', value: compensation.payFrequency },
            { label: 'Currency', value: compensation.currency },
          ]}
        />
      </Card>

      <Card>
        <CardHeader title="Payment details" />
        <FieldGrid
          fields={[
            { label: 'Bank', value: compensation.bankName },
            { label: 'Account number', value: `•••• •••• ${compensation.bankAccountLast4}` },
          ]}
        />
      </Card>
    </div>
  )
}
