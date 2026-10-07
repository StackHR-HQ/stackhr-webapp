import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'
import type { ExpensePayload, SalaryAdvancePayload } from '../types/employee-types'

export function useMyExpenses() {
  return useQuery({ queryKey: ['me', 'expenses'], queryFn: () => employeeApi.getExpenses() })
}

export function useMySalaryAdvances() {
  return useQuery({ queryKey: ['me', 'advances'], queryFn: () => employeeApi.getSalaryAdvances() })
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
