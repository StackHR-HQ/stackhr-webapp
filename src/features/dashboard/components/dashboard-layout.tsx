import { Outlet } from 'react-router'
import { MobileTopBar } from './mobile-top-bar'
import { Sidebar } from './sidebar'
import { SidebarProvider } from './sidebar-context'

export function DashboardLayout() {
  return (
    <SidebarProvider>
      {/* h-screen + overflow-hidden on the shell means the page itself never
          scrolls — the sidebar and main content each own their own
          independent scroll region below. */}
      <div className="flex h-screen overflow-hidden bg-canvas">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
