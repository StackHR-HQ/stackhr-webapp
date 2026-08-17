import { FileTextIcon } from '@phosphor-icons/react'
import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import type { EmployeeDetail } from '../../types/people-types'

export function DocumentsTab({ employee }: { employee: EmployeeDetail }) {
  return (
    <Card>
      <CardHeader title="Documents" description={`${employee.documents.length} files on record`} />
      {employee.documents.length > 0 ? (
        <ul className="divide-y divide-line">
          {employee.documents.map((document) => (
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No documents uploaded yet.</p>
      )}
    </Card>
  )
}
