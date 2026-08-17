export function isoDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export function isoDaysFromNow(days: number): string {
  return isoDaysAgo(-days)
}

export function monthsBetween(startIso: string, endIso: string): number {
  const start = new Date(startIso)
  const end = new Date(endIso)
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()))
}

export function tenureLabel(startIso: string): string {
  const months = monthsBetween(startIso, new Date().toISOString())
  if (months < 1) return 'Less than a month'
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  const parts: string[] = []
  if (years > 0) parts.push(`${years} yr${years === 1 ? '' : 's'}`)
  if (remainingMonths > 0 || years === 0) parts.push(`${remainingMonths} mo${remainingMonths === 1 ? '' : 's'}`)
  return parts.join(' ')
}
