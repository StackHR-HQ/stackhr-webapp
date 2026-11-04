import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { TextField } from '../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../lib/http'
import { useSubmitReimbursement } from '../hooks/use-my-spend'
import {
  reimbursementSchema,
  type ReimbursementFormInput,
  type ReimbursementFormValues,
} from '../schemas/spend-request-schemas'

export function ReimbursementClaimForm({
  currency,
  onDone,
  onCancel,
}: {
  currency: string
  onDone: () => void
  onCancel: () => void
}) {
  const submitReimbursement = useSubmitReimbursement()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ReimbursementFormInput, unknown, ReimbursementFormValues>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: { amount: '', description: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await submitReimbursement.mutateAsync({ ...values, currency })
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm text-muted">
        Ask to be paid back for money you spent on work. Once it&apos;s approved, it&apos;s paid to your bank account.
      </p>

      {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

      <TextField
        id="amount"
        label={`Amount (${currency})`}
        type="number"
        inputMode="decimal"
        min={0}
        placeholder="15000"
        error={errors.amount?.message}
        {...register('amount')}
      />
      <TextField
        id="description"
        label="What was it for?"
        placeholder="Taxi fare for client meeting"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} width="fit" className="px-6">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} width="fit" className="px-6">
          Submit claim
        </Button>
      </div>
    </form>
  )
}
