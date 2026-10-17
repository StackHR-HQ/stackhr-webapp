import { SlidersHorizontalIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { USE_MOCK_SETTINGS } from '../../../lib/env'
import { ComplianceProfileView } from '../components/payroll/compliance-profile-view'
import { ContributionPreferencesView } from '../components/payroll/contribution-preferences-view'
import { PayrollSettingsTabs } from '../components/payroll/payroll-settings-tabs'
import { PensionCalculationBaseView } from '../components/payroll/pension-calculation-base-view'
import { SalaryComponentClassificationView } from '../components/payroll/salary-component-classification-view'
import { StatutoryContributionsView } from '../components/payroll/statutory-contributions-view'
import { TaxRulesView } from '../components/payroll/tax-rules-view'
import { usePayrollSettings } from '../hooks/use-payroll-settings'
import type { PayrollSettingsTabKey } from '../lib/payroll-tabs-data'

export function SettingsPayrollPage() {
  if (!USE_MOCK_SETTINGS) {
    return (
      <div className="max-w-[900px] space-y-5">
        <div>
          <h1 className="text-xl font-medium text-ink">Payroll</h1>
          <p className="mt-1 text-sm text-muted">Your organization-level payroll compliance settings.</p>
        </div>
        <ComingSoon
          icon={SlidersHorizontalIcon}
          title="Payroll settings"
          description="Soon you'll be able to set contribution preferences, the pension base and how pay components are classified. The active tax rules and statutory contributions are under Compliance."
        />
      </div>
    )
  }
  return <MockPayrollSettings />
}

function MockPayrollSettings() {
  const { data: settings, isPending } = usePayrollSettings()
  const [activeTab, setActiveTab] = useState<PayrollSettingsTabKey>('tax-rules')

  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Payroll</h1>
        <p className="mt-1 text-sm text-muted">Your organization-level payroll compliance settings.</p>
      </div>

      <PayrollSettingsTabs active={activeTab} onChange={setActiveTab} />

      {isPending || !settings ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'tax-rules' ? <TaxRulesView activeTaxRuleSetId={settings.activeTaxRuleSetId} /> : null}
          {activeTab === 'statutory-contributions' ? <StatutoryContributionsView /> : null}
          {activeTab === 'contribution-preferences' ? (
            <ContributionPreferencesView contributionPreferences={settings.contributionPreferences} />
          ) : null}
          {activeTab === 'pension-calculation-base' ? (
            <PensionCalculationBaseView pensionCalculationBase={settings.pensionCalculationBase} />
          ) : null}
          {activeTab === 'salary-component-classification' ? (
            <SalaryComponentClassificationView salaryComponentClassifications={settings.salaryComponentClassifications} />
          ) : null}
          {activeTab === 'compliance-profile' ? <ComplianceProfileView complianceProfile={settings.complianceProfile} /> : null}
        </>
      )}
    </div>
  )
}
