import { ClockCounterClockwiseIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { EmployerContributionsTab } from '../../payroll/components/run-detail/employer-contributions-tab'
import { usePayrollOverview } from '../../payroll/hooks/use-payroll-overview'
import { ComingSoonPanel } from '../components/remittances/coming-soon-panel'
import { EmployeeContributionsTab } from '../components/remittances/employee-contributions-tab'

type RemittancesTabKey = 'employee' | 'employer' | 'history' | 'exports'

const REMITTANCES_TABS: { key: RemittancesTabKey; label: string }[] = [
  { key: 'employee', label: 'Employee Contributions' },
  { key: 'employer', label: 'Employer Contributions' },
  { key: 'history', label: 'Remittance History' },
  { key: 'exports', label: 'Remittance Exports' },
]

export function RemittancesPage() {
  const [activeTab, setActiveTab] = useState<RemittancesTabKey>('employee')
  const { data, isPending, isError, refetch } = usePayrollOverview()

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Remittances</h1>
        <p className="mt-1 text-sm text-muted">
          Employee and employer statutory contributions for {data ? data.currentRun.periodLabel : 'the current run'}.
        </p>
      </div>

      <UnderlineTabs tabs={REMITTANCES_TABS} active={activeTab} onChange={setActiveTab} />

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load remittance data</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Try again
          </button>
        </div>
      ) : isPending || !data ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'employee' ? (
            <EmployeeContributionsTab lines={data.currentRun.lines} currency={data.currentRun.summary.currency} />
          ) : null}
          {activeTab === 'employer' ? (
            <EmployerContributionsTab
              lines={data.currentRun.lines}
              currency={data.currentRun.summary.currency}
              statutoryContributions={data.currentRun.statutoryContributions}
            />
          ) : null}
          {activeTab === 'history' ? (
            <ComingSoonPanel
              icon={ClockCounterClockwiseIcon}
              title="Remittance history"
              description="A chronological record of every remittance filed with pension, tax, and other statutory bodies."
            />
          ) : null}
          {activeTab === 'exports' ? (
            <ComingSoonPanel
              icon={DownloadSimpleIcon}
              title="Remittance exports"
              description="Download remittance schedules in the formats each statutory body expects, ready to file."
            />
          ) : null}
        </>
      )}
    </div>
  )
}
