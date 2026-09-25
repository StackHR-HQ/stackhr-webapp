import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../../components/ui/button'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../../lib/http'
import { EMPLOYMENT_TYPES } from '../../../onboarding/constants/onboarding-options'
import { useCreateEmployee } from '../../hooks/use-create-employee'
import {
  addEmployeeSchema,
  type AddEmployeeFormInput,
  type AddEmployeeFormValues,
} from '../../schemas/add-employee-schema'

export function AddEmployeeForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const createEmployee = useCreateEmployee()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<AddEmployeeFormInput, unknown, AddEmployeeFormValues>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      workEmail: '',
      jobTitle: '',
      employmentType: 'Full-time',
      startDate: '',
      salaryAmount: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await createEmployee.mutateAsync(values)
      onDone()
    } catch (err) {
      setError('root', { message: getApiErrorMessage(err) })
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-sm text-muted">They&apos;ll appear as pending until they accept their invitation.</p>

      <div className="mt-4">
        {errors.root ? <FormErrorBanner message={errors.root.message ?? ''} /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="firstName" label="First name" placeholder="Ada" error={errors.firstName?.message} {...register('firstName')} />
        <TextField id="lastName" label="Last name" placeholder="Obi" error={errors.lastName?.message} {...register('lastName')} />
        <TextField
          id="workEmail"
          label="Work email"
          type="email"
          placeholder="ada@company.com"
          error={errors.workEmail?.message}
          {...register('workEmail')}
        />
        <TextField
          id="jobTitle"
          label="Job title"
          placeholder="Software Engineer"
          error={errors.jobTitle?.message}
          {...register('jobTitle')}
        />
        <SelectField
          id="employmentType"
          label="Employment type"
          options={EMPLOYMENT_TYPES.map((type) => ({ value: type, label: type }))}
          {...register('employmentType')}
        />
        <TextField id="startDate" label="Start date" type="date" error={errors.startDate?.message} {...register('startDate')} />
        <TextField
          id="salaryAmount"
          label="Salary"
          type="number"
          min="0"
          step="0.01"
          placeholder="450000"
          error={errors.salaryAmount?.message}
          {...register('salaryAmount')}
        />
      </div>

      <div className="mt-5 flex gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} className="w-auto px-6">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} className="w-auto px-6">
          Add employee
        </Button>
      </div>
    </form>
  )
}
