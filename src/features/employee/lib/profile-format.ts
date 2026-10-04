const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  ONBOARDING: 'Onboarding',
  PROBATION: 'On probation',
  ON_LEAVE: 'On leave',
  SUSPENDED: 'Suspended',
  TERMINATED: 'Offboarded',
}

export function humanizeEnum(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, '-')
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? humanizeEnum(status).replace(/-/g, ' ')
}

// Date-only values like "2026-10-25" are parsed as local dates so they don't shift a day.
export function toDate(value: string): Date {
  return new Date(value.length === 10 ? `${value}T00:00:00` : value)
}

export function formatLongDate(value: string): string {
  return toDate(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
