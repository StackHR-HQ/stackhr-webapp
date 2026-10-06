import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../../components/ui/button'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { useUpdateEmployee } from '../../hooks/use-update-employee'
import { editEmploymentSchema, type EditEmploymentFormValues } from '../../schemas/edit-employment-schema'
import type { EmployeeDetail, EmployeeSummary, UpdateEmployeePayload } from '../../types/people-types'

export function EditEmploymentForm({
  employee,
  employees,
  onDone,
}: {
  employee: EmployeeDetail
  employees: EmployeeSummary[]
  onDone: () => void
}) {
  const updateEmployee = useUpdateEmployee()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<EditEmploymentFormValues>({
    resolver: zodResolver(editEmploymentSchema),
    defaultValues: {
      jobTitle: employee.jobTitle ?? '',
      managerId: employee.managerId ?? '',
      workLocation: employee.workLocation ?? '',
    },
  })

  const managerOptions = [
    { value: '', label: 'No manager' },
    ...employees
      .filter((candidate) => candidate.id !== employee.id)
      .map((candidate) => ({ value: candidate.id, label: `${candidate.fullName} · ${candidate.jobTitle}` })),
  ]

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    // Only send what changed; clearing the manager or location sends null.
    const update: UpdateEmployeePayload = {
      ...(dirtyFields.jobTitle ? { jobTitle: values.jobTitle.trim() } : {}),
      ...(dirtyFields.managerId ? { managerId: values.managerId || null } : {}),
      ...(dirtyFields.workLocation ? { workLocation: values.workLocation.trim() || null } : {}),
    }
    if (Object.keys(update).length === 0) {
      onDone()
      return
    }
    try {
      await updateEmployee.mutateAsync({ id: employee.id, ...update })
      notify.success('Employment details updated')
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}

      <TextField id="jobTitle" label="Job title" error={errors.jobTitle?.message} {...register('jobTitle')} />
      <SelectField id="managerId" label="Manager" options={managerOptions} {...register('managerId')} />
      <TextField
        id="workLocation"
        label="Work location"
        placeholder="Lagos, Nigeria"
        error={errors.workLocation?.message}
        {...register('workLocation')}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onDone} width="fit" className="px-6">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} width="fit" className="px-6">
          Save changes
        </Button>
      </div>
    </form>
  )
}
