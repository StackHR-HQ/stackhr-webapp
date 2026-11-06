import { PencilSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Button } from '../../../../components/ui/button'
import { Card, CardHeader } from '../../../../components/ui/card'
import { Modal } from '../../../../components/ui/modal'
import { toApiEnum } from '../../../../lib/api-enum'
import { maskedAccountNumber } from '../../../../lib/bank-account'
import { SetSalaryForm } from '../../../payroll/components/salaries/set-salary-form'
import { annualSalary, formatAmount } from '../../lib/format'
import type { EmployeeDetail } from '../../types/people-types'
import { FieldGrid } from './field-grid'

export function CompensationTab({ employee }: { employee: EmployeeDetail }) {
  const { compensation } = employee
  const annual = annualSalary(compensation)
  const monthly = Math.round(annual / 12)
  const [editing, setEditing] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader
          title="Salary"
          action={
            <Button variant="secondary" width="fit" className="gap-1.5 px-3 py-1.5" onClick={() => setEditing(true)}>
              <PencilSimpleIcon className="h-3.5 w-3.5" />
              Edit
            </Button>
          }
        />
        <FieldGrid
          fields={[
            { label: 'Annual salary', value: formatAmount(annual, compensation.currency) },
            { label: 'Monthly gross', value: formatAmount(monthly, compensation.currency) },
            { label: 'Pay frequency', value: compensation.payFrequency },
            { label: 'Currency', value: compensation.currency },
          ]}
        />
      </Card>

      <Modal open={editing} onClose={() => setEditing(false)} title={`Edit salary · ${employee.fullName}`}>
        <SetSalaryForm
          employeeId={employee.id}
          currency={compensation.currency || 'NGN'}
          paymentFrequency={compensation.payFrequency ? toApiEnum(compensation.payFrequency) : 'MONTHLY'}
          onDone={() => setEditing(false)}
        />
      </Modal>

      <Card>
        <CardHeader title="Payment details" />
        <FieldGrid
          fields={[
            { label: 'Bank', value: compensation.bankName ?? '—' },
            { label: 'Account number', value: maskedAccountNumber(compensation.bankAccountLast4) ?? '—' },
          ]}
        />
      </Card>
    </div>
  )
}
