import { Button } from '../../../components/ui/button'

export function PeopleLoadError({ resource, onRetry }: { resource: string; onRetry: () => void }) {
  return (
    <div className="rounded-panel border border-line bg-surface p-6 text-center shadow-panel">
      <p className="text-sm font-medium text-ink">Couldn&apos;t load {resource}</p>
      <p className="mt-1 text-sm text-muted">Check your connection and try again.</p>
      <Button type="button" variant="secondary" onClick={onRetry} width="responsive" className="mx-auto mt-4 px-4">
        Try again
      </Button>
    </div>
  )
}
