import { ArrowSquareOut, FileText, FolderOpen } from '@phosphor-icons/react'
import { Card } from '../../../components/ui/card'
import { useMyDocuments } from '../hooks/use-my-documents'
import { formatLongDate } from '../lib/profile-format'

export function EmployeeDocumentsPage() {
  const { data: documents, isPending, isError, refetch } = useMyDocuments()

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-medium text-ink">My Documents</h1>
        <p className="mt-1 text-sm text-muted">Contracts, letters and other files HR has shared with you.</p>
      </div>

      {isPending ? (
        <div className="h-48 animate-pulse rounded-panel border border-line bg-surface" />
      ) : isError ? (
        <Card>
          <div className="py-4 text-center">
            <p className="text-sm text-muted">Couldn&apos;t load your documents right now.</p>
            <button type="button" onClick={() => refetch()} className="mt-2 text-sm font-medium text-accent hover:underline">
              Try again
            </button>
          </div>
        </Card>
      ) : documents.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <FolderOpen size={28} weight="duotone" className="text-muted" />
            <p className="text-sm text-muted">No documents have been shared with you yet.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {documents.map((document) => {
              const meta = [document.category, document.createdAt && formatLongDate(document.createdAt)].filter(Boolean)
              return (
                <li key={document.id} className="py-3 first:pt-0 last:pb-0">
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <FileText size={19} weight="duotone" className="shrink-0 text-accent" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink group-hover:underline">
                          {document.title}
                        </span>
                        {meta.length ? <span className="block text-xs text-muted">{meta.join(' · ')}</span> : null}
                      </span>
                    </span>
                    <ArrowSquareOut size={16} className="shrink-0 text-muted group-hover:text-ink" aria-label="Opens in a new tab" />
                  </a>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
