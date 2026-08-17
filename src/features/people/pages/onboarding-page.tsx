import { useState } from 'react'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { CompanyOnboardingView } from '../components/onboarding/company-onboarding-view'
import { EmployeeOnboardingView } from '../components/onboarding/employee-onboarding-view'
import { OnboardingChecklistView } from '../components/onboarding/onboarding-checklist-view'
import { OnboardingTemplatesView } from '../components/onboarding/onboarding-templates-view'
import { useDepartments } from '../hooks/use-departments'
import { useEmployeeOnboarding } from '../hooks/use-employee-onboarding'
import { useOnboardingTemplates } from '../hooks/use-onboarding-templates'

type OnboardingTabKey = 'company' | 'employees' | 'templates' | 'checklist'

const ONBOARDING_TABS: { key: OnboardingTabKey; label: string }[] = [
  { key: 'company', label: 'Company Onboarding' },
  { key: 'employees', label: 'Employee Onboarding' },
  { key: 'templates', label: 'Onboarding Templates' },
  { key: 'checklist', label: 'Onboarding Checklist' },
]

// Employee onboarding tracking (People > Onboarding) — distinct from the
// account/company setup wizard in features/onboarding/.
export function PeopleOnboardingPage() {
  const [activeTab, setActiveTab] = useState<OnboardingTabKey>('company')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const { data: departments, isPending: departmentsPending } = useDepartments()
  const { data: templates, isPending: templatesPending } = useOnboardingTemplates()
  const { data: onboardingRows, isPending: rowsPending } = useEmployeeOnboarding()

  const pendingByTab: Record<OnboardingTabKey, boolean> = {
    company: departmentsPending || templatesPending,
    employees: rowsPending || templatesPending,
    templates: templatesPending || departmentsPending,
    checklist: rowsPending || templatesPending,
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Onboarding</h1>
        <p className="mt-1 text-sm text-muted">Templates and checklists for getting new hires up to speed.</p>
      </div>

      <UnderlineTabs tabs={ONBOARDING_TABS} active={activeTab} onChange={setActiveTab} />

      {pendingByTab[activeTab] ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'company' ? (
            <CompanyOnboardingView departments={departments ?? []} templates={templates ?? []} />
          ) : null}
          {activeTab === 'employees' ? (
            <EmployeeOnboardingView
              rows={onboardingRows ?? []}
              templates={templates ?? []}
              onSelect={(employeeId) => {
                setSelectedEmployeeId(employeeId)
                setActiveTab('checklist')
              }}
            />
          ) : null}
          {activeTab === 'templates' ? (
            <OnboardingTemplatesView templates={templates ?? []} departments={departments ?? []} />
          ) : null}
          {activeTab === 'checklist' ? (
            <OnboardingChecklistView
              rows={onboardingRows ?? []}
              templates={templates ?? []}
              selectedEmployeeId={selectedEmployeeId}
              onSelectEmployee={setSelectedEmployeeId}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
