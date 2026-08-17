import { UnderlineTabs } from '../../../../components/ui/underline-tabs'
import { ORGANIZATION_TABS, type OrganizationTabKey } from '../../lib/organization-tabs-data'

export function OrganizationTabs({
  active,
  onChange,
}: {
  active: OrganizationTabKey
  onChange: (key: OrganizationTabKey) => void
}) {
  return <UnderlineTabs tabs={ORGANIZATION_TABS} active={active} onChange={onChange} />
}
