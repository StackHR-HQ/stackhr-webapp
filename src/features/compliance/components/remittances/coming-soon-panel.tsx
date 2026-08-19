import { SparkleIcon, type Icon } from '@phosphor-icons/react'

export function ComingSoonPanel({ icon: PanelIcon, title, description }: { icon: Icon; title: string; description: string }) {
  return (
    <div className="rounded-panel border border-dashed border-line bg-canvas p-8 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2">
        <PanelIcon className="h-5 w-5 text-ink" />
      </div>
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted">{description}</p>
      <span className="mt-3 inline-block rounded-pill bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
        Coming soon
      </span>
      <div className="mt-4 flex items-start justify-center gap-2 text-left">
        <SparkleIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        <p className="max-w-sm text-xs text-muted">
          Filing remittances directly from StackHR — and tracking each submission through to confirmation — is on the
          roadmap once payment integrations are wired up.
        </p>
      </div>
    </div>
  )
}
