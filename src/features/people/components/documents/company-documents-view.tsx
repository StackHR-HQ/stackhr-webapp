import { FileTextIcon } from '@phosphor-icons/react'
import { Card } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import type { CompanyDocument } from '../../types/people-types'

export function CompanyDocumentsView({ documents }: { documents: CompanyDocument[] }) {
  return (
    <Card>
      <ul className="divide-y divide-line">
        {documents.map((document) => (
          <li key={document.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              <FileTextIcon className="h-4 w-4 text-ink" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{document.name}</p>
              <p className="text-xs text-muted">
                {document.category} · Uploaded {formatDate(document.uploadedAt)} · {document.fileSize}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted">{document.visibility}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
