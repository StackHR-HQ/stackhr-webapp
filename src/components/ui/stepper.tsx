export function Stepper({ steps, currentIndex }: { steps: string[]; currentIndex: number }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted sm:hidden">
        Step {currentIndex + 1} of {steps.length} · {steps[currentIndex]}
      </p>

      <ol className="hidden items-center sm:flex">
        {steps.map((step, index) => {
          const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
          return (
            <li key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  aria-current={state === 'current' ? 'step' : undefined}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                    state === 'upcoming'
                      ? 'border border-line text-muted'
                      : 'bg-accent text-accent-ink'
                  }`}
                >
                  {state === 'done' ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12l5 5L19 8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs ${state === 'upcoming' ? 'text-muted' : 'text-ink'}`}>{step}</span>
              </div>
              {index < steps.length - 1 ? (
                <div className={`mx-2 mb-5 h-px flex-1 ${index < currentIndex ? 'bg-accent' : 'bg-line'}`} />
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
