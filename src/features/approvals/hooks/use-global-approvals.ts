import { useMemo } from 'react'
import { usePayrollRuns } from '../../payroll/hooks/use-payroll-runs'
import { useSalaryAdvances } from '../../payroll/hooks/use-salary-advances'
import { useLeaveRequests } from '../../people/hooks/use-leave-requests'
import { useReimbursements } from '../../spend/hooks/use-reimbursements'
import { useSpendApprovals } from '../../spend/hooks/use-spend-approvals'
import {
  leaveRequestsToApprovals,
  payrollRunsToApprovals,
  reimbursementsToApprovals,
  salaryAdvancesToApprovals,
  spendApprovalsToApprovals,
} from '../lib/aggregate'
import type { GlobalApprovalItem } from '../types/approval-types'

export function useGlobalApprovals() {
  const leave = useLeaveRequests()
  const expenses = useSpendApprovals()
  const reimbursements = useReimbursements()
  const salaryAdvances = useSalaryAdvances()
  const payrollRuns = usePayrollRuns()

  const queries = [leave, expenses, reimbursements, salaryAdvances, payrollRuns]
  const isPending = queries.some((query) => query.isPending)
  const isError = queries.some((query) => query.isError)

  const data = useMemo<GlobalApprovalItem[]>(() => {
    if (isPending || isError) return []
    return [
      ...leaveRequestsToApprovals(leave.data ?? []),
      ...spendApprovalsToApprovals(expenses.data ?? []),
      ...reimbursementsToApprovals(reimbursements.data ?? []),
      ...salaryAdvancesToApprovals(salaryAdvances.data ?? []),
      ...payrollRunsToApprovals(payrollRuns.data ?? []),
    ]
  }, [isPending, isError, leave.data, expenses.data, reimbursements.data, salaryAdvances.data, payrollRuns.data])

  function refetch() {
    void leave.refetch()
    void expenses.refetch()
    void reimbursements.refetch()
    void salaryAdvances.refetch()
    void payrollRuns.refetch()
  }

  return { data, isPending, isError, refetch }
}
