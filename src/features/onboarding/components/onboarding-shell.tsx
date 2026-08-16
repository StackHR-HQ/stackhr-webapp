import type { ReactNode } from 'react'
import { Stepper } from '../../../components/ui/stepper'

const STEP_LABELS = ['Welcome', 'Company info', 'Employees', 'Review']

export function OnboardingShell({ currentStep, children }: { currentStep: number; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-base font-medium text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-accent-ink">
              S
            </span>
            StackHR
          </div>
          <div className="w-full max-w-md">
            <Stepper steps={STEP_LABELS} currentIndex={currentStep} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-8 sm:py-14">{children}</main>
    </div>
  )
}
