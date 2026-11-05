import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bankingApi } from '../api/banking-api'

const NUBAN = /^\d{10}$/

export function useBanks() {
  return useQuery({
    queryKey: ['banking', 'banks'],
    queryFn: () => bankingApi.getBanks(),
    // The backend caches the list for a day; it rarely changes.
    staleTime: 60 * 60 * 1000,
    retry: false,
  })
}

export function useDepositAccount(enabled = true) {
  return useQuery({
    queryKey: ['banking', 'deposit-account'],
    queryFn: () => bankingApi.getDepositAccount(),
    enabled,
    retry: false,
  })
}

export function useSyncDepositAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => bankingApi.syncDepositAccount(),
    onSuccess: (account) => queryClient.setQueryData(['banking', 'deposit-account'], account),
  })
}

// Runs once there's a bank and a full 10-digit account number.
export function useVerifyBankAccount(bankCode: string | undefined, accountNumber: string) {
  return useQuery({
    queryKey: ['banking', 'verify', bankCode, accountNumber],
    queryFn: () => bankingApi.verifyAccount(bankCode!, accountNumber),
    enabled: Boolean(bankCode) && NUBAN.test(accountNumber),
    staleTime: Infinity,
    retry: false,
  })
}
