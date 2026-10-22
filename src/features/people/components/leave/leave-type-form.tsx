import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../../components/ui/button'
import { CheckboxField } from '../../../../components/ui/checkbox-field'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { TextField } from '../../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../../lib/http'
import { useCreateLeaveType } from '../../hooks/use-create-leave-type'
import { useUpdateLeaveType } from '../../hooks/use-update-leave-type'
import { leaveTypeSchema, type LeaveTypeFormInput, type LeaveTypeFormValues } from '../../schemas/leave-type-schema'
import type { LeaveType } from '../../types/people-types'

export function LeaveTypeForm({ leaveType, onDone, onCancel }: { leaveType?: LeaveType; onDone: () => void; onCancel: () => void }) {
  const createLeaveType = useCreateLeaveType()
  const updateLeaveType = useUpdateLeaveType()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LeaveTypeFormInput, unknown, LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeSchema),
    defaultValues: leaveType
      ? {
          name: leaveType.name,
          description: leaveType.description ?? '',
          daysPerYear: leaveType.defaultDays,
          paid: leaveType.paid,
          requiresApproval: leaveType.requiresApproval ?? true,
        }
      : { name: '', description: '', daysPerYear: '', paid: true, requiresApproval: true },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      if (leaveType) await updateLeaveType.mutateAsync({ id: leaveType.id, values })
      else await createLeaveType.mutateAsync(values)
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-sm text-muted">
        {leaveType
          ? 'Update the name, yearly allowance or rules for this leave type.'
          : 'Active employees get this allowance as their starting balance.'}
      </p>

      <div className="mt-4">
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="name" label="Name" placeholder="Annual Leave" error={errors.name?.message} {...register('name')} />
        <TextField
          id="daysPerYear"
          label="Days per year"
          type="number"
          min="1"
          step="1"
          placeholder="20"
          error={errors.daysPerYear?.message}
          {...register('daysPerYear')}
        />
        <div className="sm:col-span-2">
          <TextField
            id="description"
            label="Description (optional)"
            placeholder="Standard annual paid time off"
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <CheckboxField label="Paid leave" {...register('paid')} />
        <CheckboxField label="Requests need approval" {...register('requiresApproval')} />
      </div>

      <div className="mt-5 flex gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} width="fit" className="px-6">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} width="fit" className="px-6">
          {leaveType ? 'Save changes' : 'Add leave type'}
        </Button>
      </div>
    </form>
  )
}
