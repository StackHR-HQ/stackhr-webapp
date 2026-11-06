import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { EmployerContributionsTab } from '../../payroll/components/run-detail/employer-contributions-tab'
import { useComplianceOverview } from '../../payroll/hooks/use-compliance-overview'
import { PenCentralConnectionCard } from '../components/pension/pencentral-connection-card'
import { RemittanceHistoryTab } from '../components/pension/remittance-history-tab'
import { usePenCentralEmployer } from '../hooks/use-pension'
import { EmployeeContributionsTab } from '../components/remittances/employee-contributions-tab'

type RemittancesTabKey = 'employee' | 'employer' | 'history' | 'exports'

const REMITTANCES_TABS: { key: RemittancesTabKey; label: string }[] = [
  { key: 'employee', label: 'Employee Contributions' },
  { key: 'employer', label: 'Employer Contributions' },
  { key: 'history', label: 'Pension Remittances' },
  { key: 'exports', label: 'Remittance Exports' },
]

export function RemittancesPage() {
  const [activeTab, setActiveTab] = useState<RemittancesTabKey>('employee')
  const { data, isPending, isError, refetch } = useComplianceOverview()
  const employer = usePenCentralEmployer()

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Remittances</h1>
        <p className="mt-1 text-sm text-muted">
          Employee and employer statutory contributions for {data?.currentRun?.periodLabel ?? 'the current run'}.
        </p>
      </div>

      {employer.data ? (
        <PenCentralConnectionCard employer={employer.data} />
      ) : employer.isError ? (
        <p className="rounded-panel border border-line bg-surface p-4 text-sm text-muted">
          Couldn&apos;t check your PenCentral connection.{' '}
          <button type="button" onClick={() => employer.refetch()} className="font-medium text-accent hover:underline">
            Try again
          </button>
        </p>
      ) : (
        <div className="h-28 animate-pulse rounded-panel border border-line bg-surface" />
      )}

      <UnderlineTabs tabs={REMITTANCES_TABS} active={activeTab} onChange={setActiveTab} />

      {/* Pension remittances load their own data, so a payroll overview failure doesn't hide them. */}
      {activeTab === 'history' ? (
        <RemittanceHistoryTab connected={Boolean(employer.data?.isAttached)} />
      ) : activeTab === 'exports' ? (
        <ComingSoon
          icon={DownloadSimpleIcon}
          title="Remittance exports"
          description="Soon you'll be able to download remittance schedules in the format each statutory body expects, ready to file."
        />
      ) : isError ? (
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
            <EmployeeContributionsTab
              lines={data.currentRun?.lines ?? []}
              currency={data.currentRun?.summary.currency ?? 'NGN'}
            />
          ) : null}
          {activeTab === 'employer' ? (
            <EmployerContributionsTab
              lines={data.currentRun?.lines ?? []}
              currency={data.currentRun?.summary.currency ?? 'NGN'}
              statutoryContributions={data.statutoryContributions}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
