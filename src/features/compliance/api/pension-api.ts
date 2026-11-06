import { isAxiosError } from 'axios'
import { http } from '../../../lib/http'

// PenCentral pension remittance, built against the Postman contract. On staging
// every call that reaches PenCentral returns 401 "A valid partner credential is
// required." until the backend's partner credentials are set, so shapes beyond
// the documented examples are unconfirmed and read leniently.

export interface PenCentralEmployer {
  isAttached: boolean
  employerCode: string | null
  employerName: string | null
  attachedAt: string | null
}

export interface EmployerValidation {
  validationId: string
  employerCode: string
  employerName: string
  expiresAt: string
}

export interface Pfa {
  code: string
  name: string
}

export type PensionScheduleStatus =
  | 'DRAFT'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'VALIDATION_FAILED'
  | 'SUBMITTED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'DISBURSED'
  | 'CANCELLED'

// Amounts are whole naira (PenCentral sends them as "180000.00" strings).
export interface PensionSchedule {
  id: string
  payrollRunId: string | null
  periodLabel: string
  periodYear: number
  status: string
  employeeCount: number | null
  totalEmployeePension: number | null
  totalEmployerPension: number | null
  totalAmount: number
  virtualAccountNumber: string | null
  virtualAccountBank: string | null
  virtualAccountName: string | null
  receiptId: string | null
  createdAt: string | null
  // PenCentral's row problems from the last failed validation, kept on the schedule.
  validationErrors: string[]
}

export interface ValidationResult {
  schedule: PensionSchedule
  penCentralStatus: string | null
  // Row-level problems PenCentral reported, as readable lines.
  errors: string[]
}

export interface PfaDisbursement {
  pfaCode: string
  pfaName: string
  amount: number
  creditedAmount: number
  status: string
}

export interface Disbursements {
  status: string
  pfas: PfaDisbursement[]
}

export interface PensionComplianceReport {
  submitted: { count: number; amount: number }
  paid: { count: number; amount: number }
  disbursed: { count: number; amount: number }
}

// An employee the backend couldn't include because pension details are missing.
export interface IncompleteEmployee {
  employeeId: string
  fullName: string
  missing: string[]
}

export class IncompletePensionDetailsError extends Error {
  readonly employees: IncompleteEmployee[]

  constructor(message: string, employees: IncompleteEmployee[]) {
    super(message)
    this.name = 'IncompletePensionDetailsError'
    this.employees = employees
  }
}

type Loose = Record<string, unknown>

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const str = (value: unknown): string | null => (typeof value === 'string' && value ? value : null)

function num(value: unknown): number | null {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value)
  return null
}

// The backend sends both camelCase and snake_case for PenCentral fields.
const pick = (source: Loose, camel: string, snake: string) => source[camel] ?? source[snake]

// The backend stores the month as its English name; a number (or numeric
// string) is turned into one too.
function monthName(month: unknown): string | null {
  const index = num(month)
  return index != null ? (MONTHS[index - 1] ?? null) : str(month)
}

function parseErrors(json: unknown): string[] {
  if (typeof json !== 'string' || !json) return []
  try {
    const parsed: unknown = JSON.parse(json)
    return Array.isArray(parsed) ? parsed.map(toReadableError) : [toReadableError(parsed)]
  } catch {
    return [json]
  }
}

