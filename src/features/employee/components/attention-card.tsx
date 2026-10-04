import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { useMyProfile } from '../hooks/use-my-profile'
import type { MyProfile } from '../types/employee-types'

function missingDetails(profile: MyProfile): string[] {
  return [
    (!profile.bankName || !profile.accountNumber) && 'bank details',
    (!profile.emergencyContactName || !profile.emergencyContactPhone) && 'emergency contact',
    !profile.tin && 'tax ID (TIN)',
  ].filter((item): item is string => Boolean(item))
}

function joinList(items: string[]): string {
  return items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}` : items[0]
}

export function AttentionCard() {
  const { data: profile, isPending, isError } = useMyProfile()

  if (isPending) {
    return <div className="min-h-52 animate-pulse rounded-panel border border-accent/25 bg-accent/10 shadow-panel" />
  }

  const missing = isError ? [] : missingDetails(profile)

  return (
    <div className="rounded-panel border border-accent/25 bg-accent/10 p-6 shadow-panel sm:p-7">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-accent">Needs your attention</p>
        {missing.length > 0 ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-medium text-white">
            {missing.length}
          </span>
        ) : null}
      </div>
      {isError ? (
        <p className="mt-3 text-sm text-muted">Couldn't check your profile right now.</p>
      ) : missing.length > 0 ? (
        <>
          <h2 className="mt-3 text-xl font-medium text-ink">Complete your profile</h2>
          <p className="mt-1 text-sm text-muted">Add your {joinList(missing)} to finish setup.</p>
          <Link to="/me/profile" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
            Continue <ArrowRight size={16} />
          </Link>
        </>
      ) : (
        <>
          <h2 className="mt-3 text-xl font-medium text-ink">You're all set</h2>
          <p className="mt-1 text-sm text-muted">Nothing needs your attention right now.</p>
        </>
      )}
    </div>
  )
}
