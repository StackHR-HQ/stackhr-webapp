import type { ChecklistItem, OnboardingTemplate } from '../types/people-types'

const BASE_CHECKLIST: ChecklistItem[] = [
  { id: 'welcome-email', label: 'Send welcome email and start date confirmation', stage: 'Before day 1' },
  { id: 'prepare-equipment', label: 'Prepare laptop and equipment', stage: 'Before day 1' },
  { id: 'add-to-payroll', label: 'Add to payroll system', stage: 'Before day 1' },
  { id: 'create-email', label: 'Create company email account', stage: 'Before day 1' },
  { id: 'team-intro', label: 'Office and team introduction', stage: 'Day 1' },
  { id: 'hr-paperwork', label: 'Complete HR paperwork (bank details, tax ID)', stage: 'Day 1' },
  { id: 'meet-manager', label: 'Meet with direct manager', stage: 'Day 1' },
  { id: 'compliance-training', label: 'Complete mandatory compliance training', stage: 'Week 1' },
  { id: 'review-handbook', label: 'Review employee handbook and policies', stage: 'Week 1' },
  { id: 'goal-setting', label: '1:1 with manager to set 30-60-90 day goals', stage: 'Week 1' },
  { id: 'probation-checkin', label: 'Complete probation check-in', stage: 'Month 1' },
  { id: 'onboarding-feedback', label: 'Collect onboarding feedback', stage: 'Month 1' },
]

const ENGINEERING_EXTRAS: ChecklistItem[] = [
  { id: 'provision-dev-access', label: 'Provision GitHub and cloud access', stage: 'Day 1' },
  { id: 'dev-environment', label: 'Set up local development environment', stage: 'Day 1' },
  { id: 'pair-programming', label: 'Pair programming session with a team member', stage: 'Week 1' },
]

const GO_TO_MARKET_EXTRAS: ChecklistItem[] = [
  { id: 'crm-access', label: 'CRM access and training', stage: 'Day 1' },
  { id: 'shadow-call', label: 'Shadow a client or prospect call', stage: 'Week 1' },
  { id: 'pipeline-review', label: 'Review current pipeline and territory', stage: 'Week 1' },
]

export const ONBOARDING_TEMPLATES: OnboardingTemplate[] = [
  {
    id: 'template-general',
    name: 'General onboarding',
    departmentIds: ['executive', 'product-design', 'people-finance'],
    checklist: BASE_CHECKLIST,
  },
  {
    id: 'template-engineering',
    name: 'Engineering onboarding',
    departmentIds: ['engineering'],
    checklist: [...BASE_CHECKLIST, ...ENGINEERING_EXTRAS],
  },
  {
    id: 'template-go-to-market',
    name: 'Sales & Marketing onboarding',
    departmentIds: ['sales', 'marketing'],
    checklist: [...BASE_CHECKLIST, ...GO_TO_MARKET_EXTRAS],
  },
]

export function getTemplateForDepartment(departmentId: string): OnboardingTemplate {
  return (
    ONBOARDING_TEMPLATES.find((template) => template.departmentIds.includes(departmentId)) ?? ONBOARDING_TEMPLATES[0]
  )
}