// Fields a response leaves out stay empty ('' or null) rather than getting a
// default, so merging the list and detail keeps whichever one has the value.
// Fallbacks for display live in withDefaults.
function toSchedule(raw: Loose): PensionSchedule {
  const year = num(raw.periodYear) ?? 0
  return {
    id: String(raw.id),
    payrollRunId: str(raw.payrollRunId),
    periodLabel: [monthName(raw.periodMonth), year || null].filter(Boolean).join(' '),
    periodYear: year,
    status: str(raw.status)?.toUpperCase() ?? '',
    employeeCount: num(raw.employeeCount),
    totalEmployeePension: num(raw.totalEmployeePension),
    totalEmployerPension: num(raw.totalEmployerPension),
    totalAmount: num(pick(raw, 'totalAmount', 'total_amount')) ?? 0,
    virtualAccountNumber: str(pick(raw, 'virtualAccountNumber', 'account_number')),
    virtualAccountBank: str(pick(raw, 'virtualAccountBank', 'bank_name')),
    virtualAccountName: str(raw.virtualAccountName),
    receiptId: str(pick(raw, 'receiptId', 'receipt_id')),
    createdAt: str(raw.createdAt),
    validationErrors: parseErrors(raw.validationErrorsJson),
  }
}

export function withDefaults(schedule: PensionSchedule): PensionSchedule {
  return { ...schedule, periodLabel: schedule.periodLabel || 'Pension schedule', status: schedule.status || 'DRAFT' }
}

// A field the rest of the flow depends on; better to fail loudly than to carry
// the text 'undefined' into the UI or the next request.
function required(source: Loose, camel: string, snake: string): string {
  const value = pick(source, camel, snake)
  if (typeof value !== 'string' || !value) throw new Error(`PenCentral's response is missing ${camel}.`)
  return value
}

function toReadableError(raw: unknown): string {
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const row = raw as Loose
    const who = str(row.employeeName) ?? str(row.fullName) ?? str(row.rsaPin) ?? str(row.row?.toString())
    const what = str(row.message) ?? str(row.error) ?? str(row.reason) ?? JSON.stringify(row)
    return who ? `${who}: ${what}` : what
  }
  return String(raw)
}

// The 400 lists employees missing an RSA PIN or PFA code; read it wherever the
// error envelope puts it.
function incompleteEmployees(error: unknown): IncompleteEmployee[] | null {
  if (!isAxiosError(error) || error.response?.status !== 400) return null
  const body = error.response.data as Loose | undefined
  const nested = body?.error as Loose | undefined
  const list = body?.invalidEmployees ?? nested?.invalidEmployees ?? (nested?.details as Loose | undefined)?.invalidEmployees
  if (!Array.isArray(list)) return null
  return list.map((entry: Loose) => ({
    employeeId: String(entry.employeeId ?? ''),
    fullName: str(entry.fullName) ?? 'Unknown employee',
    missing: Array.isArray(entry.missing) ? entry.missing.map(String) : [],
  }))
}

