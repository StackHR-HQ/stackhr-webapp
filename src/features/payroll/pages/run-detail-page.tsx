import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { AuditLogTab } from '../components/run-detail/audit-log-tab'
import { ComplianceTab } from '../components/run-detail/compliance-tab'
import { DeductionsTab } from '../components/run-detail/deductions-tab'
import { EarningsTab } from '../components/run-detail/earnings-tab'
import { EmployeesTab } from '../components/run-detail/employees-tab'
import { EmployerContributionsTab } from '../components/run-detail/employer-contributions-tab'
import { PayslipsTab } from '../components/run-detail/payslips-tab'
import { RunHeader } from '../components/run-detail/run-header'
import { SummaryTab } from '../components/run-detail/summary-tab'
import { TaxTab } from '../components/run-detail/tax-tab'
import { usePayrollRun } from '../hooks/use-payroll-run'

type RunTabKey = 'summary' | 'employees' | 'earnings' | 'deductions' | 'employer' | 'tax' | 'compliance' | 'payslips' | 'audit'

const RUN_TABS: { key: RunTabKey; label: string }[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'employees', label: 'Employees' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'deductions', label: 'Deductions' },
  { key: 'employer', label: 'Employer Contributions' },
  { key: 'tax', label: 'Tax' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'payslips', label: 'Payslips' },
  { key: 'audit', label: 'Audit Log' },
]

export function PayrollRunDetailPage() {
  const { runId } = useParams<{ runId: string }>()
  const { data: run, isPending, isError, refetch } = usePayrollRun(runId)
  const [activeTab, setActiveTab] = useState<RunTabKey>('summary')

  if (isPending) {
    return (
      <div className="max-w-[1400px] space-y-5">
        <div className="h-28 animate-pulse rounded-panel border border-line bg-surface" />
        <div className="h-96 animate-pulse rounded-panel border border-line bg-surface" />
      </div>
    )
  }

  if (isError || !run) {
    return (
      <div className="max-w-md rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
        <p className="text-sm font-medium text-ink">Couldn't load this payroll run</p>
        <p className="mt-1 text-sm text-muted">It may not exist, or something went wrong.</p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/payroll/runs"
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            Back to runs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <Link to="/payroll/runs" className="text-xs font-medium text-muted hover:text-ink">
        ← Back to payroll runs
      </Link>

      <RunHeader run={run} />

      <UnderlineTabs tabs={RUN_TABS} active={activeTab} onChange={setActiveTab} />

      <div>
        {activeTab === 'summary' ? <SummaryTab run={run} /> : null}
        {activeTab === 'employees' ? <EmployeesTab lines={run.lines} currency={run.summary.currency} /> : null}
        {activeTab === 'earnings' ? <EarningsTab lines={run.lines} currency={run.summary.currency} /> : null}
        {activeTab === 'deductions' ? <DeductionsTab lines={run.lines} currency={run.summary.currency} /> : null}
        {activeTab === 'employer' ? (
          <EmployerContributionsTab
            lines={run.lines}
            currency={run.summary.currency}
            statutoryContributions={run.statutoryContributions}
          />
        ) : null}
        {activeTab === 'tax' ? <TaxTab taxRuleSet={run.taxRuleSet} lines={run.lines} currency={run.summary.currency} /> : null}
        {activeTab === 'compliance' ? (
          <ComplianceTab warnings={run.complianceWarnings} statutoryContributions={run.statutoryContributions} />
        ) : null}
        {activeTab === 'payslips' ? (
          <PayslipsTab lines={run.lines} currency={run.summary.currency} runStatus={run.status} />
        ) : null}
        {activeTab === 'audit' ? <AuditLogTab entries={run.auditLog} /> : null}
      </div>
    </div>
  )
}
