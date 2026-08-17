export interface CalendarDay {
  date: Date
  inCurrentMonth: boolean
}

export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay()
  const gridStart = new Date(year, month, 1 - startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return { date, inCurrentMonth: date.getMonth() === month }
  })
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function dateWithinRange(date: Date, startIso: string, endIso: string): boolean {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const [rangeStart, rangeEnd] = start <= end ? [start, end] : [end, start]
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const from = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate())
  const to = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate())
  return day >= from && day <= to
}
