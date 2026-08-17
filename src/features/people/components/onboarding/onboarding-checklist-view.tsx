import { useState } from 'react'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import type { EmployeeOnboardingRow, OnboardingTemplate } from '../../types/people-types'

function ChecklistCard({ row, template }: { row: EmployeeOnboardingRow; template?: OnboardingTemplate }) {
  const [checked, setChecked] = useState<Set<string>>(new Set(row.completedItemIds))

  if (!template) {
    return (
      <Card>
        <p className="text-sm text-muted">No checklist template found for this employee.</p>
      </Card>
    )
  }

  const stages = Array.from(new Set(template.checklist.map((item) => item.stage)))
  const percent = Math.round((checked.size / template.checklist.length) * 100)

  function toggle(itemId: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }

  return (
    <Card>
      <CardHeader
        title={`${row.employeeName}'s checklist`}
        description={template.name}
        action={<span className="text-sm font-medium text-ink">{percent}% complete</span>}
      />

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
        <div className="h-full rounded-pill bg-accent transition-[width]" style={{ width: `${percent}%` }} />
      </div>

      <div className="space-y-5">
        {stages.map((stage) => (
          <div key={stage}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">{stage}</p>
            <ul className="space-y-2">
              {template.checklist
                .filter((item) => item.stage === stage)
                .map((item) => (
                  <li key={item.id}>
                    <label className="flex items-center gap-2.5 text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={checked.has(item.id)}
                        onChange={() => toggle(item.id)}
                        className="h-4 w-4 rounded border-line text-accent focus:ring-2 focus:ring-accent/40"
                      />
                      <span className={checked.has(item.id) ? 'text-muted line-through' : ''}>{item.label}</span>
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function OnboardingChecklistView({
  rows,
  templates,
  selectedEmployeeId,
  onSelectEmployee,
}: {
  rows: EmployeeOnboardingRow[]
  templates: OnboardingTemplate[]
  selectedEmployeeId: string | null
  onSelectEmployee: (employeeId: string) => void
}) {
  if (rows.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No one is currently onboarding.</p>
      </Card>
    )
  }

  const row = rows.find((item) => item.employeeId === selectedEmployeeId) ?? rows[0]
  const template = templates.find((item) => item.id === row.templateId)

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <SelectField
          label="Employee"
          value={row.employeeId}
          onChange={(event) => onSelectEmployee(event.target.value)}
          options={rows.map((item) => ({ value: item.employeeId, label: item.employeeName }))}
        />
      </div>

      <ChecklistCard key={row.employeeId} row={row} template={template} />
    </div>
  )
}
