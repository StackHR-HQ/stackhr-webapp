import { ShieldCheck } from '@phosphor-icons/react'
import { useMyProfile } from '../hooks/use-my-profile'
import { statusLabel, toDate } from '../lib/profile-format'

export function CurrentStatusCard() {
  const { data: profile, isPending, isError } = useMyProfile()

  if (isPending) {
    return <div className="min-h-52 animate-pulse rounded-panel border border-line bg-ink shadow-panel" />
  }

  if (isError) {
    return (
      <div className="rounded-panel border border-line bg-ink p-6 text-canvas shadow-panel sm:p-7">
        <p className="text-xs uppercase tracking-[0.14em] text-canvas/60">Current status</p>
        <p className="mt-3 text-sm text-canvas/70">Couldn't load your profile right now.</p>
      </div>
    )
  }

  const subtitle = [profile.jobTitle, profile.department, profile.manager && `Manager: ${profile.manager.fullName}`]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="rounded-panel border border-line bg-ink p-6 text-canvas shadow-panel sm:p-7">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-canvas/60">Current status</p>
          <p className="mt-3 text-2xl font-medium">{profile.employmentStatus === 'ACTIVE' ? 'Active employee' : statusLabel(profile.employmentStatus)}
          </p>
          {subtitle ? <p className="mt-1 text-sm text-canvas/65">{subtitle}</p> : null}
        </div>
        <ShieldCheck size={28} weight="duotone" className="text-canvas/75" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-canvas/15 pt-4 text-sm sm:grid-cols-3">
        <div>
          <span className="block text-canvas/55">Next payday</span>
          <strong className="mt-1 block font-medium">
            {profile.nextPayDate
              ? toDate(profile.nextPayDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Not scheduled'}
          </strong>
        </div>
        <div>
          <span className="block text-canvas/55">Work location</span>
          <strong className="mt-1 block font-medium">{profile.workLocation ?? 'Not set'}</strong>
        </div>
        <div className="hidden sm:block">
          <span className="block text-canvas/55">Joined</span>
          <strong className="mt-1 block font-medium">
            {profile.startDate
              ? toDate(profile.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'Not set'}
          </strong>
        </div>
      </div>
    </div>
  )
}
