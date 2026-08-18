import { useState } from 'react'
import { AddressView } from '../components/organization/address-view'
import { BrandingView } from '../components/organization/branding-view'
import { BusinessInformationView } from '../components/organization/business-information-view'
import { CompanyInformationView } from '../components/organization/company-information-view'
import { OrganizationSettingsTabs } from '../components/organization/organization-settings-tabs'
import { useOrganizationSettings } from '../hooks/use-organization-settings'
import type { OrganizationSettingsTabKey } from '../lib/organization-tabs-data'

export function SettingsOrganizationPage() {
  const { data: settings, isPending } = useOrganizationSettings()
  const [activeTab, setActiveTab] = useState<OrganizationSettingsTabKey>('company-information')

  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Organization</h1>
        <p className="mt-1 text-sm text-muted">Your company's identity, address, and business details.</p>
      </div>

      <OrganizationSettingsTabs active={activeTab} onChange={setActiveTab} />

      {isPending || !settings ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'company-information' ? <CompanyInformationView companyInformation={settings.companyInformation} /> : null}
          {activeTab === 'branding' ? <BrandingView branding={settings.branding} /> : null}
          {activeTab === 'address' ? <AddressView address={settings.address} /> : null}
          {activeTab === 'business-information' ? (
            <BusinessInformationView businessInformation={settings.businessInformation} />
          ) : null}
        </>
      )}
    </div>
  )
}
