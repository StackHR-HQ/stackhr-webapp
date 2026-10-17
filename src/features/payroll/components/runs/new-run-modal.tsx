import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../../../../components/ui/button'
import { Modal } from '../../../../components/ui/modal'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { useCreatePayrollRun } from '../../hooks/use-payroll-run-actions'

const MONTHS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: new Date(2000, index, 1).toLocaleDateString('en-GB', { month: 'long' }),
}))

const defaultTitle = (month: number, year: number) => `${MONTHS[month - 1].label} ${year} Regular Payroll`

export function NewRunModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const createRun = useCreatePayrollRun()
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year, setYear] = useState(today.getFullYear())
  // Follows the period until the admin types their own.
  const [title, setTitle] = useState<string | null>(null)

  const years = [-1, 0, 1].map((offset) => {
    const value = String(today.getFullYear() + offset)
    return { value, label: value }
  })

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const id = await createRun.mutateAsync({
        periodMonth: month,
        periodYear: year,
        title: title?.trim() || defaultTitle(month, year),
      })
      notify.success('Payroll run created')
      onClose()
      navigate(`/payroll/runs/${id}`)
    } catch (err) {
      notify.error("Couldn't create the payroll run", getApiErrorMessage(err))
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New payroll run">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label="Month"
            options={MONTHS}
            value={String(month)}
            onChange={(event) => setMonth(Number(event.target.value))}
          />
          <SelectField
            label="Year"
            options={years}
            value={String(year)}
            onChange={(event) => setYear(Number(event.target.value))}
          />
        </div>
        <TextField
          label="Title"
          value={title ?? defaultTitle(month, year)}
          onChange={(event) => setTitle(event.target.value)}
          hint="The run starts as a draft. Calculate it next to work out everyone's pay."
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" width="fit" className="px-4" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" width="fit" className="px-4" loading={createRun.isPending}>
            Create run
          </Button>
        </div>
      </form>
    </Modal>
  )
}
