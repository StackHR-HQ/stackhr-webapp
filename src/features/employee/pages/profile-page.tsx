import { LockKey, PencilSimple, ShieldCheck } from '@phosphor-icons/react'
import { useState } from 'react'
import { Avatar } from '../../../components/ui/avatar'
import { Button } from '../../../components/ui/button'

const personalDetails = [
  ['Full name', 'Alex Rivera'],
  ['Date of birth', '14 March 1994'],
  ['Gender', 'Prefer not to say'],
  ['Phone', '+81 90 1234 5678'],
  ['Email', 'alex.rivera@stackhr.com'],
  ['Address', '2-14-8 Shibuya, Tokyo 150-0002'],
  ['Emergency contact', 'Jordan Rivera · +81 90 8765 4321'],
] as const

const employmentDetails = [
  ['Employee ID', 'STK-00428'],
  ['Job title', 'Product Designer'],
  ['Department', 'Product Design'],
  ['Employment type', 'Full-time'],
  ['Employment date', '18 April 2022'],
  ['Manager', 'Maya Chen'],
  ['Work location', 'Tokyo, Japan'],
  ['Employment status', 'Active'],
] as const

const compensationDetails = [
  ['Salary', '¥7,200,000 / year'],
  ['Pay frequency', 'Monthly'],
  ['Allowances', '¥35,000 transport / month'],
  ['Effective date', '01 April 2026'],
] as const

function DetailList({ items, status }: { items: readonly (readonly [string, string])[]; status?: boolean }) {
  return <dl className="divide-y divide-line">{items.map(([label, value]) => <div key={label} className="grid gap-1 py-3 sm:grid-cols-[minmax(9rem,0.8fr)_1.4fr] sm:gap-4"><dt className="text-xs text-muted">{label}</dt><dd className={status && label === 'Employment status' ? 'text-sm font-medium text-positive' : 'text-sm text-ink'}>{value}</dd></div>)}</dl>
}

export function MyProfilePage() {
  const [editing, setEditing] = useState(false)

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-8">
      <header className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted">Employee record</p>
          <h1 className="text-3xl font-medium tracking-tight text-ink">My profile</h1>
          <p className="mt-2 text-sm text-muted">Keep your personal details current. Employment and pay information is managed by HR.</p>
        </div>
        <Button variant="secondary" className="w-auto gap-2" onClick={() => setEditing((value) => !value)}><PencilSimple size={16} />{editing ? 'Done editing' : 'Edit personal details'}</Button>
      </header>

      <section className="rounded-panel border border-line bg-surface p-6 shadow-panel sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar initials="AR" size="lg" className="bg-ink text-canvas" />
          <div>
            <h2 className="text-xl font-medium text-ink">Alex Rivera</h2>
            <p className="mt-1 text-sm text-muted">Product Designer · Product Design</p>
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
            <PencilSimple size={19} className="text-accent" />
          </div>
          {editing ? (
            <div className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-3 text-sm text-ink">
              Editing is enabled for your personal record. Save changes when finished.
            </div>
          ) : null}
          <DetailList items={personalDetails} />
        </section>
        
        <section className="rounded-panel border border-line bg-surface p-6 shadow-panel">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-ink">Employment</h2>
              <p className="mt-1 text-xs text-muted">Controlled by your organisation.</p>
            </div>
            <ShieldCheck size={20} className="text-muted" />
          </div>
          <DetailList items={employmentDetails} status />
        </section>
      </div>

      <section className="rounded-panel border border-line bg-surface p-6 shadow-panel sm:p-7">
        <div className="flex flex-col justify-between gap-3 border-b border-line pb-5 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-lg font-medium text-ink">Compensation</h2>
            <p className="mt-1 text-xs text-muted">Visible to you, but managed by HR and payroll.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs text-muted">
            <LockKey size={14} /> Restricted access</span>
        </div>
        <div className="grid gap-x-8 sm:grid-cols-2">
          <DetailList items={compensationDetails.slice(0, 2)} />
          <DetailList items={compensationDetails.slice(2)} />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <div>
            <p className="text-sm font-medium text-ink">Compensation history</p>
            <p className="mt-1 text-xs text-muted">Your latest salary update took effect on 01 April 2026.</p>
          </div>
          <button type="button" className="text-sm font-medium text-accent hover:underline">View history</button></div></section>
    </div>

  )
}
