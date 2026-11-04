import { CheckCircleIcon, LinkBreakIcon } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Button } from '../../../../components/ui/button'
import { Card, CardHeader } from '../../../../components/ui/card'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { Modal } from '../../../../components/ui/modal'
import { TextField } from '../../../../components/ui/text-field'
import { notify } from '../../../../lib/toast'
import type { EmployerValidation, PenCentralEmployer } from '../../api/pension-api'
import { useAttachEmployer, useRevokeEmployer, useValidateEmployer } from '../../hooks/use-pension'
import { pensionErrorMessage } from '../../lib/pension-status'
import { formatDate } from '../../lib/format'

// PenCom employer codes look like PR0000126311.
const EMPLOYER_CODE = /^[A-Z]{2}\d{6,}$/

export function PenCentralConnectionCard({ employer }: { employer: PenCentralEmployer }) {
  return employer.isAttached ? <ConnectedEmployer employer={employer} /> : <ConnectEmployer />
}

function ConnectedEmployer({ employer }: { employer: PenCentralEmployer }) {
  const [confirming, setConfirming] = useState(false)
  const revoke = useRevokeEmployer()

  const disconnect = async () => {
    try {
      await revoke.mutateAsync()
      notify.success('Disconnected from PenCentral')
      setConfirming(false)
    } catch (err) {
      notify.error("Couldn't disconnect from PenCentral", pensionErrorMessage(err))
    }
  }

  return (
    <Card>
      <CardHeader
        title="PenCentral"
        description="Pension remittances are filed and paid through PenCentral."
        action={
          <Button variant="secondary" width="fit" className="gap-1.5 px-3 py-1.5" onClick={() => setConfirming(true)}>
            <LinkBreakIcon className="h-3.5 w-3.5" />
            Disconnect
          </Button>
        }
      />
      <div className="flex items-start gap-3">
        <CheckCircleIcon size={20} weight="fill" className="mt-0.5 shrink-0 text-positive" />
        <div className="min-w-0 text-sm">
          <p className="font-medium text-ink">{employer.employerName ?? 'Connected employer'}</p>
          <p className="text-muted">
            Employer code {employer.employerCode ?? '—'}
            {employer.attachedAt ? ` · connected ${formatDate(employer.attachedAt)}` : ''}
          </p>
        </div>
      </div>

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Disconnect from PenCentral">
        <div className="space-y-5">
          <p className="text-sm text-muted">
            StackHR will lose access to {employer.employerName ?? 'this employer'} on PenCentral, and you won&apos;t be
            able to file or pay pension remittances until you connect again. Schedules already submitted aren&apos;t
            affected.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" width="fit" className="px-6" onClick={() => setConfirming(false)}>
              Stay connected
            </Button>
            <Button type="button" width="fit" className="px-6" loading={revoke.isPending} onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}

// Two steps: check the code with PenCom, then confirm the company it belongs to.
function ConnectEmployer() {
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string>()
  const [validation, setValidation] = useState<EmployerValidation | null>(null)
  const [error, setError] = useState<string>()
  const validate = useValidateEmployer()
  const attach = useAttachEmployer()

  const check = async (event: FormEvent) => {
    event.preventDefault()
    setError(undefined)
    const employerCode = code.trim().toUpperCase()
    if (!EMPLOYER_CODE.test(employerCode)) {
      setCodeError('Enter your PenCom employer code, e.g. PR0000126311')
      return
    }
    setCodeError(undefined)
    try {
      setValidation(await validate.mutateAsync(employerCode))
    } catch (err) {
      setError(pensionErrorMessage(err))
    }
  }

  const connect = async () => {
    if (!validation) return
    setError(undefined)
    // The check is only good for 30 minutes.
    if (new Date(validation.expiresAt).getTime() < Date.now()) {
      setValidation(null)
      setError('That check has expired. Check the code again to continue.')
      return
    }
    try {
      await attach.mutateAsync(validation.validationId)
      notify.success(`Connected ${validation.employerName} to PenCentral`)
    } catch (err) {
      setError(pensionErrorMessage(err))
    }
  }

  return (
    <Card>
      <CardHeader
        title="Connect PenCentral"
        description="Link your company's PenCom employer code to file and pay pension remittances from StackHR."
      />
      {error ? (
        <div className="mb-4">
          <FormErrorBanner message={error} />
        </div>
      ) : null}

      {validation ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm">
            <p className="text-muted">PenCom has this code registered to</p>
            <p className="mt-0.5 font-medium text-ink">{validation.employerName}</p>
            <p className="text-xs text-muted">Employer code {validation.employerCode}</p>
          </div>
          <p className="text-sm text-muted">
            Is this your company? Connecting gives StackHR access to it on PenCentral.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" width="fit" className="px-5" onClick={() => setValidation(null)}>
              Use a different code
            </Button>
            <Button type="button" width="fit" className="px-5" loading={attach.isPending} onClick={connect}>
              Connect {validation.employerName}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={check} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="sm:w-72">
            <TextField
              id="employerCode"
              label="PenCom employer code"
              placeholder="PR0000126311"
              autoComplete="off"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              error={codeError}
            />
          </div>
          <Button type="submit" width="fit" className="px-5 sm:mt-[26px]" loading={validate.isPending}>
            Check code
          </Button>
        </form>
      )}
    </Card>
  )
}
