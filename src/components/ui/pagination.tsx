import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'

export function Pagination({
  page,
  pageSize,
  totalItems,
  onChange,
}: {
  page: number
  pageSize: number
  totalItems: number
  onChange: (page: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  if (totalPages <= 1) return null

  const rangeStart = (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between border-t border-line pt-3">
      <p className="text-xs text-muted">
        Showing {rangeStart}–{rangeEnd} of {totalItems}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <CaretLeftIcon className="h-3.5 w-3.5" />
        </button>
        <span className="px-1 text-xs font-medium text-ink">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <CaretRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
