import { ArrowSquareOutIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Card, CardHeader } from '../../../../components/ui/card'
import type { Department, OnboardingTemplate } from '../../types/people-types'

export function CompanyOnboardingView({
  departments,
  templates,
}: {
  departments: Department[]
  templates: OnboardingTemplate[]
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Company setup" description="The wizard used when StackHR is first configured for your org" />
        <p className="text-sm text-muted">
          Company profile, payroll settings, and the initial employee roster are configured once during setup.
        </p>
        <Link
          to="/onboarding"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
        >
          Review company setup
          <ArrowSquareOutIcon className="h-3.5 w-3.5" />
        </Link>
      </Card>

      <Card>
        <CardHeader title="Default templates by department" />
        <ul className="divide-y divide-line">
          {departments.map((department) => {
            const template = templates.find((item) => item.departmentIds.includes(department.id))
            return (
              <li key={department.id} className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0">
                <span className="text-ink">{department.name}</span>
                <span className="text-muted">{template?.name ?? '—'}</span>
              </li>
            )
          })}
        </ul>
      </Card>
    </div>
  )
}
