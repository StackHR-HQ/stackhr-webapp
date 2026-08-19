import { UnderlineTabs } from '../../../../components/ui/underline-tabs'
import { PAYROLL_SETTINGS_TABS, type PayrollSettingsTabKey } from '../../lib/payroll-tabs-data'

export function PayrollSettingsTabs({
  active,
  onChange,
}: {
  active: PayrollSettingsTabKey
  onChange: (key: PayrollSettingsTabKey) => void
}) {
  return <UnderlineTabs tabs={PAYROLL_SETTINGS_TABS} active={active} onChange={onChange} />
}
