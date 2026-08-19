import { useState } from 'react'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { TaxTab as PayePayrollTab } from '../../payroll/components/run-detail/tax-tab'
import { usePayrollOverview } from '../../payroll/hooks/use-payroll-overview'
import { usePayrollRuns } from '../../payroll/hooks/use-payroll-runs'
import { useTaxRuleSets } from '../../payroll/hooks/use-tax-rule-sets'
import { TaxConfigurationTab } from '../components/tax/tax-configuration-tab'
import { TaxHistoryTab } from '../components/tax/tax-history-tab'
import { TaxRulesTab } from '../components/tax/tax-rules-tab'

type TaxTabKey = 'configuration' | 'paye' | 'rules' | 'history'

const TAX_TABS: { key: TaxTabKey; label: string }[] = [
  { key: 'configuration', label: 'Tax Configuration' },
  { key: 'paye', label: 'PAYE' },
  { key: 'rules', label: 'Tax Rules' },
  { key: 'history', label: 'Tax History' },
]

export function TaxPage() {
  const [activeTab, setActiveTab] = useState<TaxTabKey>('configuration')
  const overview = usePayrollOverview()
  const ruleSets = useTaxRuleSets()
  const runs = usePayrollRuns()

  const isPending = overview.isPending || ruleSets.isPending || runs.isPending
  const isError = overview.isError || ruleSets.isError || runs.isError

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Tax</h1>
        <p className="mt-1 text-sm text-muted">PAYE configuration, applicable tax rules, and tax rule history.</p>
      </div>

      <UnderlineTabs tabs={TAX_TABS} active={activeTab} onChange={setActiveTab} />

      {isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load tax data</p>
          <button
            type="button"
            onClick={() => {
              void overview.refetch()
              void ruleSets.refetch()
              void runs.refetch()
            }}
            className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
          >
            Try again
          </button>
        </div>
      ) : isPending || !overview.data || !ruleSets.data || !runs.data ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'configuration' ? <TaxConfigurationTab taxRuleSet={overview.data.currentRun.taxRuleSet} /> : null}
          {activeTab === 'paye' ? (
            <PayePayrollTab
              taxRuleSet={overview.data.currentRun.taxRuleSet}
              lines={overview.data.currentRun.lines}
              currency={overview.data.currentRun.summary.currency}
            />
          ) : null}
          {activeTab === 'rules' ? (
            <TaxRulesTab ruleSets={ruleSets.data} activeRuleSetId={overview.data.currentRun.taxRuleSetId} />
          ) : null}
          {activeTab === 'history' ? <TaxHistoryTab runs={runs.data} ruleSets={ruleSets.data} /> : null}
        </>
      )}
    </div>
  )
}
