import { UnderlineTabs } from '../../../../components/ui/underline-tabs'
import { SECURITY_SETTINGS_TABS, type SecuritySettingsTabKey } from '../../lib/security-tabs-data'

export function SecuritySettingsTabs({
  active,
  onChange,
}: {
  active: SecuritySettingsTabKey
  onChange: (key: SecuritySettingsTabKey) => void
}) {
  return <UnderlineTabs tabs={SECURITY_SETTINGS_TABS} active={active} onChange={onChange} />
}
