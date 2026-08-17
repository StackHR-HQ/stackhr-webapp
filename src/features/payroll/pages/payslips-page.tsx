import { useMemo, useState } from 'react'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { AllPayslipsView } from '../components/payslips/all-payslips-view'
import { EmployeePayslipsView } from '../components/payslips/employee-payslips-view'
import { GeneratePayslipView } from '../components/payslips/generate-payslip-view'
import { PayslipTemplatesView } from '../components/payslips/payslip-templates-view'
import { usePayslips } from '../hooks/use-payslips'

type PayslipsTabKey = 'all' | 'employee' | 'generate' | 'templates'

const PAYSLIPS_TABS: { key: PayslipsTabKey; label: string }[] = [
  { key: 'all', label: 'All Payslips' },
  { key: 'employee', label: 'Employee Payslips' },
  { key: 'generate', label: 'Generate Payslip' },
  { key: 'templates', label: 'Payslip Templates' },
]

export function PayslipsPage() {
  const { data: payslips, isPending } = usePayslips()
  const [activeTab, setActiveTab] = useState<PayslipsTabKey>('all')

  const pendingPayslips = useMemo(() => (payslips ?? []).filter((payslip) => payslip.status === 'pending'), [payslips])

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Payslips</h1>
        <p className="mt-1 text-sm text-muted">Every payslip generated from payroll runs, by employee and by period.</p>
      </div>

      <UnderlineTabs tabs={PAYSLIPS_TABS} active={activeTab} onChange={setActiveTab} />

      {isPending ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'all' ? <AllPayslipsView payslips={payslips ?? []} /> : null}
          {activeTab === 'employee' ? <EmployeePayslipsView payslips={payslips ?? []} /> : null}
          {activeTab === 'generate' ? <GeneratePayslipView pendingPayslips={pendingPayslips} /> : null}
          {activeTab === 'templates' ? <PayslipTemplatesView /> : null}
        </>
      )}
    </div>
  )
}
