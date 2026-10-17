import { BuildingsIcon, MapPinIcon, PaletteIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { USE_MOCK_SETTINGS } from '../../../lib/env'
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

      {/* The backend only stores company information; the other tabs show Coming soon with real data. */}
      {!USE_MOCK_SETTINGS && activeTab === 'branding' ? (
        <ComingSoon
          icon={PaletteIcon}
          title="Branding"
          description="Soon you'll be able to add your logo and brand colours to payslips and emails."
        />
      ) : !USE_MOCK_SETTINGS && activeTab === 'address' ? (
        <ComingSoon
          icon={MapPinIcon}
          title="Company address"
          description="Soon you'll be able to record your registered address for payslips and statutory filings."
        />
      ) : !USE_MOCK_SETTINGS && activeTab === 'business-information' ? (
        <ComingSoon
          icon={BuildingsIcon}
          title="Business information"
          description="Soon you'll be able to record your RC number, TIN, business type and website."
        />
      ) : isPending || !settings ? (
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
