import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '../../../components/ui/button'
import { EMPLOYMENT_TYPES } from '../constants/onboarding-options'
import { buildSampleEmployeeCsv } from '../lib/employee-helpers'
import { type CsvRowDraft, parseEmployeeCsv } from '../lib/parse-employee-csv'
import { employeeCsvRowSchema } from '../schemas/employee-schema'
import type { EmployeeDraft, NewEmployeeDraft } from '../types/onboarding-types'

interface RowState {
  key: string
  values: CsvRowDraft
  errors: Partial<Record<keyof CsvRowDraft, string>>
  valid: boolean
  include: boolean
}

const EDITABLE_FIELDS: Array<{ field: keyof CsvRowDraft; label: string }> = [
  { field: 'fullName', label: 'Name' },
  { field: 'email', label: 'Email' },
  { field: 'department', label: 'Department' },
  { field: 'jobTitle', label: 'Role' },
  { field: 'employmentType', label: 'Type' },
  { field: 'salary', label: 'Salary' },
  { field: 'startDate', label: 'Start date' },
  { field: 'managerName', label: 'Manager' },
]

function validateRow(values: CsvRowDraft, isDuplicateEmail: boolean): RowState['errors'] {
  const result = employeeCsvRowSchema.safeParse(values)
  const errors: RowState['errors'] = {}
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof CsvRowDraft
      if (!errors[field]) errors[field] = issue.message
    }
  }
  if (!errors.email && values.email && isDuplicateEmail) {
    errors.email = 'Duplicate email'
  }
  return errors
}

function revalidateAll(rows: RowState[], existingEmails: Set<string>): RowState[] {
  const emailCounts = new Map<string, number>()
  for (const row of rows) {
    const email = row.values.email.trim().toLowerCase()
    if (email) emailCounts.set(email, (emailCounts.get(email) ?? 0) + 1)
  }

  return rows.map((row) => {
    const email = row.values.email.trim().toLowerCase()
    const isDuplicateEmail = email ? (emailCounts.get(email) ?? 0) > 1 || existingEmails.has(email) : false
    const errors = validateRow(row.values, isDuplicateEmail)
    const valid = Object.keys(errors).length === 0
    return { ...row, errors, valid, include: valid && row.include }
  })
}

