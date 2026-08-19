import { Badge } from '../../../../components/ui/badge'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatRelativeTime } from '../../../dashboard/lib/format'
import { useRevokeSession } from '../../hooks/use-revoke-session'
import type { SessionInfo } from '../../types/settings-types'

export function SessionsView({ sessions }: { sessions: SessionInfo[] }) {
  const revokeSession = useRevokeSession()

  return (
    <Card>
      <CardHeader title="Sessions" description="Devices currently signed in to your account." />
      <div className="divide-y divide-line">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">
                  {session.device} · {session.browser}
                </p>
                {session.current ? <Badge tone="positive">Current session</Badge> : null}
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {session.location} · {session.ipAddress} · Active {formatRelativeTime(session.lastActiveAt)}
              </p>
            </div>
            {session.current ? null : (
              <button
                type="button"
                onClick={() => revokeSession.mutate(session.id)}
                disabled={revokeSession.isPending}
                className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-critical hover:bg-critical/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
