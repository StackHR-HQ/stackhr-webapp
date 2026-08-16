import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../auth/store/auth-store'
import { AddEmployeesStep } from '../components/add-employees-step'
import { CompanyInfoStep } from '../components/company-info-step'
import { OnboardingShell } from '../components/onboarding-shell'
import { ReviewStep } from '../components/review-step'
import { WelcomeStep } from '../components/welcome-step'
import { useOnboardingStore } from '../store/onboarding-store'
import type { CompanyInfoFormValues } from '../schemas/company-info-schema'

const STEP = {
  welcome: 0,
  company: 1,
  employees: 2,
  review: 3,
} as const

export function OnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { companyInfo, employees, setCompanyInfo, addEmployee, addEmployees, removeEmployee } = useOnboardingStore()
  const [step, setStep] = useState<number>(STEP.welcome)

  function handleCompanyInfoSubmit(values: CompanyInfoFormValues) {
    setCompanyInfo(values)
    setStep(STEP.employees)
  }

  return (
    <OnboardingShell currentStep={step}>
      {step === STEP.welcome ? (
        <WelcomeStep userName={user?.name} orgName={user?.orgName} onNext={() => setStep(STEP.company)} />
      ) : null}

      {step === STEP.company ? (
        <CompanyInfoStep
          defaultValues={companyInfo ?? { name: user?.orgName ?? '', industry: '', companySize: '', currency: 'NGN', payrollFrequency: 'Monthly', taxId: '' }}
          onNext={handleCompanyInfoSubmit}
          onBack={() => setStep(STEP.welcome)}
        />
      ) : null}

      {step === STEP.employees ? (
        <AddEmployeesStep
          employees={employees}
          currency={companyInfo?.currency ?? 'NGN'}
          onAdd={addEmployee}
          onAddMany={addEmployees}
          onRemove={removeEmployee}
          onNext={() => setStep(STEP.review)}
          onBack={() => setStep(STEP.company)}
        />
      ) : null}

      {step === STEP.review && companyInfo ? (
        <ReviewStep
          companyInfo={companyInfo}
          employees={employees}
          onEditCompany={() => setStep(STEP.company)}
          onEditEmployees={() => setStep(STEP.employees)}
          onBack={() => setStep(STEP.employees)}
          onFinish={() => navigate('/', { replace: true })}
        />
      ) : null}
    </OnboardingShell>
  )
}
