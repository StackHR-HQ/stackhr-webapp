import { UnderlineTabs } from '../../../../components/ui/underline-tabs'
import { ORGANIZATION_SETTINGS_TABS, type OrganizationSettingsTabKey } from '../../lib/organization-tabs-data'

export function OrganizationSettingsTabs({
  active,
  onChange,
}: {
  active: OrganizationSettingsTabKey
  onChange: (key: OrganizationSettingsTabKey) => void
}) {
  return <UnderlineTabs tabs={ORGANIZATION_SETTINGS_TABS} active={active} onChange={onChange} />
}
