// "+12.5%" / "-4%", or null when there's no previous salary to compare against.
export function formatSalaryChange(previous: number, next: number): string | null {
  if (!previous) return null
  const change = ((next - previous) / previous) * 100
  return `${change > 0 ? '+' : ''}${change.toFixed(1).replace(/\.0$/, '')}%`
}
