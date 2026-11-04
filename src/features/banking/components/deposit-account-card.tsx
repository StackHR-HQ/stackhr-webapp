import { ArrowsClockwiseIcon, CopyIcon } from '@phosphor-icons/react'
import { Card, CardHeader } from '../../../components/ui/card'
import { getApiErrorMessage } from '../../../lib/http'
import { notify } from '../../../lib/toast'
import { formatAmount } from '../../payroll/lib/format'
import type { DepositAccount } from '../api/banking-api'
import { useDepositAccount, useSyncDepositAccount } from '../hooks/use-banks'

const updatedLabel = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

async function copyAccountNumber(accountNumber: string) {
  try {
    await navigator.clipboard.writeText(accountNumber)
    notify.success('Account number copied')
  } catch {
    notify.error("Couldn't copy the account number")
  }
}

export function RefreshBalanceButton() {
  const sync = useSyncDepositAccount()
  return (
    <button
      type="button"
      onClick={() =>
        sync.mutate(undefined, {
          onError: (err) => notify.error("Couldn't refresh the balance", getApiErrorMessage(err)),
        })
      }
      disabled={sync.isPending}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-50"
    >
      <ArrowsClockwiseIcon className={`h-3.5 w-3.5 ${sync.isPending ? 'animate-spin' : ''}`} />
      Refresh balance
    </button>
  )
}

export function AccountDetails({ account }: { account: DepositAccount }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-2xl font-medium text-ink">{formatAmount(account.balance, account.currency)}</p>
        <p className="text-xs text-muted">Balance as of {updatedLabel(account.updatedAt)}</p>
      </div>
      <div className="rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm">
        <p className="text-xs text-muted">Fund it by bank transfer to</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-base font-medium tracking-wide text-ink">{account.accountNumber}</span>
          <button
            type="button"
            onClick={() => copyAccountNumber(account.accountNumber)}
            aria-label="Copy account number"
            className="rounded-md p-1 text-muted hover:bg-surface-2 hover:text-ink"
          >
            <CopyIcon className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-ink">
          {account.bankName} · {account.accountName}
        </p>
      </div>
    </div>
  )
}

// Where payroll, reimbursements and salary advances are paid from.
export function DepositAccountCard() {
  const account = useDepositAccount()

  return (
    <Card>
      <CardHeader title="Company account" action={account.data ? <RefreshBalanceButton /> : undefined} />
      <p className="-mt-2 mb-4 text-xs text-muted">Salaries, reimbursements and salary advances are paid from here.</p>
      {account.isPending ? (
        <div className="h-28 animate-pulse rounded-lg bg-canvas" />
      ) : account.isError ? (
        <p className="text-sm text-muted">
          Couldn&apos;t load the company account: {getApiErrorMessage(account.error)}{' '}
          <button type="button" onClick={() => account.refetch()} className="font-medium text-accent hover:underline">
            Try again
          </button>
        </p>
      ) : (
        <AccountDetails account={account.data} />
      )}
    </Card>
  )
}
