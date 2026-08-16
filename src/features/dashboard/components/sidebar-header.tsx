import { Link } from 'react-router'
import { useAuthStore } from '../../auth/store/auth-store'
import { ChevronDownIcon, PanelToggleIcon } from './nav-icons'
import { useSidebar } from './use-sidebar'

export function SidebarHeader() {
  const user = useAuthStore((state) => state.user)
  const { collapsed, toggleCollapsed } = useSidebar()

  const orgInitial = user?.orgName?.trim().charAt(0).toUpperCase() || 'S'

  return (
    <div className={`flex items-center gap-1.5 border-b border-line p-3 ${collapsed ? 'flex-col' : ''}`}>
      {/* Only one workspace exists per account today, so this links straight to
          org settings rather than pretending to be a multi-workspace switcher. */}
      <Link
        to="/settings/organization"
        title={collapsed ? user?.orgName : undefined}
        className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg p-1.5 hover:bg-surface ${
          collapsed ? 'w-full flex-none justify-center' : ''
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-ink">
          {orgInitial}
        </span>
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium text-ink">{user?.orgName ?? 'Workspace'}</span>
              <span className="block truncate text-xs capitalize text-muted">{user?.role ?? ''}</span>
            </span>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted" />
          </>
        ) : null}
      </Link>

      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title="Toggle sidebar (⌘B)"
        className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink"
      >
        <PanelToggleIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
