import { CaretUpDownIcon, PlusIcon, SidebarSimpleIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useClickOutside } from '../../../lib/use-click-outside'
import { useAuthStore } from '../../auth/store/auth-store'
import { ORGANIZATIONS, type OrganizationOption } from './org-switcher-data'
import { useSidebar } from './use-sidebar'

export function SidebarHeader() {
  const user = useAuthStore((state) => state.user)
  const switchOrg = useAuthStore((state) => state.switchOrg)
  const navigate = useNavigate()
  const { collapsed, toggleCollapsed, closeMobile } = useSidebar()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, () => setOpen(false))

  const orgInitial = user?.orgName?.trim().charAt(0).toUpperCase() || 'S'

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey)) return
      const org = ORGANIZATIONS[Number(event.key) - 1]
      if (!org) return
      event.preventDefault()
      switchOrg(org)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [switchOrg])

  function handleSelectOrg(org: OrganizationOption) {
    switchOrg(org)
    setOpen(false)
  }

  function handleAddOrg() {
    setOpen(false)
    navigate('/signup')
  }

  return (
    <div ref={containerRef} className={`relative flex items-center gap-1.5 border-b border-line p-3 ${collapsed ? 'flex-col' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        title={collapsed ? user?.orgName : undefined}
        aria-expanded={open}
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
            <CaretUpDownIcon className="h-4 w-4 shrink-0 text-muted" />
          </>
        ) : null}
      </button>

      {/* Icon-collapse is a desktop concept; on mobile the drawer is either
          fully open or fully closed, so swap in a plain close button. */}
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title="Toggle sidebar (⌘B)"
        className="hidden shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink lg:block"
      >
        <SidebarSimpleIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={closeMobile}
        aria-label="Close sidebar"
        className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface hover:text-ink lg:hidden"
      >
        <XIcon className="h-4 w-4" />
      </button>

      {open ? (
        <div role="menu" className="absolute left-3 top-full z-10 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-canvas p-1 shadow-lift">
          <p className="px-2.5 pb-1 pt-1.5 text-xs font-medium text-muted">Organizations</p>

          {ORGANIZATIONS.map((org, index) => (
            <button
              key={org.orgSlug}
              type="button"
              role="menuitem"
              onClick={() => handleSelectOrg(org)}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm text-ink hover:bg-surface"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-2">
                <org.icon className="h-3.5 w-3.5 text-ink" />
              </span>
              <span className="min-w-0 flex-1 truncate">{org.orgName}</span>
              <kbd className="shrink-0 rounded border border-line px-1.5 py-0.5 font-sans text-[10px] text-muted">⌘{index + 1}</kbd>
            </button>
          ))}

          <div className="my-1 h-px bg-line" />

          <button
            type="button"
            role="menuitem"
            onClick={handleAddOrg}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm text-muted hover:bg-surface hover:text-ink"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-dashed border-line">
              <PlusIcon className="h-3.5 w-3.5" />
            </span>
            Add organization
          </button>
        </div>
      ) : null}
    </div>
  )
}
