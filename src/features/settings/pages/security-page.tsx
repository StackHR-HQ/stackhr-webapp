import { ClockCounterClockwiseIcon, DevicesIcon, PlugsIcon, ShieldCheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { ComingSoon } from '../../../components/ui/coming-soon'
import { USE_MOCK_SETTINGS } from '../../../lib/env'
import { AuthenticationView } from '../components/security/authentication-view'
import { PasswordView } from '../components/security/password-view'
import { SecurityActivityView } from '../components/security/security-activity-view'
import { SecuritySettingsTabs } from '../components/security/security-settings-tabs'
import { SessionsView } from '../components/security/sessions-view'
import { useSecuritySettings } from '../hooks/use-security-settings'
import type { SecuritySettingsTabKey } from '../lib/security-tabs-data'

export function SecurityPage() {
  // Only Password has a backend; with real data the other tabs show Coming soon.
  const { data: settings, isPending } = useSecuritySettings(USE_MOCK_SETTINGS)
  const [activeTab, setActiveTab] = useState<SecuritySettingsTabKey>('authentication')

  return (
    <div className="max-w-[900px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Security</h1>
        <p className="mt-1 text-sm text-muted">Sign-in methods, active sessions, and account activity.</p>
      </div>

      <SecuritySettingsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'password' ? (
        <PasswordView />
      ) : activeTab === 'api-access' ? (
        <ComingSoon
          icon={PlugsIcon}
          title="API access"
          description="Soon you'll be able to generate API keys and manage programmatic access to your organization's data."
        />
      ) : !USE_MOCK_SETTINGS ? (
        activeTab === 'authentication' ? (
          <ComingSoon
            icon={ShieldCheckIcon}
            title="Two-factor authentication"
            description="Soon you'll be able to require two-factor sign-in for your team."
          />
        ) : activeTab === 'sessions' ? (
          <ComingSoon
            icon={DevicesIcon}
            title="Session management"
            description="Soon you'll see every device signed in to your account and be able to sign them out."
          />
        ) : (
          <ComingSoon
            icon={ClockCounterClockwiseIcon}
            title="Security activity"
            description="Soon you'll see sign-ins, password changes and other security events for your account."
          />
        )
      ) : isPending || !settings ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'authentication' ? <AuthenticationView authentication={settings.authentication} /> : null}
          {activeTab === 'sessions' ? <SessionsView sessions={settings.sessions} /> : null}
          {activeTab === 'security-activity' ? <SecurityActivityView activity={settings.activity} /> : null}
        </>
      )}
    </div>
  )
}
