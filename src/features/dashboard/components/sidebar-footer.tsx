import { BellIcon, CaretUpDownIcon, CreditCardIcon, SignOutIcon, UserCircleIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useClickOutside } from '../../../lib/use-click-outside'
import { useAuthStore } from '../../auth/store/auth-store'
import { useSidebar } from './use-sidebar'

const MENU_ITEMS = [
  { label: 'Account', to: '/settings/organization', icon: UserCircleIcon },
  { label: 'Billing', to: '/settings/billing', icon: CreditCardIcon },
  { label: 'Notifications', to: '/settings/notifications', icon: BellIcon },
]

export function SidebarFooter() {
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useNavigate()
  const { collapsed, closeMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, () => setOpen(false))

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || '?'

  function handleLogout() {
    setOpen(false)
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div ref={containerRef} className="relative border-t border-line p-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        title={collapsed ? user?.name : undefined}
        aria-expanded={open}
        className={`flex w-full items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-surface active:scale-[0.98] ${
          collapsed ? 'justify-center' : ''
        }`}
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
            <CaretUpDownIcon className="h-4 w-4 shrink-0 text-muted" />
          </>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute bottom-full z-10 mb-2 overflow-hidden rounded-xl border border-line bg-canvas shadow-lift ${
            collapsed ? 'left-3 w-64' : 'left-3 right-3'
          }`}
        >
          <div className="flex items-center gap-3 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-ink">
              {userInitial}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">{user?.name}</span>
              <span className="block truncate text-xs text-muted">{user?.email}</span>
            </span>
          </div>

          <div className="h-px bg-line" />

          <div className="p-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  closeMobile()
                }}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-ink hover:bg-surface"
              >
                <item.icon className="h-4 w-4 text-muted" weight="regular" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="h-px bg-line" />

          <div className="p-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm text-critical hover:bg-critical/10"
            >
              <SignOutIcon className="h-4 w-4" weight="regular" />
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
