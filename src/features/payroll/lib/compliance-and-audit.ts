import type { AuditLogEntry, ComplianceWarning, PayrollRunMeta } from '../types/payroll-types'

function addHours(iso: string, hours: number): string {
  const date = new Date(iso)
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

export function buildComplianceWarnings(run: PayrollRunMeta): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = []

  if (run.id === 'run-2026-08') {
    warnings.push(
      {
        id: `${run.id}-pension-threshold`,
        severity: 'info',
        message:
          'Employee count reached 15 this period — Pension contributions are now mandatory under NG-2026-v1 (Pension Reform Act 2014).',
      },
      {
        id: `${run.id}-halima-tin`,
        severity: 'critical',
        message: 'Halima Yusuf is missing a Tax Identification Number (TIN) on file, required for PAYE remittance.',
      },
    )
  }

  if (run.status === 'failed') {
    warnings.push({
      id: `${run.id}-failure`,
      severity: 'critical',
      message: run.failureReason ?? 'This run failed validation.',
    })
  }

  return warnings
}

export function buildAuditLog(run: PayrollRunMeta): AuditLogEntry[] {
  const entries: AuditLogEntry[] = [
    { id: `${run.id}-generated`, actor: run.generatedBy, action: 'Payroll run generated', timestamp: run.generatedAt },
  ]

  if (run.status === 'failed') {
    entries.push({
      id: `${run.id}-failed`,
      actor: 'System',
      action: `Validation failed — ${run.failureReason ?? 'unresolved errors'}`,
      timestamp: addHours(run.generatedAt, 2),
    })
    return entries
  }

  if (run.status === 'draft') {
    return entries
  }

  entries.push({
    id: `${run.id}-calculated`,
    actor: 'System',
    action: 'Compliance checks completed, payroll calculated',
    timestamp: addHours(run.generatedAt, 4),
  })

  if (run.status === 'processing') {
    return entries
  }

  entries.push({
    id: `${run.id}-submitted`,
    actor: 'System',
    action: 'Submitted for approval',
    timestamp: addHours(run.generatedAt, 6),
  })

  if (run.status === 'pending_approval') {
    return entries
  }

  if (run.approvedBy && run.approvedAt) {
    entries.push({
      id: `${run.id}-approved`,
      actor: run.approvedBy,
      action: 'Approved payroll run',
      timestamp: run.approvedAt,
    })
  }

  if (run.status === 'completed') {
    entries.push({
      id: `${run.id}-disbursed`,
      actor: 'System',
      action: 'Payslips generated and payments disbursed',
      timestamp: run.payDate,
    })
  }

  return entries
}
