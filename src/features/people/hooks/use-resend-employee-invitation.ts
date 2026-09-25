import { useMutation } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'

export function useResendEmployeeInvitation() {
  return useMutation({
    mutationFn: (employeeId: string) => peopleApi.resendEmployeeInvitation(employeeId),
  })
}
