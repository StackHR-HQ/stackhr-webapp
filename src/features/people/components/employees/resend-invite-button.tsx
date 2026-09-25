import { getApiErrorMessage } from '../../../../lib/http'
import { useResendEmployeeInvitation } from '../../hooks/use-resend-employee-invitation'

export function ResendInviteButton({ employeeId }: { employeeId: string }) {
  const resend = useResendEmployeeInvitation()

  if (resend.isSuccess) {
    return <span className="text-sm text-positive">Invite sent</span>
  }

  return (
    <button
      type="button"
      disabled={resend.isPending}
      title={resend.isError ? getApiErrorMessage(resend.error) : undefined}
      onClick={(event) => {
        event.stopPropagation()
        resend.mutate(employeeId)
      }}
      className="text-sm text-accent hover:underline disabled:opacity-50"
    >
      {resend.isPending ? 'Sending…' : resend.isError ? 'Failed, retry' : 'Resend invite'}
    </button>
  )
}
