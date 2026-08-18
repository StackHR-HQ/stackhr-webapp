import { useState } from 'react'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { formatDate } from '../../lib/format'
import { INVITATION_STATUS_META, ROLE_META } from '../../lib/status-meta'
import type { Invitation, Role } from '../../types/team-access-types'

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
]

export function InvitationsView({ initialInvitations }: { initialInvitations: Invitation[] }) {
  const [invitations, setInvitations] = useState(initialInvitations)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('employee')

  function handleInvite() {
    if (!fullName.trim() || !email.trim()) return

    setInvitations((prev) => [
      {
        id: `inv-${Date.now()}`,
        email: email.trim(),
        fullName: fullName.trim(),
        role,
        invitedBy: 'You',
        invitedAt: new Date().toISOString(),
        status: 'pending',
      },
      ...prev,
    ])
    setFullName('')
    setEmail('')
    setRole('employee')
  }

  function resend(id: string) {
    setInvitations((prev) =>
      prev.map((invitation) =>
        invitation.id === id ? { ...invitation, status: 'pending', invitedAt: new Date().toISOString() } : invitation,
      ),
    )
  }

  function revoke(id: string) {
    setInvitations((prev) => prev.filter((invitation) => invitation.id !== id))
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader title="Invite a team member" />
        <div className="space-y-4">
          <TextField label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
          />
          <SelectField
            label="Role"
            options={ROLE_OPTIONS}
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          />
          <button
            type="button"
            onClick={handleInvite}
            disabled={!fullName.trim() || !email.trim()}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Send invitation
          </button>
        </div>
      </Card>

      <div className="lg:col-span-2">
        {invitations.length > 0 ? (
          <div className="overflow-x-auto rounded-panel border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Invitee</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Invited</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {invitations.map((invitation) => {
                  const statusMeta = INVITATION_STATUS_META[invitation.status]
                  return (
                    <tr key={invitation.id} className="bg-canvas">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{invitation.fullName}</p>
                        <p className="text-xs text-muted">{invitation.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={ROLE_META[invitation.role].tone}>{ROLE_META[invitation.role].label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {formatDate(invitation.invitedAt)} · {invitation.invitedBy}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          {invitation.status === 'expired' ? (
                            <button
                              type="button"
                              onClick={() => resend(invitation.id)}
                              className="text-xs font-medium text-accent hover:underline"
                            >
                              Resend
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => revoke(invitation.id)}
                            className="text-xs font-medium text-critical hover:underline"
                          >
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
            No pending invitations.
          </p>
        )}
      </div>
    </div>
  )
}
