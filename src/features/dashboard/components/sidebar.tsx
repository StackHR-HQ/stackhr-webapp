import { SIDEBAR_NAV } from './sidebar-nav-data'
import { SidebarFooter } from './sidebar-footer'
import { SidebarHeader } from './sidebar-header'
import { SidebarNavItem } from './sidebar-nav-item'
import { useSidebar } from './use-sidebar'

export function Sidebar() {
  const { collapsed } = useSidebar()

  return (
    <nav
      className={`flex h-screen shrink-0 flex-col border-r border-line transition-[width] duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <SidebarHeader />

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {SIDEBAR_NAV.map((section) => (
          <SidebarNavItem key={section.label} section={section} />
        ))}
      </div>

      <SidebarFooter />
    </nav>
  )
}
