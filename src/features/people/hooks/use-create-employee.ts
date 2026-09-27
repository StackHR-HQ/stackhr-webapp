import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { AddEmployeeFormValues } from '../schemas/add-employee-schema'

// The org's currency isn't collected in this form yet; NGN matches the rest
// of the app's default until a currency picker is added.
const DEFAULT_CURRENCY = 'NGN'
const DEFAULT_PAY_FREQUENCY = 'MONTHLY'

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: AddEmployeeFormValues) =>
      peopleApi.createEmployee({
        firstName: values.firstName,
        lastName: values.lastName,
        workEmail: values.workEmail,
        jobTitle: values.jobTitle,
        departmentId: values.departmentId,
        employmentType: values.employmentType,
        startDate: values.startDate,
        annualSalaryMinor: Math.round(values.annualSalary * 100),
        currency: DEFAULT_CURRENCY,
        payFrequency: DEFAULT_PAY_FREQUENCY,
        sendInvitation: values.sendInvitation,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'employees'] })
    },
  })
}
