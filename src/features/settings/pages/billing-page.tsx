import { useState } from 'react'
import { BillingHistoryView } from '../components/billing/billing-history-view'
import { BillingSettingsTabs } from '../components/billing/billing-settings-tabs'
import { CurrentPlanView } from '../components/billing/current-plan-view'
import { InvoicesView } from '../components/billing/invoices-view'
import { PaymentMethodView } from '../components/billing/payment-method-view'
import { SubscriptionView } from '../components/billing/subscription-view'
import { TrialStatusView } from '../components/billing/trial-status-view'
import { useBillingSettings } from '../hooks/use-billing-settings'
import type { BillingSettingsTabKey } from '../lib/billing-tabs-data'

export function BillingPage() {
  const { data: settings, isPending } = useBillingSettings()
  const [activeTab, setActiveTab] = useState<BillingSettingsTabKey>('current-plan')

  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Billing</h1>
        <p className="mt-1 text-sm text-muted">Your plan, subscription, and payment details.</p>
      </div>

      <BillingSettingsTabs active={activeTab} onChange={setActiveTab} />

      {isPending || !settings ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'current-plan' ? <CurrentPlanView currentPlan={settings.currentPlan} /> : null}
          {activeTab === 'subscription' ? <SubscriptionView subscription={settings.subscription} /> : null}
          {activeTab === 'payment-method' ? <PaymentMethodView paymentMethod={settings.paymentMethod} /> : null}
          {activeTab === 'billing-history' ? <BillingHistoryView billingHistory={settings.billingHistory} /> : null}
          {activeTab === 'invoices' ? <InvoicesView invoices={settings.invoices} /> : null}
          {activeTab === 'trial-status' ? <TrialStatusView subscription={settings.subscription} /> : null}
        </>
      )}
    </div>
  )
}
