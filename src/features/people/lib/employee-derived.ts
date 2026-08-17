import type { EmployeeSeed } from '../data/employees'
import type {
  ActivityEntry,
  DocumentEntry,
  ExpenseEntry,
  LeaveBalanceEntry,
  LeaveRequestEntry,
  PayslipEntry,
  SalaryAdvanceEntry,
} from '../types/people-types'
import { isoDaysAgo, monthsBetween } from './dates'

function hashOf(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000
  }
  return hash
}

const LEAVE_TYPES = [
  { type: 'Annual leave', totalDays: 20 },
  { type: 'Sick leave', totalDays: 10 },
  { type: 'Compassionate leave', totalDays: 5 },
]

export function deriveLeaveBalance(seed: EmployeeSeed): LeaveBalanceEntry[] {
  const hash = hashOf(seed.id)
  const hasStarted = new Date(seed.startDate).getTime() <= Date.now()
  if (!hasStarted) return LEAVE_TYPES.map((entry) => ({ ...entry, usedDays: 0 }))

  return LEAVE_TYPES.map((entry, index) => ({
    ...entry,
    usedDays: Math.min(entry.totalDays, (hash + index * 7) % (entry.totalDays + 1)),
  }))
}

export function deriveLeaveRequests(seed: EmployeeSeed): LeaveRequestEntry[] {
  const hash = hashOf(seed.id)
  const hasStarted = new Date(seed.startDate).getTime() <= Date.now()
  if (!hasStarted || hash % 4 === 0) return []

  const requests: LeaveRequestEntry[] = []
  const daysAgo = 3 + (hash % 20)
  const length = 1 + (hash % 5)
  requests.push({
    id: `${seed.id}-leave-1`,
    type: hash % 3 === 0 ? 'Sick leave' : 'Annual leave',
    startDate: isoDaysAgo(daysAgo),
    endDate: isoDaysAgo(daysAgo - length),
    days: length,
    status: hash % 5 === 0 ? 'pending' : 'approved',
  })

  if (hash % 6 === 0) {
    const futureStart = isoDaysAgo(-(10 + (hash % 15)))
    requests.push({
      id: `${seed.id}-leave-2`,
      type: 'Annual leave',
      startDate: futureStart,
      endDate: isoDaysAgo(-(10 + (hash % 15) + 4)),
      days: 4,
      status: 'pending',
    })
  }

  return requests
}

export function deriveDocuments(seed: EmployeeSeed): DocumentEntry[] {
  const documents: DocumentEntry[] = [
    {
      id: `${seed.id}-doc-contract`,
      name: 'Employment contract',
      category: 'Contract',
      uploadedAt: seed.startDate,
      fileSize: '412 KB',
    },
    {
      id: `${seed.id}-doc-id`,
      name: 'Government-issued ID',
      category: 'Identification',
      uploadedAt: seed.startDate,
      fileSize: '1.1 MB',
    },
  ]

  if (seed.employmentStatus === 'active') {
    documents.push({
      id: `${seed.id}-doc-nda`,
      name: 'NDA & confidentiality agreement',
      category: 'Contract',
      uploadedAt: seed.startDate,
      fileSize: '208 KB',
    })
  }

  return documents
}

export function derivePayslips(seed: EmployeeSeed): PayslipEntry[] {
  const monthsEmployed = monthsBetween(seed.startDate, new Date().toISOString())
  const hasStarted = new Date(seed.startDate).getTime() <= Date.now()
  if (!hasStarted) return []

  const count = Math.min(6, monthsEmployed + 1)
  const netPay = Math.round((seed.compensation.salary / 12) * 0.82)
  const payslips: PayslipEntry[] = []

  for (let i = 0; i < count; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - i, 25)
    payslips.push({
      id: `${seed.id}-payslip-${i}`,
      periodLabel: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      payDate: date.toISOString(),
      netPay,
      currency: seed.compensation.currency,
      status: i === 0 ? 'processing' : 'paid',
    })
  }

  return payslips
}

const EXPENSE_TEMPLATES = [
  { category: 'Travel', description: 'Client site visit — transport' },
  { category: 'Meals', description: 'Team lunch with prospective client' },
  { category: 'Software', description: 'Annual subscription renewal' },
  { category: 'Office supplies', description: 'Replacement peripherals' },
]

export function deriveExpenses(seed: EmployeeSeed): ExpenseEntry[] {
  const hash = hashOf(seed.id)
  if (seed.employmentStatus !== 'active' || hash % 3 !== 0) return []

  const template = EXPENSE_TEMPLATES[hash % EXPENSE_TEMPLATES.length]
  return [
    {
      id: `${seed.id}-expense-1`,
      date: isoDaysAgo(2 + (hash % 10)),
      category: template.category,
      description: template.description,
      amount: 8_000 + (hash % 12) * 3_500,
      currency: seed.compensation.currency,
      status: hash % 9 === 0 ? 'pending' : 'approved',
    },
  ]
}

export function deriveSalaryAdvances(seed: EmployeeSeed): SalaryAdvanceEntry[] {
  const hash = hashOf(seed.id)
  if (seed.employmentStatus !== 'active' || hash % 4 !== 0) return []

  return [
    {
      id: `${seed.id}-advance-1`,
      requestedAt: isoDaysAgo(15 + (hash % 30)),
      amount: Math.round((seed.compensation.salary / 12) * 0.4),
      currency: seed.compensation.currency,
      repaymentMonths: 3,
      status: hash % 8 === 0 ? 'pending' : 'repaid',
    },
  ]
}

export function deriveActivity(seed: EmployeeSeed): ActivityEntry[] {
  const activity: ActivityEntry[] = [
    { id: `${seed.id}-act-join`, description: `Joined as ${seed.jobTitle}`, timestamp: seed.startDate },
  ]

  const payslips = derivePayslips(seed)
  if (payslips.length > 0) {
    activity.push({
      id: `${seed.id}-act-payslip`,
      description: `Payslip generated for ${payslips[0].periodLabel}`,
      timestamp: payslips[0].payDate,
    })
  }

  for (const request of deriveLeaveRequests(seed)) {
    activity.push({
      id: `${seed.id}-act-${request.id}`,
      description: `${request.status === 'pending' ? 'Requested' : 'Took'} ${request.type.toLowerCase()} (${request.days} day${request.days === 1 ? '' : 's'})`,
      timestamp: request.startDate,
    })
  }

  for (const expense of deriveExpenses(seed)) {
    activity.push({
      id: `${seed.id}-act-${expense.id}`,
      description: `Submitted an expense claim — ${expense.description}`,
      timestamp: expense.date,
    })
  }

  for (const advance of deriveSalaryAdvances(seed)) {
    activity.push({
      id: `${seed.id}-act-${advance.id}`,
      description: 'Requested a salary advance',
      timestamp: advance.requestedAt,
    })
  }

  return activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
