import { GiftIcon, ReceiptXIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { USE_MOCK_PAYROLL } from '../../../lib/env'
import { AllowancesView } from '../components/salaries/allowances-view'
import { BonusesView } from '../components/salaries/bonuses-view'
import { DeductionsView } from '../components/salaries/deductions-view'
import { EmployeeSalariesView } from '../components/salaries/employee-salaries-view'
import { SalaryChangesView } from '../components/salaries/salary-changes-view'
import { SalaryStructuresView } from '../components/salaries/salary-structures-view'
import { useBonusPayouts } from '../hooks/use-bonus-payouts'
import { useDeductionTypes } from '../hooks/use-deduction-types'
import { useEarningComponents } from '../hooks/use-earning-components'
import { useEmployeeSalaries } from '../hooks/use-employee-salaries'
import { useSalaryBands } from '../hooks/use-salary-bands'
import { useSalaryChanges } from '../hooks/use-salary-changes'

type SalariesTabKey = 'structures' | 'employees' | 'allowances' | 'bonuses' | 'deductions' | 'changes'

const SALARIES_TABS: { key: SalariesTabKey; label: string }[] = [
  { key: 'structures', label: 'Salary Structures' },
  { key: 'employees', label: 'Employee Salaries' },
  { key: 'allowances', label: 'Allowances' },
  { key: 'bonuses', label: 'Bonuses' },
  { key: 'deductions', label: 'Deductions' },
  { key: 'changes', label: 'Salary Changes' },
]

export function SalariesPage() {
  const [activeTab, setActiveTab] = useState<SalariesTabKey>('structures')
  const { data: bands, isPending: bandsPending } = useSalaryBands()
  const { data: components, isPending: componentsPending } = useEarningComponents()
  const { data: employeeSalaries, isPending: employeesPending } = useEmployeeSalaries()
  // Bonuses and deduction types have no backend yet, so only mock data has them.
  const { data: bonuses, isPending: bonusesPending } = useBonusPayouts(USE_MOCK_PAYROLL)
  const { data: deductions, isPending: deductionsPending } = useDeductionTypes(USE_MOCK_PAYROLL)
  const { data: changes, isPending: changesPending } = useSalaryChanges()

  const pendingByTab: Record<SalariesTabKey, boolean> = {
    structures: bandsPending || componentsPending,
    employees: employeesPending,
    allowances: componentsPending,
    bonuses: USE_MOCK_PAYROLL && bonusesPending,
    deductions: USE_MOCK_PAYROLL && deductionsPending,
    changes: changesPending,
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Salary Management</h1>
        <p className="mt-1 text-sm text-muted">How compensation is structured, paid, and changed over time.</p>
      </div>

      <UnderlineTabs tabs={SALARIES_TABS} active={activeTab} onChange={setActiveTab} />

      {pendingByTab[activeTab] ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'structures' ? (
            <SalaryStructuresView components={components ?? []} bands={bands ?? []} />
          ) : null}
          {activeTab === 'employees' ? <EmployeeSalariesView rows={employeeSalaries ?? []} /> : null}
          {activeTab === 'allowances' ? <AllowancesView components={components ?? []} /> : null}
          {activeTab === 'bonuses' ? (
            USE_MOCK_PAYROLL ? (
              <BonusesView payouts={bonuses ?? []} />
            ) : (
              <ComingSoon
                icon={GiftIcon}
                title="Bonuses"
                description="Soon you'll be able to pay one-off and performance bonuses alongside a payroll run, taxed correctly."
              />
            )
          ) : null}
          {activeTab === 'deductions' ? (
            USE_MOCK_PAYROLL ? (
              <DeductionsView deductions={deductions ?? []} />
            ) : (
              <ComingSoon
                icon={ReceiptXIcon}
                title="Deduction types"
                description="Soon you'll be able to set up loan repayments, union dues and other recurring deductions from here."
              />
            )
          ) : null}
          {activeTab === 'changes' ? <SalaryChangesView changes={changes ?? []} /> : null}
        </>
      )}
    </div>
  )
}
