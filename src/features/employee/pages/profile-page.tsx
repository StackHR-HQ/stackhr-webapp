import { LockKey, PencilSimple, ShieldCheck } from '@phosphor-icons/react'
import { useState } from 'react'
import { Avatar } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'
import { Modal } from '../../../components/ui/modal'
import { formatAmount } from '../../dashboard/lib/format'
import { EditProfileForm } from '../components/edit-profile-form'
import { useMyProfile } from '../hooks/use-my-profile'
import { formatLongDate, humanizeEnum, initials, statusLabel } from '../lib/profile-format'
import type { MyProfile } from '../types/employee-types'

type Detail = readonly [label: string, value: string | null]

const NOT_SET = '—'

function joined(...parts: (string | null | undefined)[]): string | null {
  const present = parts.filter(Boolean)
  return present.length ? present.join(' · ') : null
}

function personalDetails(profile: MyProfile): Detail[] {
  return [
    ['Full name', profile.fullName],
    ['Date of birth', profile.dateOfBirth && formatLongDate(profile.dateOfBirth)],
    ['Gender', profile.gender && humanizeEnum(profile.gender).replace(/-/g, ' ')],
    ['Marital status', profile.maritalStatus && humanizeEnum(profile.maritalStatus).replace(/-/g, ' ')],
    ['Nationality', profile.nationality],
    ['Phone', profile.phone],
    ['Email', profile.personalEmail ?? profile.email],
    ['Address', profile.address],
    [
      'Emergency contact',
      joined(profile.emergencyContactName, profile.emergencyContactRelationship, profile.emergencyContactPhone),
    ],
    ['Bank account', joined(profile.bankName, profile.bankAccountLast4 && `•••• ${profile.bankAccountLast4}`)],
    ['Tax ID (TIN)', profile.tin],
    ['Pension', joined(profile.pensionProvider, profile.pensionRsaNumber)],
  ]
}

function employmentDetails(profile: MyProfile): Detail[] {
  return [
    ['Employee ID', profile.employeeNumber],
    ['Job title', profile.jobTitle],
    ['Department', profile.department],
    ['Employment type', profile.employmentType && humanizeEnum(profile.employmentType)],
    ['Employment date', profile.startDate && formatLongDate(profile.startDate)],
    ['Manager', profile.manager?.fullName ?? null],
    ['Work location', profile.workLocation],
    ['Employment status', statusLabel(profile.employmentStatus)],
  ]
}

function compensationDetails(profile: MyProfile): Detail[] {
  return [
    [
      'Salary',
      profile.annualSalaryMinor
        ? `${formatAmount(profile.annualSalaryMinor / 100, profile.currency ?? 'NGN')} / year`
        : null,
    ],
    ['Pay frequency', profile.payFrequency && humanizeEnum(profile.payFrequency)],
    // Allowances and the salary effective date aren't returned by the backend yet.
    ['Allowances', null],
    ['Effective date', null],
  ]
}

function DetailList({ items, positiveStatus }: { items: Detail[]; positiveStatus?: boolean }) {
  return (
    <dl className="divide-y divide-line">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-1 py-3 sm:grid-cols-[minmax(9rem,0.8fr)_1.4fr] sm:gap-4">
          <dt className="text-xs text-muted">{label}</dt>
          <dd
            className={
              !value
                ? 'text-sm text-muted'
                : positiveStatus && label === 'Employment status'
                  ? 'text-sm font-medium text-positive'
                  : 'text-sm text-ink'
            }
          >
            {value || NOT_SET}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function MyProfilePage() {
  const { data: profile, isPending, isError, refetch } = useMyProfile()
  const [editing, setEditing] = useState(false)

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-8">
      <header className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">Employee record</p>
          <h1 className="text-3xl font-medium tracking-tight text-ink">My profile</h1>
          <p className="mt-2 text-sm text-muted">
            Keep your personal details current. Employment and pay information is managed by HR.
          </p>
        </div>
        <Button
          variant="secondary"
          width="fit"
          className="gap-2"
          disabled={!profile}
          onClick={() => setEditing(true)}
        >
          <PencilSimple size={16} />
          Edit
        </Button>
      </header>

      {isPending ? (
        <div className="space-y-6">
          <div className="h-28 animate-pulse rounded-panel bg-surface" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-panel bg-surface" />
            <div className="h-96 animate-pulse rounded-panel bg-surface" />
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
          <p className="text-sm font-medium text-ink">Couldn't load your profile</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-medium text-accent hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <section className="rounded-panel border border-line bg-surface p-6 shadow-panel sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar initials={initials(profile.fullName) || '?'} size="lg" className="bg-ink text-canvas" />
              <div>
                <h2 className="text-xl font-medium text-ink">{profile.fullName}</h2>
                {joined(profile.jobTitle, profile.department) ? (
                  <p className="mt-1 text-sm text-muted">{joined(profile.jobTitle, profile.department)}</p>
                ) : null}
                <p className="mt-2 text-xs text-muted">Profile photo and personal details can be updated by you.</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-panel border border-line bg-surface p-6 shadow-panel">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-medium text-ink">Personal information</h2>
                  <p className="mt-1 text-xs text-muted">Details you can update yourself.</p>
                </div>
                <button type="button" onClick={() => setEditing(true)} aria-label="Edit personal details">
                  <PencilSimple size={19} className="text-accent" />
                </button>
              </div>
              <DetailList items={personalDetails(profile)} />
            </section>

            <section className="rounded-panel border border-line bg-surface p-6 shadow-panel">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-medium text-ink">Employment</h2>
                  <p className="mt-1 text-xs text-muted">Controlled by your organisation.</p>
                </div>
                <ShieldCheck size={20} className="text-muted" />
              </div>
              <DetailList
                items={employmentDetails(profile)}
                positiveStatus={profile.employmentStatus === 'ACTIVE'}
              />
            </section>
          </div>

          <section className="rounded-panel border border-line bg-surface p-6 shadow-panel sm:p-7">
            <div className="flex flex-col justify-between gap-3 border-b border-line pb-5 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-medium text-ink">Compensation</h2>
                <p className="mt-1 text-xs text-muted">Visible to you, but managed by HR and payroll.</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs text-muted">
                <LockKey size={14} /> Restricted access
              </span>
            </div>
            <div className="grid gap-x-8 sm:grid-cols-2">
              <DetailList items={compensationDetails(profile).slice(0, 2)} />
              <DetailList items={compensationDetails(profile).slice(2)} />
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <div>
                <p className="text-sm font-medium text-ink">Compensation history</p>
                <p className="mt-1 text-xs text-muted">Your salary history isn't available yet.</p>
              </div>
              <button type="button" disabled className="text-sm font-medium text-accent disabled:opacity-50">
                View history
              </button>
            </div>
          </section>

          <Modal open={editing} onClose={() => setEditing(false)} title="Edit personal details">
            <EditProfileForm profile={profile} onDone={() => setEditing(false)} />
          </Modal>
        </>
      )}
    </div>
  )
}
