import { useState, type FormEvent } from 'react'
import { Card, CardHeader } from '../../../../components/ui/card'
import { Switch } from '../../../../components/ui/switch'
import { useUpdatePayrollSettings } from '../../hooks/use-update-payroll-settings'
import { useStatutoryContributionRules } from '../../hooks/use-statutory-contribution-rules'
import type { ContributionPreference } from '../../types/settings-types'
import { SettingsFormFooter } from '../settings-form-footer'

function parseRateOverride(raw: string): number | null {
  if (raw.trim() === '') return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

export function ContributionPreferencesView({ contributionPreferences }: { contributionPreferences: ContributionPreference[] }) {
  const { data: rules } = useStatutoryContributionRules()
  const updatePayrollSettings = useUpdatePayrollSettings()
  const [preferences, setPreferences] = useState(contributionPreferences)

  function updatePreference(contributionId: ContributionPreference['contributionId'], patch: Partial<ContributionPreference>) {
    setPreferences((current) =>
      current.map((preference) => (preference.contributionId === contributionId ? { ...preference, ...patch } : preference)),
    )
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    updatePayrollSettings.mutate({ contributionPreferences: preferences })
  }

  return (
    <Card>
      <CardHeader
        title="Contribution Preferences"
        description="Turn contributions on or off for your organization and override the default employee/employer rates where needed."
      />
      <form onSubmit={handleSubmit} className="space-y-3">
        {preferences.map((preference) => {
          const rule = rules?.find((r) => r.id === preference.contributionId)
          return (
            <div key={preference.contributionId} className="rounded-lg border border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-ink">{rule?.name ?? preference.contributionId}</p>
                <Switch
                  checked={preference.enabled}
                  onChange={(enabled) => updatePreference(preference.contributionId, { enabled })}
                  label={`Toggle ${rule?.name ?? preference.contributionId}`}
                />
              </div>
              {preference.enabled ? (
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs text-muted" htmlFor={`${preference.contributionId}-employee-rate`}>
                      Employee rate override {rule ? `(default ${rule.employeeRatePercent}%)` : ''}
                    </label>
                    <input
                      id={`${preference.contributionId}-employee-rate`}
                      type="number"
                      step="0.1"
                      placeholder="Default"
                      value={preference.employeeRatePercentOverride ?? ''}
                      onChange={(event) =>
                        updatePreference(preference.contributionId, {
                          employeeRatePercentOverride: parseRateOverride(event.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-muted" htmlFor={`${preference.contributionId}-employer-rate`}>
                      Employer rate override {rule ? `(default ${rule.employerRatePercent}%)` : ''}
                    </label>
                    <input
                      id={`${preference.contributionId}-employer-rate`}
                      type="number"
                      step="0.1"
                      placeholder="Default"
                      value={preference.employerRatePercentOverride ?? ''}
                      onChange={(event) =>
                        updatePreference(preference.contributionId, {
                          employerRatePercentOverride: parseRateOverride(event.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}

        <SettingsFormFooter isPending={updatePayrollSettings.isPending} isSuccess={updatePayrollSettings.isSuccess} />
      </form>
    </Card>
  )
}
