import { PlugsIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { AuthenticationView } from '../components/security/authentication-view'
import { PasswordView } from '../components/security/password-view'
import { SecurityActivityView } from '../components/security/security-activity-view'
import { SecuritySettingsTabs } from '../components/security/security-settings-tabs'
import { SessionsView } from '../components/security/sessions-view'
import { ComingSoonCard } from '../components/coming-soon-card'
import { useSecuritySettings } from '../hooks/use-security-settings'
import type { SecuritySettingsTabKey } from '../lib/security-tabs-data'

export function SecurityPage() {
  const { data: settings, isPending } = useSecuritySettings()
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
        <ComingSoonCard
          title="API/Integration Access"
          description="Generate API keys and manage programmatic access to your organization's data."
          icon={PlugsIcon}
        />
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
