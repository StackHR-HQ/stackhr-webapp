import { UnderlineTabs } from '../../../../components/ui/underline-tabs'
import { INTEGRATIONS_TABS, type IntegrationsTabKey } from '../../lib/integrations-tabs-data'

export function IntegrationsTabs({
  active,
  onChange,
}: {
  active: IntegrationsTabKey
  onChange: (key: IntegrationsTabKey) => void
}) {
  return <UnderlineTabs tabs={INTEGRATIONS_TABS} active={active} onChange={onChange} />
}
