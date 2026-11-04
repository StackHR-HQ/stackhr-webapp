import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '../../../../components/ui/button'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { TextField } from '../../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { useEmployeeCompensation, useSetCompensation } from '../../hooks/use-employee-compensation'
import { formatAmount } from '../../lib/format'
import {
  compensationSchema,
  type CompensationFormInput,
  type CompensationFormValues,
} from '../../schemas/compensation-schema'
import type { CompensationBreakdown } from '../../types/payroll-types'

const FIELDS = [
  { name: 'basicSalary', label: 'Basic salary' },
  { name: 'housingAllowance', label: 'Housing allowance' },
  { name: 'transportAllowance', label: 'Transport allowance' },
  { name: 'otherAllowances', label: 'Other allowances' },
] as const

// Loads the employee's current split first so the form opens filled in.
export function SetSalaryForm({
  employeeId,
  currency,
  paymentFrequency,
  onDone,
}: {
  employeeId: string
  currency: string
  paymentFrequency: string
  onDone: () => void
}) {
  const { data: current, isPending } = useEmployeeCompensation(employeeId)

  if (isPending) return <div className="h-72 animate-pulse rounded-lg bg-canvas" />

  return (
    <SalaryFields
      employeeId={employeeId}
      current={current ?? null}
      currency={current?.currency ?? currency}
      paymentFrequency={current?.paymentFrequency ?? paymentFrequency}
      onDone={onDone}
    />
  )
}

function SalaryFields({
  employeeId,
  current,
  currency,
  paymentFrequency,
  onDone,
}: {
  employeeId: string
  current: CompensationBreakdown | null
  currency: string
  paymentFrequency: string
  onDone: () => void
}) {
  const setCompensation = useSetCompensation()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CompensationFormInput, unknown, CompensationFormValues>({
    resolver: zodResolver(compensationSchema),
    defaultValues: {
      basicSalary: current ? String(current.basicSalary) : '',
      housingAllowance: current ? String(current.housingAllowance) : '',
      transportAllowance: current ? String(current.transportAllowance) : '',
      otherAllowances: current ? String(current.otherAllowances) : '',
    },
  })

  const amounts = useWatch({ control, name: FIELDS.map((field) => field.name) })
  const monthlyGross = amounts.reduce<number>((sum, value) => sum + (Number(value) > 0 ? Number(value) : 0), 0)

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    if (current && !isDirty) {
      onDone()
      return
    }
    try {
      await setCompensation.mutateAsync({ employeeId, ...values, currency, paymentFrequency })
      notify.success('Salary updated')
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm text-muted">
        Monthly amounts. The new salary takes effect today, and past payroll runs aren't changed.
      </p>

      {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <TextField
            key={field.name}
            id={field.name}
            label={`${field.label} (${currency})`}
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="0"
            error={errors[field.name]?.message}
            {...register(field.name)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm">
        <span className="text-muted">Monthly gross</span>
        <span className="text-right">
          <span className="font-medium text-ink">{formatAmount(monthlyGross, currency)}</span>
          <span className="ml-2 text-muted">{formatAmount(monthlyGross * 12, currency)} a year</span>
        </span>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onDone} width="fit" className="px-6">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} width="fit" className="px-6">
          Save salary
        </Button>
      </div>
    </form>
  )
}
