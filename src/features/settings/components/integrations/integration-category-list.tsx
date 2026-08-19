import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { useUpdateIntegrationStatus } from '../../hooks/use-update-integration-status'
import type { Integration, IntegrationCategory } from '../../types/settings-types'

const CATEGORY_COPY: Record<IntegrationCategory, { title: string; description: string }> = {
  payment: { title: 'Payment', description: 'Providers used to send and receive payments.' },
  email: { title: 'Email', description: 'Providers used to send transactional and marketing email.' },
  accounting: { title: 'Accounting', description: 'Sync payroll and expense data with your accounting software.' },
  banking: { title: 'Banking', description: 'Business bank accounts connected for payroll funding.' },
}

export function IntegrationCategoryList({ category, integrations }: { category: IntegrationCategory; integrations: Integration[] }) {
  const updateIntegrationStatus = useUpdateIntegrationStatus()
  const copy = CATEGORY_COPY[category]

  return (
    <Card>
      <CardHeader title={copy.title} description={copy.description} />
      <div className="space-y-3">
        {integrations.map((integration) => {
          const isConnected = integration.status === 'connected'
          return (
            <div key={integration.id} className="flex items-center justify-between gap-4 rounded-lg border border-line p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">{integration.name}</p>
                  <Badge tone={isConnected ? 'positive' : 'neutral'}>{isConnected ? 'Connected' : 'Not connected'}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted">{integration.description}</p>
                {isConnected && integration.connectedAccount ? (
                  <p className="mt-0.5 text-xs text-muted">{integration.connectedAccount}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() =>
                  updateIntegrationStatus.mutate({ integrationId: integration.id, status: isConnected ? 'not_connected' : 'connected' })
                }
                disabled={updateIntegrationStatus.isPending}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
                  isConnected ? 'border-line text-critical hover:bg-critical/5' : 'border-accent text-accent hover:bg-accent/5'
                }`}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
