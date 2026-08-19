import { UnderlineTabs } from '../../../../components/ui/underline-tabs'
import { BILLING_SETTINGS_TABS, type BillingSettingsTabKey } from '../../lib/billing-tabs-data'

export function BillingSettingsTabs({
  active,
  onChange,
}: {
  active: BillingSettingsTabKey
  onChange: (key: BillingSettingsTabKey) => void
}) {
  return <UnderlineTabs tabs={BILLING_SETTINGS_TABS} active={active} onChange={onChange} />
}
