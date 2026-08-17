import type { Team } from '../types/people-types'

export const TEAMS: Team[] = [
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Department heads steering company strategy.',
    leadEmployeeId: 'emp-amara-chukwu',
    memberIds: ['emp-amara-chukwu', 'emp-femi-bello', 'emp-tunde-salako', 'emp-chuka-eze', 'emp-halima-yusuf'],
  },
  {
    id: 'product-squad',
    name: 'Product Squad',
    description: 'Cross-functional group shipping the core product.',
    leadEmployeeId: 'emp-tunde-salako',
    memberIds: ['emp-tunde-salako', 'emp-ngozi-umeh', 'emp-ada-obi', 'emp-ibrahim-musa'],
  },
  {
    id: 'growth-squad',
    name: 'Growth Squad',
    description: 'Sales and marketing working revenue pipeline together.',
    leadEmployeeId: 'emp-chuka-eze',
    memberIds: ['emp-chuka-eze', 'emp-bisi-adeyemi', 'emp-kelechi-nnamdi', 'emp-yewande-adio', 'emp-segun-afolabi'],
  },
  {
    id: 'ops-platform',
    name: 'Ops & Platform',
    description: 'Keeps internal systems, payroll, and infrastructure running.',
    leadEmployeeId: 'emp-halima-yusuf',
    memberIds: ['emp-femi-bello', 'emp-grace-nwosu', 'emp-halima-yusuf', 'emp-blessing-okoro', 'emp-emeka-obiora'],
  },
]
