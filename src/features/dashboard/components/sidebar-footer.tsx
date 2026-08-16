import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useClickOutside } from '../../../lib/use-click-outside'
import { useAuthStore } from '../../auth/store/auth-store'
import { ChevronDownIcon, LogOutIcon } from './nav-icons'
import { useSidebar } from './use-sidebar'

export function SidebarFooter() {
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useNavigate()
  const { collapsed } = useSidebar()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, () => setOpen(false))

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || '?'

  function handleLogout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div ref={containerRef} className="relative border-t border-line p-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        title={collapsed ? user?.name : undefined}
        className={`flex w-full items-center gap-2 rounded-lg p-1.5 hover:bg-surface ${collapsed ? 'justify-center' : ''}`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-ink">
          {userInitial}
        </span>
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium text-ink">{user?.name}</span>
              <span className="block truncate text-xs text-muted">{user?.email}</span>
            </span>
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted" />
          </>
        ) : null}
      </button>

      {open ? (
        <div
          className={`absolute bottom-full mb-1 rounded-lg border border-line bg-surface p-1 shadow-lift ${
            collapsed ? 'left-3 w-48' : 'left-3 right-3'
          }`}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-ink hover:bg-canvas"
          >
            <LogOutIcon className="h-4 w-4" />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  )
}
