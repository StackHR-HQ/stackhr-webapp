import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { SelectField } from '../../../components/ui/select-field'
import { TextField } from '../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../lib/http'
import { formatAmount } from '../../dashboard/lib/format'
import { useSubmitSalaryAdvance } from '../hooks/use-my-spend'
import {
  REPAYMENT_MONTH_OPTIONS,
  salaryAdvanceSchema,
  type SalaryAdvanceFormInput,
  type SalaryAdvanceFormValues,
} from '../schemas/spend-request-schemas'

export function SalaryAdvanceForm({
  currency,
  onDone,
  onCancel,
}: {
  currency: string
  onDone: () => void
  onCancel: () => void
}) {
  const submitAdvance = useSubmitSalaryAdvance()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SalaryAdvanceFormInput, unknown, SalaryAdvanceFormValues>({
    resolver: zodResolver(salaryAdvanceSchema),
    defaultValues: { amount: '', repaymentMonths: '2', reason: '' },
  })

  const [amount, repaymentMonths] = useWatch({ control, name: ['amount', 'repaymentMonths'] })
  const monthlyDeduction = Number(amount) > 0 ? Math.ceil(Number(amount) / Number(repaymentMonths)) : null

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await submitAdvance.mutateAsync(values)
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-sm text-muted">
        If approved, the advance is repaid through equal deductions from your upcoming salaries.
      </p>

      <div className="mt-4">
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="amount"
          label={`Amount (${currency})`}
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="100000"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <SelectField
          id="repaymentMonths"
          label="Repay over"
          options={REPAYMENT_MONTH_OPTIONS.map((months) => ({
            value: String(months),
            label: `${months} month${months === 1 ? '' : 's'}`,
          }))}
          error={errors.repaymentMonths?.message}
          {...register('repaymentMonths')}
        />
        <div className="sm:col-span-2">
          <TextField
            id="reason"
            label="Reason (optional)"
            placeholder="Medical emergency"
            error={errors.reason?.message}
            {...register('reason')}
          />
        </div>
      </div>

      {monthlyDeduction ? (
        <p className="mt-4 rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-muted">
          About <span className="font-medium text-ink">{formatAmount(monthlyDeduction, currency)}</span> will be
          deducted each month.
        </p>
      ) : null}

      <div className="mt-5 flex gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} width="fit" className="px-6">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} width="fit" className="px-6">
          Submit request
        </Button>
      </div>
    </form>
  )
}
