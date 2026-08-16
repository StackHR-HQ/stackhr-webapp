import type { ReactNode } from 'react'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-medium text-ink">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
        </div>

        <div className="rounded-panel border border-line bg-surface p-6 shadow-panel">{children}</div>

        {footer ? <p className="mt-5 text-center text-sm text-muted">{footer}</p> : null}
      </div>
    </div>
  )
}
