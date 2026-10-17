import { useMutation, useQueryClient } from '@tanstack/react-query'
import { payrollApi } from '../api/payroll-api'

// Every step changes the run's status, so payroll, the dashboard and
// approvals (which a submitted run joins) all need refreshing.
function useInvalidateRuns() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['payroll'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['spend'] }),
    ])
}

export function useCreatePayrollRun() {
  const onSuccess = useInvalidateRuns()
  return useMutation({ mutationFn: payrollApi.createRun, onSuccess })
}

export function useCalculatePayrollRun() {
  const onSuccess = useInvalidateRuns()
  return useMutation({ mutationFn: payrollApi.calculateRun, onSuccess })
}

export function useSubmitPayrollRun() {
  const onSuccess = useInvalidateRuns()
  return useMutation({ mutationFn: payrollApi.submitRun, onSuccess })
}

export function useAttestPayrollFunding() {
  const onSuccess = useInvalidateRuns()
  return useMutation({
    mutationFn: ({ id, confirmed, notes }: { id: string; confirmed: boolean; notes?: string }) =>
      payrollApi.attestFunding(id, { confirmed, notes }),
    onSuccess,
  })
}

export function useExecutePayrollRun() {
  const onSuccess = useInvalidateRuns()
  return useMutation({
    mutationFn: ({ id, idempotencyKey }: { id: string; idempotencyKey: string }) =>
      payrollApi.executeRun(id, idempotencyKey),
    onSuccess,
  })
}

export function useReconcilePayrollRun() {
  const onSuccess = useInvalidateRuns()
  return useMutation({ mutationFn: payrollApi.reconcileRun, onSuccess })
}
