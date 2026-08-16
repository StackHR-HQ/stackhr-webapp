import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/button'
import { SelectField } from '../../../components/ui/select-field'
import { TextField } from '../../../components/ui/text-field'
import { EMPLOYMENT_TYPES, currencySymbol } from '../constants/onboarding-options'
import { employeeFormSchema, type EmployeeFormInput, type EmployeeFormValues } from '../schemas/employee-schema'
import type { EmployeeDraft, NewEmployeeDraft } from '../types/onboarding-types'

export function EmployeeManualForm({
  currency,
  existingEmployees,
  onAdd,
}: {
  currency: string
  existingEmployees: EmployeeDraft[]
  onAdd: (employee: NewEmployeeDraft) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormInput, unknown, EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      department: '',
      jobTitle: '',
      employmentType: 'Full-time',
      salary: '',
      startDate: '',
      managerId: '',
    },
  })

  const onSubmit = handleSubmit((values) => {
    onAdd({
      ...values,
      managerId: values.managerId || undefined,
      source: 'manual',
    })
    reset()
    setFocus('fullName')
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="fullName"
          label="Full name"
          placeholder="Ada Obi"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <TextField
          id="empEmail"
          label="Email"
          type="email"
          placeholder="ada@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="department"
          label="Department"
          placeholder="Engineering"
          error={errors.department?.message}
          {...register('department')}
        />
        <TextField
          id="jobTitle"
          label="Role"
          placeholder="Software Engineer"
          error={errors.jobTitle?.message}
          {...register('jobTitle')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          id="employmentType"
          label="Employment type"
          options={EMPLOYMENT_TYPES.map((type) => ({ value: type, label: type }))}
          {...register('employmentType')}
        />
        <TextField
          id="salary"
          label={`Salary (${currencySymbol(currency)})`}
          type="number"
          min="0"
          step="0.01"
          placeholder="450000"
          error={errors.salary?.message}
          {...register('salary')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField id="startDate" label="Start date" type="date" error={errors.startDate?.message} {...register('startDate')} />
        <SelectField
          id="managerId"
          label="Manager"
          options={[
            { value: '', label: 'No manager' },
            ...existingEmployees.map((employee) => ({ value: employee.id, label: employee.fullName })),
          ]}
          {...register('managerId')}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-auto px-6">
        Add employee
      </Button>
    </form>
  )
}
