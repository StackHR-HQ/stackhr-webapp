import { PlugsConnectedIcon, PuzzlePieceIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { USE_MOCK_SETTINGS } from '../../../lib/env'
import { IntegrationCategoryList } from '../components/integrations/integration-category-list'
import { IntegrationsTabs } from '../components/integrations/integrations-tabs'
import { useIntegrations } from '../hooks/use-integrations'
import type { IntegrationsTabKey } from '../lib/integrations-tabs-data'

export function IntegrationsPage() {
  if (!USE_MOCK_SETTINGS) {
    return (
      <div className="max-w-[900px] space-y-5">
        <div>
          <h1 className="text-xl font-medium text-ink">Integrations</h1>
          <p className="mt-1 text-sm text-muted">Connect the tools your organization already uses.</p>
        </div>
        <ComingSoon
          icon={PlugsConnectedIcon}
          title="Integrations"
          description="Soon you'll be able to connect your payment, email, accounting and banking tools to StackHR."
        />
      </div>
    )
  }
  return <MockIntegrations />
}

function MockIntegrations() {
  const { data: integrations, isPending } = useIntegrations()
  const [activeTab, setActiveTab] = useState<IntegrationsTabKey>('payment')

  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Integrations</h1>
        <p className="mt-1 text-sm text-muted">Connect the tools your organization already uses.</p>
      </div>

      <IntegrationsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'other' ? (
        <ComingSoon
          icon={PuzzlePieceIcon}
          title="More integrations"
          description="Soon you'll be able to connect HRIS, e-signature, expense cards and more."
        />
      ) : isPending || !integrations ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <IntegrationCategoryList
          category={activeTab}
          integrations={integrations.filter((integration) => integration.category === activeTab)}
        />
      )}
    </div>
  )
}
