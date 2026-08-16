import { ListIcon } from '@phosphor-icons/react'
import { useSidebar } from './use-sidebar'

export function MobileTopBar() {
  const { toggleMobileOpen } = useSidebar()

  return (
    <div className="flex items-center gap-2 border-b border-line p-3 lg:hidden">
      <button
        type="button"
        onClick={toggleMobileOpen}
        aria-label="Open sidebar"
        className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink"
      >
        <ListIcon className="h-5 w-5" />
      </button>
      <span className="text-sm font-medium text-ink">StackHR</span>
    </div>
  )
}
