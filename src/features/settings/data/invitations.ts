import { isoDaysAgo } from '../../people/lib/dates'
import type { Invitation } from '../types/team-access-types'

export const INVITATIONS: Invitation[] = [
  {
    id: 'inv-blessing-okoro',
    email: 'blessing.okoro@stackhr.app',
    fullName: 'Blessing Okoro',
    role: 'employee',
    invitedBy: 'Halima Yusuf',
    invitedAt: isoDaysAgo(2),
    status: 'pending',
  },
  {
    id: 'inv-ibrahim-musa',
    email: 'ibrahim.musa@stackhr.app',
    fullName: 'Ibrahim Musa',
    role: 'employee',
    invitedBy: 'Femi Bello',
    invitedAt: isoDaysAgo(1),
    status: 'pending',
  },
  {
    id: 'inv-bisi-adeyemi',
    email: 'bisi.adeyemi@stackhr.app',
    fullName: 'Bisi Adeyemi',
    role: 'employee',
    invitedBy: 'Chuka Eze',
    invitedAt: isoDaysAgo(45),
    status: 'expired',
  },
]
