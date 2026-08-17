import type { LeavePolicy, LeaveType } from '../types/people-types'

export const LEAVE_TYPES: LeaveType[] = [
  {
    id: 'annual',
    name: 'Annual leave',
    defaultDays: 20,
    paid: true,
    tone: 'accent',
    description: 'Standard yearly vacation allowance, accrued monthly.',
  },
  {
    id: 'sick',
    name: 'Sick leave',
    defaultDays: 10,
    paid: true,
    tone: 'warning',
    description: 'For personal illness or injury. A medical note is required beyond 3 consecutive days.',
  },
  {
    id: 'compassionate',
    name: 'Compassionate leave',
    defaultDays: 5,
    paid: true,
    tone: 'neutral',
    description: 'For bereavement or family emergencies.',
  },
  {
    id: 'maternity',
    name: 'Maternity leave',
    defaultDays: 90,
    paid: true,
    tone: 'positive',
    description: 'Available to employees who have completed at least 6 months of service.',
  },
  {
    id: 'paternity',
    name: 'Paternity leave',
    defaultDays: 14,
    paid: true,
    tone: 'positive',
    description: 'Available to employees within 4 weeks of the birth or adoption of a child.',
  },
  {
    id: 'unpaid',
    name: 'Unpaid leave',
    defaultDays: 0,
    paid: false,
    tone: 'critical',
    description: 'Discretionary leave beyond paid allowances, subject to manager approval.',
  },
]

export const LEAVE_POLICIES: LeavePolicy[] = [
  {
    id: 'accrual',
    title: 'Accrual',
    description:
      'Annual and sick leave accrue monthly from the employee start date. New hires can request leave once at least one day has accrued.',
  },
  {
    id: 'carryover',
    title: 'Carryover',
    description: 'Up to 5 unused annual leave days can be carried into the next calendar year; all other types expire.',
  },
  {
    id: 'approval-workflow',
    title: 'Approval workflow',
    description:
      'Leave requests route to the employee’s direct manager first, then to People Ops for record-keeping once approved.',
  },
  {
    id: 'notice-period',
    title: 'Notice period',
    description:
      'Annual leave should be requested at least 5 working days in advance. Sick leave can be reported on the day, with retroactive approval.',
  },
  {
    id: 'public-holidays',
    title: 'Public holidays',
    description: 'Recognized public holidays follow the Nigerian federal calendar and do not count against leave balances.',
  },
]
