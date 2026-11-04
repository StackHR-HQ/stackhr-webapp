import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type ChangeEvent } from 'react'
import { Button } from '../../../../components/ui/button'
import { FormErrorBanner } from '../../../../components/ui/form-error-banner'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { peopleApi } from '../../api/people-api'
import type { EmployeeImportResult } from '../../types/people-types'

// The columns POST /onboarding/employees/import expects, in this order.
const COLUMNS = ['fullName', 'email', 'department', 'jobTitle', 'employmentType', 'salary', 'startDate']
const TEMPLATE = `${COLUMNS.join(',')}\nAda Okafor,ada@yourcompany.com,Engineering,Software Engineer,FULL_TIME,500000,2026-01-01\n`
const MAX_BYTES = 1024 * 1024

function downloadTemplate() {
  const url = URL.createObjectURL(new Blob([TEMPLATE], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'stackhr-employee-import-template.csv'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Checks the header before anything is sent; returns the number of data rows.
function checkCsv(text: string): { rows: number } | { error: string } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
  if (lines.length < 2) return { error: 'The file has no employee rows.' }
  const header = lines[0].split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''))
  const missing = COLUMNS.filter((column) => !header.includes(column))
  if (missing.length) return { error: `The file is missing these columns: ${missing.join(', ')}.` }
  return { rows: lines.length - 1 }
}

export function ImportEmployeesForm({ onDone }: { onDone: () => void }) {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<{ name: string; text: string; rows: number } | null>(null)
  const [error, setError] = useState<string>()
  const [result, setResult] = useState<EmployeeImportResult | null>(null)
  const importEmployees = useMutation({
    mutationFn: (csv: string) => peopleApi.importEmployees(csv),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people'] }),
  })

  async function choose(event: ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0]
    event.target.value = ''
    setError(undefined)
    setFile(null)
    if (!chosen) return
    if (chosen.size > MAX_BYTES) {
      setError('The file is larger than 1 MB. Split it into smaller files.')
      return
    }
    const text = await chosen.text()
    const checked = checkCsv(text)
    if ('error' in checked) setError(checked.error)
    else setFile({ name: chosen.name, text, rows: checked.rows })
  }

  async function submit() {
    if (!file) return
    setError(undefined)
    try {
      const imported = await importEmployees.mutateAsync(file.text)
      setResult(imported)
      if (imported.errors.length === 0) notify.success('Employees imported')
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink">
          {result.imported != null
            ? `${result.imported} ${result.imported === 1 ? 'employee was' : 'employees were'} added.`
            : 'The file was imported.'}
        </p>
        {result.errors.length > 0 ? (
          <div className="rounded-lg border border-critical/40 bg-critical/5 px-3 py-2.5 text-sm">
            <p className="font-medium text-critical">
              {result.errors.length} {result.errors.length === 1 ? 'row was' : 'rows were'} skipped
            </p>
            <ul className="mt-1.5 max-h-40 list-disc space-y-0.5 overflow-y-auto pl-5 text-ink">
              {result.errors.map((line, index) => (
                <li key={`${index}-${line}`}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="flex justify-end">
          <Button type="button" width="fit" className="px-6" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Add several employees at once from a CSV file with the columns{' '}
        <span className="font-medium text-ink">{COLUMNS.join(', ')}</span>. Write salary in naira without commas,
        dates as YYYY-MM-DD, and employment type as FULL_TIME, PART_TIME, CONTRACT or INTERN.{' '}
        <button type="button" onClick={downloadTemplate} className="font-medium text-accent hover:underline">
          Download the template
        </button>
      </p>

      {error ? <FormErrorBanner message={error} /> : null}

      <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-line px-4 py-6 text-center text-sm hover:bg-surface">
        <span className="font-medium text-ink">{file ? file.name : 'Choose a CSV file'}</span>
        <span className="text-muted">
          {file ? `${file.rows} ${file.rows === 1 ? 'employee' : 'employees'} found` : 'Up to 1 MB'}
        </span>
        <input type="file" accept=".csv,text/csv" className="sr-only" onChange={choose} />
      </label>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" width="fit" className="px-6" onClick={onDone}>
          Cancel
        </Button>
        <Button type="button" width="fit" className="px-6" disabled={!file} loading={importEmployees.isPending} onClick={submit}>
          Import {file ? `${file.rows} ${file.rows === 1 ? 'employee' : 'employees'}` : ''}
        </Button>
      </div>
    </div>
  )
}
