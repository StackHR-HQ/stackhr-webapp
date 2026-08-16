import { SIDEBAR_NAV } from './sidebar-nav-data'
import { SidebarFooter } from './sidebar-footer'
import { SidebarHeader } from './sidebar-header'
import { SidebarNavItem } from './sidebar-nav-item'
import { useSidebar } from './use-sidebar'

export function Sidebar() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar()

  return (
    <>
      {/* Backdrop: mobile-only, sits behind the drawer and closes it on click. */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={closeMobile} aria-hidden="true" />
      ) : null}

      <nav
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-line bg-canvas transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:transition-[width] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
      >
        <SidebarHeader />

        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {SIDEBAR_NAV.map((section) => (
            <SidebarNavItem key={section.label} section={section} />
          ))}
        </div>

        <SidebarFooter />
      </nav>
    </>
  )
}
