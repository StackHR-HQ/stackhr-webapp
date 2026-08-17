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
