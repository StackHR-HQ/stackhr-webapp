import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pensionApi } from '../api/pension-api'

const PENSION = ['compliance', 'pension'] as const

export function usePenCentralEmployer() {
  return useQuery({ queryKey: [...PENSION, 'employer'], queryFn: () => pensionApi.getEmployer() })
}

// The official PFA list; rarely changes.
export function usePfas() {
  return useQuery({
    queryKey: [...PENSION, 'pfas'],
    queryFn: () => pensionApi.getPfas(),
    staleTime: 60 * 60 * 1000,
    retry: false,
  })
}

// Read from StackHR's own records (no PenCentral call), so it loads whether or
// not PenCentral is connected.
export function usePensionSchedules() {
  return useQuery({ queryKey: [...PENSION, 'schedules'], queryFn: () => pensionApi.getSchedules() })
}

export function usePensionSchedule(id: string | null) {
  return useQuery({
    queryKey: [...PENSION, 'schedules', id],
    queryFn: () => pensionApi.getSchedule(id!),
    enabled: Boolean(id),
  })
}

export function usePensionComplianceReport(enabled: boolean) {
  return useQuery({
    queryKey: [...PENSION, 'report'],
    queryFn: () => pensionApi.getComplianceReport(),
    enabled,
    retry: false,
  })
}

export function useScheduleDisbursements(id: string, enabled: boolean) {
  return useQuery({
    queryKey: [...PENSION, 'schedules', id, 'disbursements'],
    queryFn: () => pensionApi.getDisbursements(id),
    enabled,
    retry: false,
  })
}

// Every pension write refreshes all pension data: a step changes the
// schedule, the list and the compliance totals together.
function usePensionMutation<TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PENSION }),
  })
}

export const useValidateEmployer = () =>
  useMutation({ mutationFn: (employerCode: string) => pensionApi.validateEmployer(employerCode) })
export const useAttachEmployer = () => usePensionMutation((validationId: string) => pensionApi.attachEmployer(validationId))
export const useRevokeEmployer = () => usePensionMutation<void, void>(() => pensionApi.revokeEmployer())
export const useCreateScheduleFromPayroll = () =>
  usePensionMutation((payrollRunId: string) => pensionApi.createScheduleFromPayroll(payrollRunId))
export const useValidateSchedule = () => usePensionMutation((id: string) => pensionApi.validateSchedule(id))
export const useCheckValidation = () => usePensionMutation((id: string) => pensionApi.getValidationStatus(id))
export const useSubmitSchedule = () => usePensionMutation((id: string) => pensionApi.submitSchedule(id))
// The account to pay into comes back in this response; cache it on the
// schedule straight away rather than relying on the refetch to carry it.
export function useInitiatePensionPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => pensionApi.initiatePayment(id),
    onSuccess: (schedule) => {
      queryClient.setQueryData([...PENSION, 'schedules', schedule.id], schedule)
      return queryClient.invalidateQueries({ queryKey: PENSION })
    },
  })
}
export const useSyncPensionPayment = () => usePensionMutation((id: string) => pensionApi.syncPaymentStatus(id))
