import type { ComponentPropsWithRef, ReactNode } from 'react'

type CardProps = ComponentPropsWithRef<'div'>

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={`rounded-panel border border-line bg-surface p-5 shadow-panel ${className ?? ''}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-medium text-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
