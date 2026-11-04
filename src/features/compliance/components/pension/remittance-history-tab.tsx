import { CheckCircleIcon, HandCoinsIcon, PaperPlaneTiltIcon, type Icon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Modal } from '../../../../components/ui/modal'
import type { PensionSchedule } from '../../api/pension-api'
import { usePensionComplianceReport, usePensionSchedule, usePensionSchedules } from '../../hooks/use-pension'
import { formatAmount, formatDate } from '../../lib/format'
import { scheduleStatusMeta } from '../../lib/pension-status'
import { NewPensionScheduleForm } from './new-pension-schedule-form'
import { PensionScheduleDetail } from './pension-schedule-detail'

function Tile({ icon: TileIcon, label, count, amount }: { icon: Icon; label: string; count: number; amount: number }) {
  return (
    <div className="rounded-panel border border-line bg-surface p-4 shadow-panel">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
        <TileIcon className="h-4.5 w-4.5 text-ink" />
      </div>
      <div className="mt-3">
        <p className="text-xl font-medium text-ink">{formatAmount(amount, 'NGN')}</p>
        <p className="text-xs text-muted">
          {label} · {count} {count === 1 ? 'schedule' : 'schedules'}
        </p>
      </div>
    </div>
  )
}

// The list and the detail endpoint each return only some fields; keep whatever either has.
function mergeSchedule(listItem: PensionSchedule | undefined, detail: PensionSchedule | undefined) {
  if (!listItem) return detail
  if (!detail) return listItem
  const merged = { ...listItem }
  for (const [key, value] of Object.entries(detail) as [keyof PensionSchedule, unknown][]) {
    if (value != null && value !== 0 && value !== '') Object.assign(merged, { [key]: value })
  }
  return merged
}

export function RemittanceHistoryTab({ connected }: { connected: boolean }) {
  const schedules = usePensionSchedules(true)
  const report = usePensionComplianceReport(connected)
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const detail = usePensionSchedule(openId)

  const existingRunIds = useMemo(
    () => new Set((schedules.data ?? []).flatMap((schedule) => (schedule.payrollRunId ? [schedule.payrollRunId] : []))),
    [schedules.data],
  )
  const open = mergeSchedule(
    schedules.data?.find((schedule) => schedule.id === openId),
    detail.data,
  )

  return (
    <div className="space-y-4">
      {report.data ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Tile icon={PaperPlaneTiltIcon} label="Submitted" {...report.data.submitted} />
          <Tile icon={HandCoinsIcon} label="Paid" {...report.data.paid} />
          <Tile icon={CheckCircleIcon} label="Settled with PFAs" {...report.data.disbursed} />
        </div>
      ) : null}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="max-w-xl text-sm text-muted">
          Each month&apos;s pension remittance, from the payroll run through to the money reaching every PFA.
        </p>
        {connected ? (
          <Button type="button" width="fit" className="px-5" onClick={() => setCreating(true)}>
            New schedule
          </Button>
        ) : null}
      </div>

      {schedules.isPending ? (
        <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
      ) : schedules.isError ? (
        <p className="rounded-panel border border-line bg-surface p-6 text-center text-sm text-muted">
          Couldn&apos;t load remittance schedules.{' '}
          <button type="button" onClick={() => schedules.refetch()} className="font-medium text-accent hover:underline">
            Try again
          </button>
        </p>
      ) : schedules.data.length === 0 ? (
        <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
          {connected
            ? 'No remittance schedules yet. Create one from an approved payroll run.'
            : 'Connect PenCentral above to start filing pension remittances.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-panel border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Employees</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {schedules.data.map((schedule) => {
                const status = scheduleStatusMeta(schedule.status)
                return (
                  <tr
                    key={schedule.id}
                    onClick={() => setOpenId(schedule.id)}
                    className="cursor-pointer bg-canvas transition-colors hover:bg-surface"
                  >
                    <td className="px-4 py-3 font-medium text-ink">{schedule.periodLabel}</td>
                    <td className="px-4 py-3 text-muted">{schedule.employeeCount ?? '—'}</td>
                    <td className="px-4 py-3 text-ink">{formatAmount(schedule.totalAmount, 'NGN')}</td>
                    <td className="px-4 py-3 text-muted">{schedule.createdAt ? formatDate(schedule.createdAt) : '—'}</td>
                    <td className="px-4 py-3">
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="New pension schedule">
        {creating ? (
          <NewPensionScheduleForm
            existingRunIds={existingRunIds}
            onCancel={() => setCreating(false)}
            onCreated={(schedule) => {
              setCreating(false)
              setOpenId(schedule.id)
            }}
          />
        ) : null}
      </Modal>

      <Modal
        open={openId !== null}
        onClose={() => setOpenId(null)}
        title={open ? `Pension remittance · ${open.periodLabel}` : 'Pension remittance'}
      >
        {open ? (
          <PensionScheduleDetail schedule={open} />
        ) : (
          <div className="h-48 animate-pulse rounded-lg bg-canvas" />
        )}
      </Modal>
    </div>
  )
}
