import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../../components/ui/button'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { toApiEnum } from '../../../../lib/api-enum'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { EMPLOYMENT_TYPES } from '../../../onboarding/constants/onboarding-options'
import { useDepartments } from '../../hooks/use-departments'
import { useUpdateEmployee } from '../../hooks/use-update-employee'
import { EMPLOYMENT_STATUS_META } from '../../lib/status-meta'
import { editEmploymentSchema, type EditEmploymentFormValues } from '../../schemas/edit-employment-schema'
import type { EmployeeDetail, EmployeeSummary, EmploymentStatus, UpdateEmployeePayload } from '../../types/people-types'

// Pending invitation is set by the invite flow, so it's only listed while it's
// the employee's current status.
const EDITABLE_STATUSES: EmploymentStatus[] = ['onboarding', 'active', 'offboarding']

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
  const { data: departments = [] } = useDepartments()

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
      departmentId: employee.departmentId ?? '',
      managerId: employee.managerId ?? '',
      employmentType: employee.employmentType,
      startDate: employee.startDate?.slice(0, 10) ?? '',
      status: employee.employmentStatus,
      workLocation: employee.workLocation ?? '',
    },
  })

  const managerOptions = [
    { value: '', label: 'No manager' },
    ...employees
      .filter((candidate) => candidate.id !== employee.id)
      .map((candidate) => ({ value: candidate.id, label: `${candidate.fullName} · ${candidate.jobTitle}` })),
  ]

  const departmentOptions = [
    { value: '', label: 'No department' },
    ...departments.map((department) => ({ value: department.id, label: department.name })),
  ]

  const statusOptions = EDITABLE_STATUSES.includes(employee.employmentStatus)
    ? EDITABLE_STATUSES
    : [employee.employmentStatus, ...EDITABLE_STATUSES]

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    // Only send what changed; clearing the department, manager or location sends null.
    const update: UpdateEmployeePayload = {
      ...(dirtyFields.jobTitle ? { jobTitle: values.jobTitle.trim() } : {}),
      ...(dirtyFields.departmentId ? { departmentId: values.departmentId || null } : {}),
      ...(dirtyFields.managerId ? { managerId: values.managerId || null } : {}),
      ...(dirtyFields.employmentType ? { employmentType: toApiEnum(values.employmentType) } : {}),
      ...(dirtyFields.startDate ? { startDate: values.startDate } : {}),
      ...(dirtyFields.status ? { status: toApiEnum(values.status) } : {}),
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
      <SelectField id="departmentId" label="Department" options={departmentOptions} {...register('departmentId')} />
      <SelectField id="managerId" label="Manager" options={managerOptions} {...register('managerId')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="employmentType"
          label="Employment type"
          options={EMPLOYMENT_TYPES.map((type) => ({ value: type, label: type }))}
          {...register('employmentType')}
        />
        <SelectField
          id="status"
          label="Status"
          options={statusOptions.map((status) => ({ value: status, label: EMPLOYMENT_STATUS_META[status].label }))}
          {...register('status')}
        />
      </div>
      <TextField
        id="startDate"
        type="date"
        label="Start date"
        error={errors.startDate?.message}
        {...register('startDate')}
      />
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
