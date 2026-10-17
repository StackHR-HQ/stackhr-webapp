import { ClockCounterClockwiseIcon, CreditCardIcon, ReceiptIcon, RepeatIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { USE_MOCK_SETTINGS } from '../../../lib/env'
import { BillingHistoryView } from '../components/billing/billing-history-view'
import { BillingSettingsTabs } from '../components/billing/billing-settings-tabs'
import { CurrentPlanView } from '../components/billing/current-plan-view'
import { InvoicesView } from '../components/billing/invoices-view'
import { PaymentMethodView } from '../components/billing/payment-method-view'
import { SubscriptionView } from '../components/billing/subscription-view'
import { TrialStatusView } from '../components/billing/trial-status-view'
import { useBillingSettings } from '../hooks/use-billing-settings'
import { useBillingStatus } from '../hooks/use-billing-status'
import type { BillingSettingsTabKey } from '../lib/billing-tabs-data'

export function BillingPage() {
  const [activeTab, setActiveTab] = useState<BillingSettingsTabKey>('current-plan')

  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Billing</h1>
        <p className="mt-1 text-sm text-muted">Your plan, subscription, and payment details.</p>
      </div>

      <BillingSettingsTabs active={activeTab} onChange={setActiveTab} />

      {USE_MOCK_SETTINGS ? <MockBilling activeTab={activeTab} /> : <Billing activeTab={activeTab} />}
    </div>
  )
}

// Only the plan and trial come from the backend.
function Billing({ activeTab }: { activeTab: BillingSettingsTabKey }) {
  const { data: status, isPending } = useBillingStatus()

  if (activeTab === 'current-plan' || activeTab === 'trial-status') {
    if (isPending || !status) return <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
    return activeTab === 'current-plan' ? (
      <CurrentPlanView
        currentPlan={{
          name: status.status === 'trial' ? `${status.planName} (Trial)` : status.planName,
          billingCycle: status.billingCycle,
          seatsIncluded: status.seatsLimit,
          seatsUsed: status.seatsUsed,
        }}
      />
    ) : (
      <TrialStatusView subscription={status} trialLengthDays={status.trialLengthDays} canUpgrade={false} />
    )
  }

  if (activeTab === 'subscription') {
    return (
      <ComingSoon
        icon={RepeatIcon}
        title="Subscription management"
        description="Soon you'll be able to upgrade, change plans and manage seats from here."
      />
    )
  }
  if (activeTab === 'payment-method') {
    return (
      <ComingSoon
        icon={CreditCardIcon}
        title="Payment methods"
        description="Soon you'll be able to add and update the card your subscription is billed to."
      />
    )
  }
  if (activeTab === 'billing-history') {
    return (
      <ComingSoon
        icon={ClockCounterClockwiseIcon}
        title="Billing history"
        description="Soon you'll see every charge to your StackHR subscription here."
      />
    )
  }
  return (
    <ComingSoon
      icon={ReceiptIcon}
      title="Invoices"
      description="Soon you'll be able to download every StackHR invoice from here."
    />
  )
}

function MockBilling({ activeTab }: { activeTab: BillingSettingsTabKey }) {
  const { data: settings, isPending } = useBillingSettings()

  if (isPending || !settings) return <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />

  return (
    <>
      {activeTab === 'current-plan' ? <CurrentPlanView currentPlan={settings.currentPlan} /> : null}
      {activeTab === 'subscription' ? <SubscriptionView subscription={settings.subscription} /> : null}
      {activeTab === 'payment-method' ? <PaymentMethodView paymentMethod={settings.paymentMethod} /> : null}
      {activeTab === 'billing-history' ? <BillingHistoryView billingHistory={settings.billingHistory} /> : null}
      {activeTab === 'invoices' ? <InvoicesView invoices={settings.invoices} /> : null}
      {activeTab === 'trial-status' ? <TrialStatusView subscription={settings.subscription} /> : null}
    </>
  )
}
