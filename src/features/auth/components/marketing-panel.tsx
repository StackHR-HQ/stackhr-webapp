const FEATURES = [
  {
    title: 'People Ops',
    desc: 'Employees, leave, and approvals in one system of record.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" strokeLinecap="round" />
        <path d="M16 8.5a3 3 0 1 0 0-6" strokeLinecap="round" />
        <path d="M15 14.2c2.9.5 5 2.7 5 5.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Payroll Ops',
    desc: 'Compliant payroll runs, versioned against local tax rules.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 9v.01M18 15v.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Spend Ops',
    desc: 'Expenses, reimbursements, and salary advances with approvals.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M2.5 10h19" strokeLinecap="round" />
        <path d="M6 15h4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function MarketingPanel() {
  return (
    <aside className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-panel px-12 py-12 text-panel-ink lg:flex lg:w-[46%]">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative flex items-center gap-2 text-lg font-medium">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-ink">
          S
        </span>
        StackHR
      </div>

      <div className="relative">
        <h2 className="text-4xl font-medium leading-tight text-balance">
          People, Payroll, and Spend — finally in one place.
        </h2>
        <p className="mt-4 max-w-sm text-base text-panel-ink/70">
          One AI-powered platform that eliminates the operational chaos of running a business, built for African
          SMEs and scalable to global companies.
        </p>

        <ul className="mt-10 space-y-5">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-panel-ink/10 text-panel-ink [&_svg]:h-5 [&_svg]:w-5">
                {feature.icon}
              </span>
              <div>
                <p className="font-medium">{feature.title}</p>
                <p className="text-sm text-panel-ink/60">{feature.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* <div className="mt-10 rounded-2xl border border-panel-ink/10 bg-panel-ink/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">April payroll run</p>
            <span className="rounded-full bg-positive/20 px-2 py-0.5 text-xs text-positive">Compliant</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-panel-ink/10">
            <div className="h-2 w-4/5 rounded-full bg-accent" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-panel-ink/50">
            <span>36 employees paid</span>
            <span>Tax rules NG-2026-v1</span>
          </div>
        </div> */}
      </div>

      <p className="relative text-xs text-panel-ink/50">Built for growing teams across Africa.</p>
    </aside>
  )
}
