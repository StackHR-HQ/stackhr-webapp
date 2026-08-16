import type { ReactNode } from 'react'

export type BadgeTone = 'neutral' | 'accent' | 'positive' | 'warning' | 'critical'

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-2 text-muted',
  accent: 'bg-accent/10 text-accent',
  positive: 'bg-positive/10 text-positive',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  critical: 'bg-critical/10 text-critical',
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}
