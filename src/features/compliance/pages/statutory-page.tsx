import { useState } from 'react'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { usePayrollOverview } from '../../payroll/hooks/use-payroll-overview'
import { StatutoryRuleDetail } from '../components/statutory/statutory-rule-detail'
import type { StatutoryContributionRule } from '../../payroll/types/payroll-types'

type StatutoryTabKey = StatutoryContributionRule['id']

const STATUTORY_TABS: { key: StatutoryTabKey; label: string }[] = [
  { key: 'pension', label: 'Pension' },
  { key: 'nhf', label: 'NHF' },
  { key: 'nhia', label: 'NHIA' },
  { key: 'nsitf', label: 'NSITF' },
  { key: 'itf', label: 'ITF' },
]

export function StatutoryPage() {
  const [activeTab, setActiveTab] = useState<StatutoryTabKey>('pension')
  const { data, isPending, isError, refetch } = usePayrollOverview()
  const activeRule = data?.currentRun.statutoryContributions.find((candidate) => candidate.id === activeTab)

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Statutory Contributions</h1>
        <p className="mt-1 text-sm text-muted">Pension, NHF, NHIA, NSITF, and ITF — rates, applicability, and legal basis.</p>
      </div>

      <UnderlineTabs tabs={STATUTORY_TABS} active={activeTab} onChange={setActiveTab} />

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load statutory contributions</p>
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
      ) : activeRule ? (
        <StatutoryRuleDetail rule={activeRule} />
      ) : null}
    </div>
  )
}
