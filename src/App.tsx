import { Navigate, Route, Routes } from 'react-router'
import { ForgotPasswordPage } from './features/auth/pages/forgot-password-page'
import { LoginPage } from './features/auth/pages/login-page'
import { SignupPage } from './features/auth/pages/signup-page'
import { VerifyEmailPage } from './features/auth/pages/verify-email-page'
import { RemittancesPage } from './features/compliance/pages/remittances-page'
import { StatutoryPage } from './features/compliance/pages/statutory-page'
import { TaxPage } from './features/compliance/pages/tax-page'
import { GlobalApprovalsPage } from './features/approvals/pages/approvals-page'
import { DashboardHomePage } from './features/dashboard/pages/dashboard-home-page'
import { ReportsPage } from './features/dashboard/pages/reports-page'
import { DashboardLayout } from './features/dashboard/components/dashboard-layout'
import { OnboardingPage } from './features/onboarding/pages/onboarding-page'
import { DocumentsPage } from './features/people/pages/documents-page'
import { EmployeeProfilePage } from './features/people/pages/employee-profile-page'
import { EmployeesPage } from './features/people/pages/employees-page'
import { LeavePage } from './features/people/pages/leave-page'
import { PeopleOnboardingPage } from './features/people/pages/onboarding-page'
import { PeopleOrganizationPage } from './features/people/pages/organization-page'
import { PayrollOverviewPage } from './features/payroll/pages/overview-page'
import { PayrollRunDetailPage } from './features/payroll/pages/run-detail-page'
import { PayrollRunsPage } from './features/payroll/pages/payroll-runs-page'
import { PayslipsPage } from './features/payroll/pages/payslips-page'
import { SalariesPage } from './features/payroll/pages/salaries-page'
import { SalaryAdvancesPage } from './features/payroll/pages/salary-advances-page'
import { BillingPage } from './features/settings/pages/billing-page'
import { IntegrationsPage } from './features/settings/pages/integrations-page'
import { NotificationsPage } from './features/settings/pages/notifications-page'
import { SettingsOrganizationPage } from './features/settings/pages/organization-page'
import { SettingsPayrollPage } from './features/settings/pages/payroll-page'
import { SecurityPage } from './features/settings/pages/security-page'
import { TeamAccessPage } from './features/settings/pages/team-access-page'
import { ExpenseDetailPage } from './features/spend/pages/expense-detail-page'
import { ExpensesPage } from './features/spend/pages/expenses-page'
import { ReimbursementsPage } from './features/spend/pages/reimbursements-page'
import { SpendApprovalsPage } from './features/spend/pages/approvals-page'
import { ProtectedRoute } from './routing/protected-route'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />

        <Route path="people">
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/:employeeId" element={<EmployeeProfilePage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="organization" element={<PeopleOrganizationPage />} />
          <Route path="onboarding" element={<PeopleOnboardingPage />} />
        </Route>

        <Route path="payroll">
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<PayrollOverviewPage />} />
          <Route path="runs" element={<PayrollRunsPage />} />
          <Route path="runs/:runId" element={<PayrollRunDetailPage />} />
          <Route path="salaries" element={<SalariesPage />} />
          <Route path="payslips" element={<PayslipsPage />} />
          <Route path="salary-advances" element={<SalaryAdvancesPage />} />
        </Route>

        <Route path="spend">
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="expenses/:expenseId" element={<ExpenseDetailPage />} />
          <Route path="reimbursements" element={<ReimbursementsPage />} />
          <Route path="approvals" element={<SpendApprovalsPage />} />
        </Route>

        <Route path="compliance">
          <Route path="tax" element={<TaxPage />} />
          <Route path="statutory" element={<StatutoryPage />} />
          <Route path="remittances" element={<RemittancesPage />} />
        </Route>

        <Route path="approvals" element={<GlobalApprovalsPage />} />
        <Route path="reports" element={<ReportsPage />} />

        <Route path="settings">
          <Route path="organization" element={<SettingsOrganizationPage />} />
          <Route path="payroll" element={<SettingsPayrollPage />} />
          <Route path="team-access" element={<TeamAccessPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
