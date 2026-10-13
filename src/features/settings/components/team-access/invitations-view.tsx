import { useState } from 'react'
import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { useInviteMember, useResendInvitation, useRevokeInvitation } from '../../hooks/use-invitations'
import { formatDate } from '../../lib/format'
import { INVITATION_STATUS_META, ROLE_META } from '../../lib/status-meta'
import type { Invitation, Role } from '../../types/team-access-types'

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
]

export function InvitationsView({ invitations }: { invitations: Invitation[] }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('employee')
  const inviteMember = useInviteMember()
  const resendInvitation = useResendInvitation()
  const revokeInvitation = useRevokeInvitation()

  async function handleInvite() {
    const trimmed = email.trim()
    if (!trimmed) return
    try {
      await inviteMember.mutateAsync({ email: trimmed, role })
      notify.success('Invitation sent', `We've emailed ${trimmed} a link to join.`)
      setEmail('')
      setRole('employee')
    } catch (err) {
      notify.error("Couldn't send the invitation", getApiErrorMessage(err))
    }
  }

  async function resend(id: string) {
    try {
      await resendInvitation.mutateAsync(id)
      notify.success('Invitation resent')
    } catch (err) {
      notify.error("Couldn't resend the invitation", getApiErrorMessage(err))
    }
  }

  async function revoke(id: string) {
    try {
      await revokeInvitation.mutateAsync(id)
      notify.success('Invitation revoked')
    } catch (err) {
      notify.error("Couldn't revoke the invitation", getApiErrorMessage(err))
    }
  }

  const busy = resendInvitation.isPending || revokeInvitation.isPending

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader title="Invite a team member" />
        <div className="space-y-4">
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
            disabled={!email.trim() || inviteMember.isPending}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {inviteMember.isPending ? 'Sending…' : 'Send invitation'}
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
                        <p className="font-medium text-ink">{invitation.fullName ?? invitation.email}</p>
                        {invitation.fullName ? <p className="text-xs text-muted">{invitation.email}</p> : null}
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
                          <button
                            type="button"
                            onClick={() => resend(invitation.id)}
                            disabled={busy}
                            className="text-xs font-medium text-accent hover:underline disabled:opacity-50"
                          >
                            Resend
                          </button>
                          <button
                            type="button"
                            onClick={() => revoke(invitation.id)}
                            disabled={busy}
                            className="text-xs font-medium text-critical hover:underline disabled:opacity-50"
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
