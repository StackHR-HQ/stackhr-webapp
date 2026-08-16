import { Outlet } from 'react-router'
import { Sidebar } from './sidebar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
