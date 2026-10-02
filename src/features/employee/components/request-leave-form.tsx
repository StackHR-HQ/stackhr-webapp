import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/button'
import { FormErrorBanner } from '../../../components/ui/form-error-banner'
import { SelectField } from '../../../components/ui/select-field'
import { TextField } from '../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../lib/http'
import { useSubmitLeaveRequest } from '../hooks/use-my-leave'
import { leaveRequestSchema, type LeaveRequestFormValues } from '../schemas/leave-request-schema'
import type { LeaveTypeOption } from '../types/employee-types'

export function RequestLeaveForm({
  leaveTypes,
  onDone,
  onCancel,
}: {
  leaveTypes: LeaveTypeOption[]
  onDone: () => void
  onCancel: () => void
}) {
  const submitLeaveRequest = useSubmitLeaveRequest()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: { leaveTypeId: '', startDate: '', endDate: '', reason: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await submitLeaveRequest.mutateAsync(values)
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-sm text-muted">Your request goes to your approver for review.</p>

      <div className="mt-4">
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <SelectField
            id="leaveTypeId"
            label="Leave type"
            placeholder="Choose a leave type"
            options={leaveTypes.map((leaveType) => ({ value: leaveType.id, label: leaveType.name }))}
            error={errors.leaveTypeId?.message}
            {...register('leaveTypeId')}
          />
        </div>
        <TextField id="startDate" label="Start date" type="date" error={errors.startDate?.message} {...register('startDate')} />
        <TextField id="endDate" label="End date" type="date" error={errors.endDate?.message} {...register('endDate')} />
        <div className="sm:col-span-2">
          <TextField
            id="reason"
            label="Reason (optional)"
            placeholder="Family vacation"
            error={errors.reason?.message}
            {...register('reason')}
          />
        </div>
      </div>

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
