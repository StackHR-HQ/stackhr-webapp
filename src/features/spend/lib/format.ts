const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: '₦',
}

export function formatAmount(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `
  return `${symbol}${Math.round(amount).toLocaleString()}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
