import { useAuthStore } from '../features/auth/store/auth-store'
import { DashboardHomePage } from '../features/dashboard/pages/dashboard-home-page'
import { EmployeeDashboardPage } from '../features/employee/pages/dashboard-page'

export function DashboardHomeRoute() {
  const role = useAuthStore((state) => state.user?.role)
  return role === 'employee' ? <EmployeeDashboardPage /> : <DashboardHomePage />
}
