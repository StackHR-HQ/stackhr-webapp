import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'
import type { ExpensePayload, ReimbursementPayload, SalaryAdvancePayload } from '../types/employee-types'

export function useMyExpenses() {
  return useQuery({ queryKey: ['me', 'expenses'], queryFn: () => employeeApi.getExpenses() })
}

export function useMySalaryAdvances() {
  return useQuery({ queryKey: ['me', 'advances'], queryFn: () => employeeApi.getSalaryAdvances() })
}

export function useMyReimbursements(employeeId: string | undefined) {
  return useQuery({
    queryKey: ['me', 'reimbursements', employeeId],
    queryFn: () => employeeApi.getReimbursements(employeeId!),
    enabled: Boolean(employeeId),
  })
}

export function useSubmitReimbursement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReimbursementPayload) => employeeApi.submitReimbursement(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useCancelReimbursement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeeApi.cancelReimbursement(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useSubmitExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ExpensePayload) => employeeApi.submitExpense(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useSubmitSalaryAdvance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SalaryAdvancePayload) => employeeApi.submitSalaryAdvance(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useCancelExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeeApi.cancelExpense(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useCancelSalaryAdvance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeeApi.cancelSalaryAdvance(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
