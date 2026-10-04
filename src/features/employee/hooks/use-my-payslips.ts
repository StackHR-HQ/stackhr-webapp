import { useQuery } from '@tanstack/react-query'
import { employeeApi } from '../api/employee-api'
import type { MyPayslip } from '../types/employee-types'

export function latestPayslip(payslips: MyPayslip[]): MyPayslip | undefined {
  return [...payslips].sort((a, b) => b.periodYear - a.periodYear || b.periodMonth - a.periodMonth)[0]
}

export function payslipPeriod(payslip: MyPayslip): string {
  return new Date(payslip.periodYear, payslip.periodMonth - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function useMyPayslips() {
  return useQuery({ queryKey: ['me', 'payslips'], queryFn: () => employeeApi.getPayslips() })
}
