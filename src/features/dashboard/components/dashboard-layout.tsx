import { Outlet } from 'react-router'
import { Sidebar } from './sidebar'
import { SidebarProvider } from './sidebar-context'

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-canvas">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
