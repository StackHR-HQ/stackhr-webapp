import { PuzzlePieceIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoonCard } from '../components/coming-soon-card'
import { IntegrationCategoryList } from '../components/integrations/integration-category-list'
import { IntegrationsTabs } from '../components/integrations/integrations-tabs'
import { useIntegrations } from '../hooks/use-integrations'
import type { IntegrationsTabKey } from '../lib/integrations-tabs-data'

export function IntegrationsPage() {
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
        <ComingSoonCard
          title="Other Integrations"
          description="More integrations — HRIS, e-signature, expense cards, and more — are on the way."
          icon={PuzzlePieceIcon}
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
