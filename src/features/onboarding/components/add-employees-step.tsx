import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { EmployeeCsvImport } from './employee-csv-import'
import { EmployeeListTable } from './employee-list-table'
import { EmployeeManualForm } from './employee-manual-form'
import type { EmployeeDraft, NewEmployeeDraft } from '../types/onboarding-types'

type EntryMode = 'manual' | 'csv'

export function AddEmployeesStep({
  employees,
  currency,
  onAdd,
  onAddMany,
  onRemove,
  onNext,
  onBack,
}: {
  employees: EmployeeDraft[]
  currency: string
  onAdd: (employee: NewEmployeeDraft) => void
  onAddMany: (employees: NewEmployeeDraft[]) => void
  onRemove: (id: string) => void
  onNext: () => void
  onBack: () => void
}) {
  const [mode, setMode] = useState<EntryMode>('manual')

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink">Add your first employee</h1>
      <p className="mt-1 text-sm text-muted">
        This is the fastest way to see payroll and people ops in action — add employees one at a time or import a
        CSV.
      </p>

      <div className="mt-6 inline-flex rounded-lg border border-line bg-surface p-1">
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'manual' ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
          }`}
        >
          Add manually
        </button>
        <button
          type="button"
          onClick={() => setMode('csv')}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === 'csv' ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
          }`}
        >
          Upload CSV
        </button>
      </div>

      <div className="mt-6">
        {mode === 'manual' ? (
          <EmployeeManualForm currency={currency} existingEmployees={employees} onAdd={onAdd} />
        ) : (
          <EmployeeCsvImport existingEmployees={employees} onImport={onAddMany} />
        )}
      </div>

      <div className="mt-8">
        <p className="mb-2 text-sm font-medium text-ink">
          {employees.length} employee{employees.length === 1 ? '' : 's'} added
        </p>
        <EmployeeListTable employees={employees} currency={currency} onRemove={onRemove} />
      </div>

      {employees.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Add at least one employee to continue.</p>
      ) : null}

      <div className="mt-8 flex gap-3">
        <Button type="button" variant="secondary" onClick={onBack} className="w-auto px-6">
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={employees.length === 0}>
          Continue
        </Button>
      </div>
    </div>
  )
}
