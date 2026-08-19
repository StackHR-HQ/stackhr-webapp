import type { Icon } from '@phosphor-icons/react'
import { Card, CardHeader } from '../../../components/ui/card'

export function ComingSoonCard({ title, description, icon: Icon }: { title: string; description: string; icon: Icon }) {
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line py-10 text-center">
        <Icon className="h-8 w-8 text-muted" />
        <p className="text-sm font-medium text-ink">Coming soon</p>
        <p className="max-w-sm text-xs text-muted">This is on our roadmap and isn't available yet.</p>
      </div>
    </Card>
  )
}
