export type PayrollRunStatus = 'draft' | 'processing' | 'pending_approval' | 'approved' | 'completed' | 'failed'

export type TaxRuleSetId = 'NG-2025' | 'NG-2026-v1'

export interface TaxRuleSet {
  id: TaxRuleSetId
  version: string
  effectiveFrom: string
  label: string
  description: string
}

export type StatutoryApplicability = 'mandatory' | 'voluntary' | 'not_applicable'

export interface StatutoryContributionRule {
  id: 'pension' | 'nhf' | 'nhia' | 'nsitf' | 'itf'
  name: string
  applicability: StatutoryApplicability
  employeeRatePercent: number
  employerRatePercent: number
  base: 'gross' | 'basic' | 'bht'
  explanation: string
  legalReference: string
}

export interface ComplianceWarning {
  id: string
  severity: 'critical' | 'warning' | 'info'
  message: string
}

export interface RunEmployeeLine {
  employeeId: string
  employeeName: string
  avatarInitials: string
  jobTitle: string
  basic: number
  housing: number
  transport: number
  otherAllowances: number
  grossPay: number
  paye: number
  pensionEmployee: number
  nhfEmployee: number
  totalDeductions: number
  netPay: number
  pensionEmployer: number
  nhiaEmployer: number
  nsitfEmployer: number
  totalEmployerContributions: number
  employerCost: number
}

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  timestamp: string
}

export interface PayrollRunMeta {
  id: string
  periodLabel: string
  payPeriodStart: string
  payPeriodEnd: string
  payDate: string
  status: PayrollRunStatus
  taxRuleSetId: TaxRuleSetId
  payrollEngineVersion: string
  generatedBy: string
  generatedAt: string
  approvedBy?: string
  approvedAt?: string
  failureReason?: string
}

export interface PayrollRunSummary {
  employeeCount: number
  currency: string
  grossPay: number
  totalEmployeeDeductions: number
  totalEmployerContributions: number
  netPay: number
  totalEmployerCost: number
}

export interface PayrollRunListItem extends PayrollRunMeta {
  summary: PayrollRunSummary
}

export interface PayrollRunDetail extends PayrollRunMeta {
  taxRuleSet: TaxRuleSet
  summary: PayrollRunSummary
  statutoryContributions: StatutoryContributionRule[]
  lines: RunEmployeeLine[]
  complianceWarnings: ComplianceWarning[]
  auditLog: AuditLogEntry[]
}

export interface PayrollOverview {
  currentRun: PayrollRunDetail
  previousRuns: PayrollRunMeta[]
  upcomingRuns: PayrollRunMeta[]
  complianceWarnings: ComplianceWarning[]
}

export interface EmployeeRef {
  employeeId: string
  employeeName: string
  avatarInitials: string
}

export interface SalaryBand {
  departmentId: string
  departmentName: string
  employeeCount: number
  minSalary: number
  maxSalary: number
  avgSalary: number
}

export interface EmployeeSalaryRow extends EmployeeRef {
  jobTitle: string
  departmentId: string
  annualSalary: number
  monthlySalary: number
  currency: string
  payFrequency: string
}

export interface EarningComponent {
  id: 'basic' | 'housing' | 'transport' | 'other'
  name: string
  percentOfGross: number
  description: string
}

export interface DeductionType {
  id: string
  name: string
  category: 'statutory' | 'other'
  rateDescription: string
  description: string
}

export interface BonusPayout extends EmployeeRef {
  amount: number
  currency: string
  periodLabel: string
  payDate: string
  status: PayrollRunStatus
}

export interface SalaryChangeEntry extends EmployeeRef {
  id: string
  previousSalary: number
  newSalary: number
  currency: string
  effectiveDate: string
  reason: string
}

export interface SalaryAdvanceStatusEntry extends EmployeeRef {
  id: string
  requestedAt: string
  amount: number
  currency: string
  repaymentMonths: number
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid'
}

export interface PayslipRecord extends EmployeeRef {
  id: string
  runId: string
  periodLabel: string
  payDate: string
  netPay: number
  currency: string
  status: 'generated' | 'pending'
}
