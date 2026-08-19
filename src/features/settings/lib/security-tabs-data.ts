export type SecuritySettingsTabKey = 'authentication' | 'sessions' | 'password' | 'security-activity' | 'api-access'

export const SECURITY_SETTINGS_TABS: { key: SecuritySettingsTabKey; label: string }[] = [
  { key: 'authentication', label: 'Authentication' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'password', label: 'Password' },
  { key: 'security-activity', label: 'Security Activity' },
  { key: 'api-access', label: 'API/Integration Access' },
]
