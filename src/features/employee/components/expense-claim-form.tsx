import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { SelectField } from '../../../components/ui/select-field'
import { TextField } from '../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../lib/http'
import { useSubmitExpense } from '../hooks/use-my-spend'
import {
  EXPENSE_CATEGORIES,
  expenseSchema,
  type ExpenseFormInput,
  type ExpenseFormValues,
} from '../schemas/spend-request-schemas'

export function ExpenseClaimForm({
  currency,
  onDone,
  onCancel,
}: {
  currency: string
  onDone: () => void
  onCancel: () => void
}) {
  const submitExpense = useSubmitExpense()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormInput, unknown, ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { category: '', amount: '', description: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await submitExpense.mutateAsync({ ...values, currency })
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-sm text-muted">Your claim goes to your approver for review.</p>

      <div className="mt-4">
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="category"
          label="Category"
          placeholder="Choose a category"
          options={EXPENSE_CATEGORIES.map((category) => ({ value: category, label: category }))}
          error={errors.category?.message}
          {...register('category')}
        />
        <TextField
          id="amount"
          label={`Amount (${currency})`}
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          placeholder="25000"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <div className="sm:col-span-2">
          <TextField
            id="description"
            label="Description (optional)"
            placeholder="Client visit taxi fare"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
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
