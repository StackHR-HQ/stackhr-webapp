import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useMemo } from 'react'
import { useAuthStore } from '../../auth/store/auth-store'
import { usePayrollRuns } from '../../payroll/hooks/use-payroll-runs'
import { useSalaryAdvances } from '../../payroll/hooks/use-salary-advances'
import { useLeaveRequests } from '../../people/hooks/use-leave-requests'
import { useReimbursements } from '../../spend/hooks/use-reimbursements'
import { useSpendApprovals } from '../../spend/hooks/use-spend-approvals'
import { approvalsApi } from '../api/approvals-api'
import {
  approvalRequestsToApprovals,
  leaveRequestsToApprovals,
  payrollRunsToApprovals,
  reimbursementsToApprovals,
  salaryAdvancesToApprovals,
  spendApprovalsToApprovals,
} from '../lib/aggregate'
import type { GlobalApprovalItem } from '../types/approval-types'

const isForbidden = (error: unknown) => isAxiosError(error) && error.response?.status === 403

export function useGlobalApprovals() {
  const currentUserId = useAuthStore((state) => state.user?.id)
  const leave = useLeaveRequests()
  const expenses = useSpendApprovals()
  const reimbursements = useReimbursements()
  const salaryAdvances = useSalaryAdvances()
  const payrollRuns = usePayrollRuns()

  // A manager can decide on leave and payroll but can't read those areas, so
  // their pending requests come from the approval records instead.
  const fallbackTypes = [
    ...(isForbidden(leave.error) ? ['LEAVE'] : []),
    ...(isForbidden(payrollRuns.error) ? ['PAYROLL'] : []),
  ]
  const fallback = useQuery({
    queryKey: ['approvals', 'pending', fallbackTypes],
    queryFn: () => approvalsApi.listPendingOfTypes(fallbackTypes),
    enabled: fallbackTypes.length > 0,
  })

  const sources = [leave, expenses, reimbursements, salaryAdvances, payrollRuns]
  const isPending = sources.some((query) => query.isPending) || (fallbackTypes.length > 0 && fallback.isPending)
  const isError = sources.some((query) => query.isError && !isForbidden(query.error)) || fallback.isError

  const data = useMemo<GlobalApprovalItem[]>(() => {
    if (isPending || isError) return []
    return [
      ...leaveRequestsToApprovals(leave.data ?? []),
      ...spendApprovalsToApprovals(expenses.data ?? []),
      ...reimbursementsToApprovals(reimbursements.data ?? []),
      ...salaryAdvancesToApprovals(salaryAdvances.data ?? []),
      ...payrollRunsToApprovals(payrollRuns.data ?? []),
      ...approvalRequestsToApprovals(fallback.data ?? [], currentUserId),
    ]
  }, [
    isPending,
    isError,
    leave.data,
    expenses.data,
    reimbursements.data,
    salaryAdvances.data,
    payrollRuns.data,
    fallback.data,
    currentUserId,
  ])

  function refetch() {
    for (const query of [...sources, fallback]) void query.refetch()
  }

  return { data, isPending, isError, refetch }
}