export const pensionApi = {
  async getEmployer(): Promise<PenCentralEmployer> {
    const { data } = await http.get<Loose>('/pension/employers/status')
    const grant = (data.grant ?? null) as Loose | null
    return {
      isAttached: Boolean(data.isAttached),
      employerCode: str(pick(data, 'employerCode', 'employer_code')),
      employerName: str(pick(data, 'employerName', 'employer_name')),
      attachedAt: grant ? str(pick(grant, 'attachedAt', 'attached_at')) : null,
    }
  },

  // Read-only check with PenCom. The validation ID expires after 30 minutes.
  async validateEmployer(employerCode: string): Promise<EmployerValidation> {
    const { data } = await http.post<Loose>('/pension/employers/validate', { employerCode })
    return {
      validationId: required(data, 'validationId', 'validation_id'),
      employerCode: required(data, 'employerCode', 'employer_code'),
      employerName: required(data, 'employerName', 'employer_name'),
      expiresAt: required(data, 'expiresAt', 'expires_at'),
    }
  },

  async attachEmployer(validationId: string): Promise<void> {
    await http.post('/pension/employers/attach', { validationId })
  },

  async revokeEmployer(): Promise<void> {
    await http.delete('/pension/employers')
  },

  async getPfas(): Promise<Pfa[]> {
    const { data } = await http.get<{ pfas: Pfa[] }>('/pension/pfas')
    return data.pfas
  },

  async getSchedules(): Promise<PensionSchedule[]> {
    const { data } = await http.get<{ schedules?: Loose[] } | Loose[]>('/pension/schedules')
    const list = Array.isArray(data) ? data : data?.schedules
    return Array.isArray(list) ? list.map(toSchedule).map(withDefaults) : []
  },

  async getSchedule(id: string): Promise<PensionSchedule> {
    const { data } = await http.get<Loose>(`/pension/schedules/${id}`)
    return toSchedule((data.schedule as Loose | undefined) ?? data)
  },

  // Builds a DRAFT from an approved or executed payroll run.
  async createScheduleFromPayroll(payrollRunId: string): Promise<PensionSchedule> {
    try {
      const { data } = await http.post<Loose>(`/pension/schedules/from-payroll/${payrollRunId}`)
      return withDefaults(toSchedule((data.schedule as Loose | undefined) ?? data))
    } catch (err) {
      const employees = incompleteEmployees(err)
      if (employees) {
        throw new IncompletePensionDetailsError('Some employees are missing pension details', employees)
      }
      throw err
    }
  },

  // Sends the schedule to PenCentral for PenCom/PFA checks.
  async validateSchedule(id: string): Promise<void> {
    await http.post(`/pension/schedules/${id}/validate`)
  },

  async getValidationStatus(id: string): Promise<ValidationResult> {
    const { data } = await http.get<Loose>(`/pension/schedules/${id}/validation-status`)
    const errors = data.errors ?? data.validationErrors ?? (data.details as Loose | undefined)?.errors
    return {
      schedule: toSchedule((data.schedule as Loose | undefined) ?? { id }),
      penCentralStatus: str(data.penCentralStatus),
      errors: Array.isArray(errors) ? errors.map(toReadableError) : [],
    }
  },

  // Files the schedule with PenCentral; it can't be changed afterwards.
  async submitSchedule(id: string): Promise<void> {
    await http.post(`/pension/schedules/${id}/submit`)
  },

  // Generates the account to pay the schedule's total into. Nothing is paid here.
  async initiatePayment(id: string): Promise<PensionSchedule> {
    const { data } = await http.post<Loose>(`/pension/schedules/${id}/payment`)
    const details = (data.paymentDetails ?? {}) as Loose
    const schedule = toSchedule({ ...details, ...((data.schedule as Loose | undefined) ?? { id }) })
    return { ...schedule, totalAmount: schedule.totalAmount || (num(details.total_amount) ?? 0) }
  },

  async syncPaymentStatus(id: string): Promise<void> {
    await http.get(`/pension/schedules/${id}/payment-status`)
  },

  async getDisbursements(id: string): Promise<Disbursements> {
    const { data } = await http.get<Loose>(`/pension/schedules/${id}/disbursements`)
    const raw = (data.disbursements ?? data) as Loose
    const pfas = Array.isArray(raw.pfas) ? (raw.pfas as Loose[]) : []
    return {
      status: str(raw.status) ?? 'pending',
      pfas: pfas.map((pfa) => ({
        pfaCode: String(pick(pfa, 'pfaCode', 'pfa_code') ?? ''),
        pfaName: str(pick(pfa, 'pfaName', 'pfa_name')) ?? 'Unknown PFA',
        amount: num(pfa.amount) ?? 0,
        creditedAmount: num(pick(pfa, 'creditedAmount', 'credited_amount')) ?? 0,
        status: str(pfa.status) ?? 'pending',
      })),
    }
  },

  async getComplianceReport(): Promise<PensionComplianceReport> {
    const { data } = await http.get<Loose>('/pension/compliance-report')
    const totals = (stage: string) => ({
      count: num(data[`${stage}_count`] ?? data[`${stage}Count`]) ?? 0,
      amount: num(data[`${stage}_amount`] ?? data[`${stage}Amount`]) ?? 0,
    })
    return { submitted: totals('submitted'), paid: totals('paid'), disbursed: totals('disbursed') }
  },
}
