import { Card } from '../../../../components/ui/card'
import type { Department, OnboardingTemplate } from '../../types/people-types'

export function OnboardingTemplatesView({
  templates,
  departments,
}: {
  templates: OnboardingTemplate[]
  departments: Department[]
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => {
        const stages = Array.from(new Set(template.checklist.map((item) => item.stage)))
        const departmentNames = template.departmentIds
          .map((id) => departments.find((department) => department.id === id)?.name)
          .filter(Boolean)

        return (
          <Card key={template.id}>
            <p className="text-sm font-medium text-ink">{template.name}</p>
            <p className="mt-0.5 text-xs text-muted">{departmentNames.join(', ') || 'Unassigned'}</p>

            <p className="mt-3 text-xl font-medium text-ink">
              {template.checklist.length}
              <span className="text-sm font-normal text-muted"> checklist items</span>
            </p>

            <ul className="mt-3 space-y-1">
              {stages.map((stage) => (
                <li key={stage} className="flex items-center justify-between text-xs text-muted">
                  <span>{stage}</span>
                  <span>{template.checklist.filter((item) => item.stage === stage).length}</span>
                </li>
              ))}
            </ul>
          </Card>
        )
      })}
    </div>
  )
}
