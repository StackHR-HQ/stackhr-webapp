import { ClockIcon, type Icon } from '@phosphor-icons/react'

// Shown in place of a screen whose backend isn't available yet.
export function ComingSoon({ icon: FeatureIcon, title, description }: { icon: Icon; title: string; description: string }) {
  return (
    <div className="rounded-panel border border-line bg-surface px-6 py-14 text-center shadow-panel">
      <div className="relative mx-auto h-16 w-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <FeatureIcon className="h-7 w-7 text-accent" />
        </div>
        <span className="absolute -right-1.5 -bottom-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-accent">
          <ClockIcon weight="bold" className="h-3.5 w-3.5 text-accent-ink" />
        </span>
      </div>
      <span className="mt-5 inline-block rounded-pill bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase">
        Coming soon
      </span>
      <p className="mt-3 text-base font-medium text-ink">{title} is on the way</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">{description}</p>
    </div>
  )
}