function downloadSampleCsv() {
  const blob = new Blob([buildSampleEmployeeCsv()], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'stackhr-employees-sample.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function EmployeeCsvImport({
  existingEmployees,
  onImport,
}: {
  existingEmployees: EmployeeDraft[]
  onImport: (employees: NewEmployeeDraft[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<RowState[] | null>(null)
  const [missingColumns, setMissingColumns] = useState<string[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  const existingEmails = new Set(existingEmployees.map((employee) => employee.email.toLowerCase()))

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setFileError('Please upload a .csv file.')
      return
    }

    const text = await file.text()
    const parsed = parseEmployeeCsv(text)
    setFileError(null)
    setMissingColumns(parsed.missingColumns)

    const initialRows: RowState[] = parsed.rows.map((values) => ({
      key: values.key,
      values,
      errors: {},
      valid: false,
      include: true,
    }))
    setRows(revalidateAll(initialRows, existingEmails))
  }

  function updateRow(key: string, field: keyof CsvRowDraft, value: string) {
    setRows((current) => {
      if (!current) return current
      const next = current.map((row) => (row.key === key ? { ...row, values: { ...row.values, [field]: value } } : row))
      return revalidateAll(next, existingEmails)
    })
  }

  function toggleInclude(key: string) {
    setRows((current) =>
      current
        ? current.map((row) => (row.key === key && row.valid ? { ...row, include: !row.include } : row))
        : current,
    )
  }

  function removeRow(key: string) {
    setRows((current) => (current ? revalidateAll(current.filter((row) => row.key !== key), existingEmails) : current))
  }

  function resetImport() {
    setRows(null)
    setMissingColumns([])
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validCount = rows?.filter((row) => row.valid).length ?? 0
  const includedCount = rows?.filter((row) => row.include).length ?? 0

  function handleImport() {
    if (!rows) return
    const employees: NewEmployeeDraft[] = rows
      .filter((row) => row.valid && row.include)
      .map((row) => ({
        fullName: row.values.fullName,
        email: row.values.email,
        department: row.values.department,
        jobTitle: row.values.jobTitle,
        employmentType: EMPLOYMENT_TYPES.find((type) => type.toLowerCase() === row.values.employmentType.toLowerCase()) ?? row.values.employmentType,
        salary: Number(row.values.salary),
        startDate: row.values.startDate,
        managerName: row.values.managerName || undefined,
        source: 'csv',
      }))
    onImport(employees)
    resetImport()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-panel border border-dashed border-line bg-surface p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          className="text-sm text-ink file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-ink"
        />
        <button type="button" onClick={downloadSampleCsv} className="text-sm text-accent hover:underline">
          Download sample CSV
        </button>
      </div>
      {fileError ? <p className="mt-2 text-sm text-critical">{fileError}</p> : null}

      {rows && rows.length > 0 ? (
        <div className="mt-5">
          {missingColumns.length > 0 ? (
            <div className="mb-3 rounded-lg border border-critical/30 bg-critical/10 p-3 text-sm text-critical">
              Missing expected columns: {missingColumns.join(', ')}. Rows using those fields will show as invalid
              below — fix your file and re-upload, or edit the cells directly.
            </div>
          ) : null}

          <div className="overflow-x-auto rounded-panel border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">Import</th>
                  {EDITABLE_FIELDS.map(({ field, label }) => (
                    <th key={field} className="px-3 py-2 font-medium">
                      {label}
                    </th>
                  ))}
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr key={row.key} className={row.valid ? undefined : 'bg-critical/5'}>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="checkbox"
                        checked={row.include}
                        disabled={!row.valid}
                        onChange={() => toggleInclude(row.key)}
                        className="h-4 w-4 rounded border-line text-accent focus:ring-2 focus:ring-accent/40 disabled:opacity-40"
                      />
                    </td>
                    {EDITABLE_FIELDS.map(({ field }) => (
                      <td key={field} className="px-3 py-2 align-top">
                        {field === 'employmentType' ? (
                          <select
                            value={
                              EMPLOYMENT_TYPES.find((type) => type.toLowerCase() === row.values.employmentType.toLowerCase()) ??
                              ''
                            }
                            onChange={(e) => updateRow(row.key, field, e.target.value)}
                            className={`w-full min-w-[7rem] rounded border bg-canvas px-2 py-1 text-xs text-ink ${
                              row.errors[field] ? 'border-critical' : 'border-line'
                            }`}
                          >
                            <option value="" disabled>
                              Select
                            </option>
                            {EMPLOYMENT_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field === 'startDate' ? 'date' : 'text'}
                            value={row.values[field]}
                            onChange={(e) => updateRow(row.key, field, e.target.value)}
                            className={`w-full min-w-[7rem] rounded border bg-canvas px-2 py-1 text-xs text-ink ${
                              row.errors[field] ? 'border-critical' : 'border-line'
                            }`}
                          />
                        )}
                        {row.errors[field] ? <p className="mt-1 text-xs text-critical">{row.errors[field]}</p> : null}
                      </td>
                    ))}
                    <td className="px-3 py-2 align-top">
                      <button type="button" onClick={() => removeRow(row.key)} className="text-xs text-critical hover:underline">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {validCount} of {rows.length} rows valid · {includedCount} selected for import
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={resetImport} className="w-auto px-4">
                Discard
              </Button>
              <Button type="button" onClick={handleImport} disabled={includedCount === 0} className="w-auto px-4">
                Import {includedCount} employee{includedCount === 1 ? '' : 's'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
