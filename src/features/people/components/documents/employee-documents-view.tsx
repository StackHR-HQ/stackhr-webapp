import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { formatDate } from '../../lib/format'
import type { EmployeeDocumentRow } from '../../types/people-types'

export function EmployeeDocumentsView({ documents }: { documents: EmployeeDocumentRow[] }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return documents
    return documents.filter(
      (document) => document.employeeName.toLowerCase().includes(query) || document.name.toLowerCase().includes(query),
    )
  }, [documents, search])

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by employee or document name"
          className="w-full rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-panel border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Document</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Uploaded</th>
                <th className="px-4 py-3 font-medium">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((document) => (
                <tr key={document.id} className="bg-canvas">
                  <td className="px-4 py-3">
                    <Link
                      to={`/people/employees/${document.employeeId}`}
                      className="flex items-center gap-2.5 hover:underline"
                    >
                      <Avatar initials={document.avatarInitials} size="sm" />
                      <span className="font-medium text-ink">{document.employeeName}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink">{document.name}</td>
                  <td className="px-4 py-3 text-muted">{document.category}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(document.uploadedAt)}</td>
                  <td className="px-4 py-3 text-muted">{document.fileSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-panel border border-dashed border-line p-8 text-center text-sm text-muted">
          No documents match your search.
        </p>
      )}
    </div>
  )
}
